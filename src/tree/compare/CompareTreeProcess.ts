import { dirname } from "path";
import Tree, { isTreeSymlink } from "../Tree";
import { flattenHashesMap, flattenPathsMap } from "../flat";
import { HashesMap, PathsMap } from "../flat/maps/types";
import { toPathsMap } from "../maps";
import Options, { DEFAULT_OPTIONS } from "./Options";
import Difference from "./types/Difference";
import { genIsFolderObj, ignoreListContains } from "./utils";

type ProcessFromDifferenceOpts = {
  from: string;
  isFolder: boolean;
};

type ProcessToDifferenceOpts = {
  to: string;
  isFolder: boolean;
};

type ProcessFromToDifferenceOpts = ProcessFromDifferenceOpts & ProcessToDifferenceOpts;

export default class CompareTreeProcess {
  private flatPathMap1?: PathsMap;

  private flatPathMap2?: PathsMap;

  private flatHashesMap1?: HashesMap;

  private flatHashesMap2?: HashesMap;

  private pathsMap1: Map<string, Tree>;

  private pathsMap2: Map<string, Tree>;

  private differencesPathMap1: Map<string, Difference[]>;

  private differencesPathMap2: Map<string, Difference[]>;

  private differences: Difference[];

  private ignoredMove: string[];

  private ignoredDelete: string[];

  constructor(
    private previousTree: Tree,
    private afterTree: Tree,
    private opts?: Options,
  ) {
    this.opts = {
      ...DEFAULT_OPTIONS,
      ...this.opts,
    };
    this.differences = [];

    this.differencesPathMap1 = new Map<string, Difference[]>();
    this.differencesPathMap2 = new Map<string, Difference[]>();
    this.pathsMap1 = new Map<string, Tree>();
    this.pathsMap2 = new Map<string, Tree>();

    this.ignoredMove = [];
    this.ignoredDelete = [];
  }

  private calculateMaps() {
    this.flatPathMap1 = flattenPathsMap(this.previousTree);
    this.flatPathMap2 = flattenPathsMap(this.afterTree);
    this.flatHashesMap1 = flattenHashesMap(this.previousTree);
    this.flatHashesMap2 = flattenHashesMap(this.afterTree);
    this.pathsMap1 = toPathsMap(this.previousTree);
    this.pathsMap2 = toPathsMap(this.afterTree);
  }

  process(): Difference[] {
    this.calculateMaps();

    if (!this.flatHashesMap2)
      throw new Error("flatHashesMap2 is undefined");

    for (const pair of this.pathsMap1) {
      const from = pair[0];
      const prev = pair[1];
      const isFolder = !!prev.children;

      if (isTreeSymlink(prev))
        // eslint-disable-next-line no-continue
        continue;

      if (!this.pathsMap2.has(from)) { // Deleted, moved or renamed
        const afterNodesWithPrevNodeHash = this.flatHashesMap2.get(prev.hash);

        if (afterNodesWithPrevNodeHash) { // moved or renamed
          const to = afterNodesWithPrevNodeHash[0].path;
          const type = dirname(to) === dirname(from) ? "renamed" : "moved";
          const params = {
            from,
            to,
            isFolder,
          };

          if (type === "moved")
            this.processMovedDifference(params);
            // TODO: para considerarse movido, no tiene que existir el path en el tree original;
          // si existe, es deleted
          // TODO: y si hay más de un archivo con ese hash?
          else
            this.processRenamedDifference(params);
        } else {
          const params = {
            from,
            isFolder,
          };

          this.processDeletedDifference(params);
        }
      }
    }

    for (const pair of this.pathsMap2) {
      const to = pair[0];
      const after = pair[1];
      const isFolder = !!after.children;

      if (!this.pathsMap1.has(to) && !this.differencesPathMap2.get(to)) {
        const params = {
          to,
          isFolder,
          tree: after,
        };

        this.processCreatedDifference(params);
      }
    }

    // Trees que se han movido (mismo hash, otra ruta, ignorar archivos vacíos)

    // Trees nuevos

    // Trees modificados

    return this.differences;
  }

  private processMovedDifference( { from, to, isFolder }: ProcessFromToDifferenceOpts) {
    if (ignoreListContains(this.ignoredMove, from))
      return;

    if (isFolder)
      this.ignoredMove.push(from);

    const difference: Difference = {
      type: "moved",
      from,
      to,
      ...genIsFolderObj(isFolder),
    };

    this.addDifference(difference);
  }

  private processDeletedDifference( { from, isFolder }: ProcessFromDifferenceOpts) {
    if (ignoreListContains(this.ignoredDelete, from)) { /* empty */ }

    this.addDifference( {
      type: "deleted",
      from,
      ...genIsFolderObj(isFolder),
    } );
  }

  private processRenamedDifference( { from, to, isFolder }: ProcessFromToDifferenceOpts) {
    const difference: Difference = {
      type: "renamed",
      from,
      to,
      ...genIsFolderObj(isFolder),
    };

    this.addDifference(difference);
  }

  private processCreatedDifference( { to,
    isFolder,
    tree }: ProcessToDifferenceOpts & {tree: Tree} ) {
    this.addDifference( {
      type: "created",
      to,
      tree,
      ...genIsFolderObj(isFolder),
    } );
  }

  private addDifference(difference: Difference) {
    switch (difference.type) {
      case "created":
      case "updated":
        {
          const { to } = difference;

          this.addToDiffMap2(to, difference);
        }
        break;
      case "renamed":
      case "moved":
        {
          const { to, from } = difference;

          this.addToDiffMap1(from, difference);
          this.addToDiffMap2(to, difference);
        }
        break;
      case "deleted":
        {
          const { from } = difference;

          this.addToDiffMap1(from, difference);
        }
        break;
      default: throw new Error();
    }
    this.differences.push(difference);

    if (this.opts?.onDifference) {
      if (!this.opts?.filter || this.opts?.filter(difference))
        this.opts.onDifference(difference);
    }
  }

  private addToDiffMap2(to: string, difference: Difference) {
    let array = this.differencesPathMap2.get(to);

    if (!array) {
      array = [];
      this.differencesPathMap2.set(to, array);
    }

    array.push(difference);
  }

  private addToDiffMap1(from: string, difference: Difference) {
    let array = this.differencesPathMap2.get(from);

    if (!array) {
      array = [];
      this.differencesPathMap1.set(from, array);
    }

    array.push(difference);
  }
}
