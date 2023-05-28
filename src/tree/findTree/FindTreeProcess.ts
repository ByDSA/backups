import { Dirent, lstatSync, readdirSync } from "fs";
import { basename, dirname, resolve } from "path";
import { rm } from "~/files";
import { mountISO, umountISO } from "~/iso";
import Tree from "../Tree";
import { calculateHashOfBranches as calculateHashOfChildren, calculateSizeOfBranches as calculateSizeOfChildren } from "../branches";
import Options, { DEFAULT as DEFAULT_OPTIONS } from "./types/Options";
import { checkFolderOrFileIsValid, getTreeAt, getTreeBesideAt, getTreeFromNormalFileAsync, getTreeFromSymlink as getTreeFromSymlinkAsync, isISOFile, isPathInMountedDevice } from "./utils";

export default class FindTreeProcess {
  private opts: Options;

  private currentFolder: string | undefined;

  private isInsideISO: boolean;

  private lastFolderOutsideISO: string | undefined;

  private mainFolderOrFile: string | undefined;

  constructor(opts?: Options) {
    this.opts = {
      ...DEFAULT_OPTIONS,
      ...opts,
    };

    this.isInsideISO = false;
  }

  // eslint-disable-next-line require-await
  private async getTreeFromISOAsync(fullpath: string): Promise<Tree> {
    console.log(`Reading ISO ${fullpath} ...`);

    this.updateLastFolderOutsideISO(fullpath);

    let tree: Tree | null | undefined;

    if (this.opts.useExistentTrees) {
      tree = getTreeBesideAt(fullpath);

      if (tree)
        return tree;
    }

    if (!this.opts.followISOs)
      return getTreeFromNormalFileAsync(fullpath);

    try {
      return this.processAsync(fullpath, false);
    } catch (e2) { // Error on mount
      if (e2 instanceof Error)
        console.log(e2.message);

      return getTreeFromNormalFileAsync(fullpath);
    }
  }

  private async getTreeFromFolderAsync(fullpath: string) {
    console.log(`Reading folder ${fullpath} ...`);

    let ret: Tree | null | undefined;

    if (this.opts.useExistentTrees) {
      ret = getTreeAt(fullpath);

      if (ret)
        return ret;
    }

    const previousFolder = this.currentFolder;

    this.currentFolder = fullpath;

    const stats = lstatSync(fullpath);
    const children = await this.getChildrenFromFolder(fullpath);
    const size = calculateSizeOfChildren(children);
    const hash = calculateHashOfChildren(children);
    const name = basename(fullpath);

    ret = {
      name,
      modificatedAt: stats.mtimeMs / 1000,
      createdAt: stats.ctimeMs / 1000,
      accessedAt: stats.atimeMs / 1000,
      size,
      hash,
      children,
    };

    this.currentFolder = previousFolder;

    return ret;
  }

  private dirent2TreeAsync(d: Dirent): Promise<Tree> {
    const fullpath = resolve(<string> this.currentFolder, d.name);

    if (d.isSymbolicLink())
      return getTreeFromSymlinkAsync(fullpath);

    if (d.isFile()) {
      if (isISOFile(d.name))
        return this.getTreeFromISOAsync(fullpath);

      return getTreeFromNormalFileAsync(fullpath);
    }

    if (d.isDirectory())
      return this.getTreeFromFolderAsync(fullpath);

    if (d.isBlockDevice())
      throw new Error(`'${fullpath}' is Block Device.`);

    if (d.isCharacterDevice())
      throw new Error(`'${fullpath}' is Character Device.`);

    if (d.isFIFO())
      throw new Error(`'${fullpath}' is FIFO.`);

    if (d.isSocket())
      throw new Error(`'${fullpath}' is Socket.`);

    throw new Error(`Unexpected error processing '${fullpath}'`);
  }

  // eslint-disable-next-line require-await
  private async getChildrenFromFolder(folder: string): Promise<Tree[]> {
    if (this.opts.useExistentTrees) {
      const children = getTreeAt(folder)?.children;

      if (children)
        return children;
    }

    const content = readdirSync(folder, {
      withFileTypes: true,
    } );

    // TODO: enalces simbólicos?

    if (this.isInsideISO)
      return this.dirents2TreeArrayInsideISOAsync(content);

    return this.dirents2TreeArrayNormalAsync(content);
  }

  private async dirents2TreeArrayNormalAsync(content: Dirent[]): Promise<Tree[]> {
    const branches: Tree[] = [];

    for (const d of content) {
      // TODO: ignore trees if option
      const b = await this.dirent2TreeAsync(d); // eslint-disable-line no-await-in-loop

      branches.push(b);
    }

    return branches;
  }

  // ISO problem: https://askubuntu.com/a/650022
  private async dirents2TreeArrayInsideISOAsync(content: Dirent[]): Promise<Tree[]> {
    const branches: Tree[] = [];
    const names = new Set();

    for (const d of content) {
      // TODO: ignore trees if option

      const dName = d.name;

      if (names.has(dName))
        continue; // eslint-disable-line no-continue

      names.add(dName);

      const b = await this.dirent2TreeAsync(d); // eslint-disable-line no-await-in-loop

      branches.push(b);
    }

    return branches;
  }

  private updateLastFolderOutsideISO(file: string) {
    if (!this.isInsideISO)
      this.lastFolderOutsideISO = dirname(file);
  }

  // eslint-disable-next-line require-await
  async processAsync(folderOrFile: string, isMainNode = true) {
    if (isMainNode) {
      this.mainFolderOrFile = folderOrFile;
      this.lastFolderOutsideISO = dirname(this.mainFolderOrFile);

      if (isPathInMountedDevice(folderOrFile))
        this.isInsideISO = true;
    }

    if (isISOFile(folderOrFile))
      return this.processISOAsync(folderOrFile);

    return this.processNormalAsync(folderOrFile);
  }

  private async processNormalAsync(folderOrFile: string): Promise<Tree> {
    checkFolderOrFileIsValid(folderOrFile);

    const ret = await this.getTreeFromFolderAsync(folderOrFile);

    return ret;
  }

  private async processISOAsync(fileFullpath: string): Promise<Tree> {
    const previousState = this.isInsideISO;
    const fileName = fileFullpath;

    this.isInsideISO = true;

    fileFullpath = mountISO(fileFullpath, { // eslint-disable-line no-param-reassign
      baseFolder: this.lastFolderOutsideISO,
    } );

    checkFolderOrFileIsValid(fileFullpath);

    const ret = await this.getTreeFromFolderAsync(fileFullpath);

    ret.name = fileName;
    try {
      umountISO(fileFullpath);
      rm(fileFullpath);
    } catch (e) { }// eslint-disable-line no-empty

    this.isInsideISO = previousState;

    return ret;
  }
}
