import { dirname } from "path";
import { flattenHashesMap, flattenPathsMap } from "../flat";
import { toPathsMap } from "../maps";
import Tree from "../Tree";
import Difference from "./Difference";

type Options = {

};
const OptionsDefault: Options = {

};

class CompareTreeProcess {
  private flatPathMap1;

  private flatPathMap2;

  private flatHashesMap1;

  private flatHashesMap2;

  private pathsMap1;

  private pathsMap2;

  private differencesPathMap1;

  private differencesPathMap2;

  private differences: Difference[];

  constructor(private previousTree: Tree,
    private afterTree: Tree,
    private opts?: Options) {
    this.opts = {
      ...OptionsDefault,
      ...this.opts,
    };
    this.differences = [];
  }

  private calculateMaps() {
    this.flatPathMap1 = flattenPathsMap(this.previousTree);
    this.flatPathMap2 = flattenPathsMap(this.afterTree);
    this.flatHashesMap1 = flattenHashesMap(this.previousTree);
    this.flatHashesMap2 = flattenHashesMap(this.afterTree);
    this.pathsMap1 = toPathsMap(this.previousTree);
    this.pathsMap2 = toPathsMap(this.afterTree);
    this.differencesPathMap1 = new Map<string, Difference[]>();
    this.differencesPathMap2 = new Map<string, Difference[]>();
  }

  process(): Difference[] {
    this.calculateMaps();

    for (const pair of this.pathsMap1) {
      const from = pair[0];
      const prev = pair[1];

      if (!this.pathsMap2.has(from)) { // Deleted, moved or renamed
        const afterNodesWithPrevNodeHash = this.flatHashesMap2.get(prev.hash);

        if (afterNodesWithPrevNodeHash) { // moved or renamed
          const to = afterNodesWithPrevNodeHash[0].path;
          // TODO: para considerarse movido, no tiene que existir el path en el tree original;
          // si existe, es deleted
          // TODO: y si hay más de un archivo con ese hash?
          const isRenamed = dirname(to) === dirname(from);
          const difference: Difference = {
            type: isRenamed ? "renamed" : "moved",
            from,
            to,
          };

          this.addDifference(difference);
        } else {
          this.addDifference( {
            type: "deleted",
            from,
          } );
        }
      }
    }

    for (const pair of this.pathsMap2) {
      const to = pair[0];
      const after = pair[1];

      if (!this.pathsMap1.has(to) && !this.differencesPathMap2.get(to)) {
        this.addDifference( {
          type: "created",
          to,
          tree: after,
        } );
      }
    }

    // Trees que se han movido (mismo hash, otra ruta, ignorar archivos vacíos)

    // Trees nuevos

    // Trees modificados

    return this.differences;
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

export default function compareTree(
  previousTree: Tree,
  afterTree: Tree,
  opts?: Options,
): Difference[] {
  return new CompareTreeProcess(previousTree, afterTree, opts).process();
}
