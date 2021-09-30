import { rm } from "@app/files";
import { hashFileStream } from "@app/files/hash";
import { mountISO, umountISO } from "@app/iso";
import { Dirent, lstatSync, readdirSync } from "fs";
import path, { basename, dirname, resolve } from "path";
import sha256File from "sha256-file";
import { calculateHashOfBranches as calculateHashOfChildren, calculateSizeOfBranches as calculateSizeOfChildren } from "./branches";
import readTree from "./read";
import Tree from "./Tree";

type Options = {
  superNodeName?: string;
  isInsideISO?: boolean;
  lastFolderOutsideISO?: string;
  useExistentTrees?: boolean;
};
const DefaultOptions = {
  isInsideISO: false,
  useExistentTrees: true,
};

function checkFolderOrFileIsValid(folder: string) {
  let stat;

  try {
    stat = lstatSync(folder);
  } catch (e) {
    if ((<any>e).code !== undefined) {
      switch ((<any>e).code) {
        case "ENOENT": throw new Error(`Path "${folder}" doesn't exists.`);
        default: throw e;
      }
    }
  }

  if (!stat)
    throw new Error("Unexpected error");

  if (!(stat.isFile() && isISO(folder)) && !stat.isDirectory())
    throw new Error(`Path ${folder} is not a valid directory`);
}

function getTreeIndexAt(folder: string): Tree | null {
  const inFolder = path.resolve(folder, "index.tree");

  try {
    return readTree(inFolder);
  } catch (e) {
    return null;
  }
}

function getTreeBesideAt(folder: string): Tree | null {
  const besideFolder = path.resolve(dirname(folder), `${basename(folder)}.tree`);

  try {
    return readTree(besideFolder);
  } catch (e) {
    return null;
  }
}

function getTreeAt(folder: string): Tree | null {
  return getTreeBesideAt(folder) || getTreeIndexAt(folder);
}

class FindTreeProcess {
  private opts: Options;

  constructor(opts?: Options) {
    this.opts = {
      ...DefaultOptions,
      ...opts,
    };
  }

  private async getTreeFromISOAsync(fullpath: string): Promise<Tree> {
    console.log(`Reading ISO ${fullpath} ...`);
    const previousState = this.opts.isInsideISO;

    this.updateLastFolderOutsideISO(fullpath);
    this.opts.isInsideISO = true;

    let tree: Tree | null | undefined;

    if (this.opts.useExistentTrees)
      tree = getTreeBesideAt(fullpath);

    try {
      if (!tree)
        tree = await this.processAsync(fullpath);
    } catch (e2) { // Error on mount
      if (e2 instanceof Error)
        console.log(e2.message);

      tree = await getTreeFromNormalFileAsync(fullpath);
    }

    this.opts.isInsideISO = previousState;

    return tree;
  }

  private async getTreeFromFolderAsync(fullpath: string) {
    console.log(`Reading folder ${fullpath} ...`);
    let ret: Tree | null | undefined;

    if (this.opts.useExistentTrees) {
      ret = getTreeAt(fullpath);

      if (ret)
        return ret;
    }

    const stats = lstatSync(fullpath);
    const children = await this.getChildrenFromFolder(fullpath);
    const size = calculateSizeOfChildren(children);
    const hash = calculateHashOfChildren(children);
    const name = this.opts?.superNodeName || basename(fullpath);

    ret = {
      name,
      modificatedAt: stats.mtimeMs / 1000,
      createdAt: stats.ctimeMs / 1000,
      accessedAt: stats.atimeMs / 1000,
      size,
      hash,
      children,
    };

    return ret;
  }

  private dirent2TreeAsync(folder: string): (d: Dirent)=> Promise<Tree> {
    return (d: Dirent) => {
      const fullpath = resolve(folder, d.name);

      if (d.isFile()) {
        if (isISO(d.name))
          return this.getTreeFromISOAsync(fullpath);

        return getTreeFromNormalFileAsync(fullpath);
      }

      if (d.isDirectory())
        return this.getTreeFromFolderAsync(fullpath);

      throw new Error();
    };
  }

  private async getChildrenFromFolder(folder: string): Promise<Tree[]> {
    if (this.opts.useExistentTrees) {
      const children = getTreeAt(folder)?.children;

      if (children)
        return children;
    }

    const content = readdirSync(folder, {
      withFileTypes: true,
    } );
    const branches: Tree[] = [];

    for (const d of content) {
      // eslint-disable-next-line no-await-in-loop
      const b = await this.dirent2TreeAsync(folder)(d);

      branches.push(b);
    }

    return Promise.all(branches);
  }

  private updateLastFolderOutsideISO(file: string) {
    if (!this.opts.isInsideISO)
      this.opts.lastFolderOutsideISO = dirname(file);
  }

  async processAsync(folderOrFile: string) {
    if (!this.opts.lastFolderOutsideISO)
      this.opts.lastFolderOutsideISO = dirname(folderOrFile);

    checkFolderOrFileIsValid(folderOrFile);

    let isMountedTmpFolder = false;

    if (isISO(folderOrFile)) {
      this.opts.isInsideISO = true;
      // eslint-disable-next-line no-param-reassign
      folderOrFile = mountISO(folderOrFile, {
        baseFolder: this.opts.lastFolderOutsideISO,
      } );
      checkFolderOrFileIsValid(folderOrFile);
      isMountedTmpFolder = true;
    }

    const ret = await this.getTreeFromFolderAsync(folderOrFile);

    if (isMountedTmpFolder) {
      try {
        umountISO(folderOrFile);
        rm(folderOrFile);
      // eslint-disable-next-line no-empty
      } catch (e) { }
    }

    return ret;
  }
}

function isISO(folder: string) {
  return folder.toLocaleLowerCase().endsWith(".iso");
}

export default function findTreeAsync(folder: string, opts?: Options): Promise<Tree> {
  return new FindTreeProcess(opts).processAsync(folder);
}

export async function calcHashFromFileAsync(filepath: string) {
  try {
    return sha256File(filepath);
  } catch (e) {
    // eslint-disable-next-line no-return-await
    return await hashFileStream(filepath);
  }
}

async function getTreeFromNormalFileAsync(fullpath: string): Promise<Tree> {
  console.log(`Reading file ${fullpath} ...`);
  const stats = lstatSync(fullpath);
  const baseNode = {
    name: basename(fullpath),
    modificatedAt: stats.mtimeMs / 1000,
    createdAt: stats.ctimeMs / 1000,
    accessedAt: stats.atimeMs / 1000,
  };
  const hash = await calcHashFromFileAsync(fullpath);

  return {
    ...baseNode,
    size: stats.size,
    hash,
  };
}
