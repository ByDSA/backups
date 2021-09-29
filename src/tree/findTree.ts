import { rm } from "@app/files";
import { hashFileStream } from "@app/files/hash";
import { mountISO, umountISO } from "@app/iso";
import { Dirent, lstatSync, readdirSync } from "fs";
import { basename, resolve } from "path";
import sha256File from "sha256-file";
import { calculateHashOfBranches, calculateSizeOfBranches } from "./branches";
import Tree from "./Tree";

function checkFolderIsValid(folder: string) {
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

function dirent2Tree(folder: string): (d: Dirent)=> Promise<Tree> {
  return async (d: Dirent) => {
    const fullpath = resolve(folder, d.name);
    const stats = lstatSync(fullpath);
    const baseNode = {
      name: d.name,
      modificatedAt: stats.mtimeMs / 1000,
      createdAt: stats.ctimeMs / 1000,
      accessedAt: stats.atimeMs / 1000,
    };

    if (d.isFile()) {
      console.log(`Reading file ${fullpath} ...`);
      const hash = await calcHashFromFile(fullpath);
      let children;

      if (d.name.endsWith(".iso")) {
        const isoTree = await findTree(fullpath);

        children = isoTree.children;
      }

      const ret: Tree = {
        ...baseNode,
        size: stats.size,
        hash,
        children,
      };

      return ret;
    }

    if (d.isDirectory()) {
      const subBranches = await getBranchesFrom(fullpath);

      console.log(`Reading folder ${fullpath} ...`);
      const size = calculateSizeOfBranches(subBranches);
      const hash = calculateHashOfBranches(subBranches);
      const ret: Tree = {
        ...baseNode,
        size,
        hash,
        children: subBranches,
      };

      return ret;
    }

    throw new Error();
  };
}

// eslint-disable-next-line require-await
async function getBranchesFrom(folder: string): Promise<Tree[]> {
  const content = readdirSync(folder, {
    withFileTypes: true,
  } );
  const branches: Tree[] = [];

  for (const d of content) {
    // eslint-disable-next-line no-await-in-loop
    const b = await dirent2Tree(folder)(d);

    branches.push(b);
  }

  return Promise.all(branches);
}

function isISO(folder: string) {
  return folder.endsWith(".iso");
}

type Options = {
  superNodeName: string;
};

export async function findTree(folder: string, opts?: Options): Promise<Tree> {
  const createdAt = Date.now();

  checkFolderIsValid(folder);

  let isMountedTmpFolder = false;

  if (isISO(folder)) {
    folder = mountISO(folder); // eslint-disable-line no-param-reassign
    isMountedTmpFolder = true;
  }

  const branches = await getBranchesFrom(folder);
  const hash = calculateHashOfBranches(branches);
  const size = calculateSizeOfBranches(branches);

  if (isMountedTmpFolder) {
    umountISO(folder);
    rm(folder);
  }

  return {
    hash,
    size,
    name: opts?.superNodeName || basename(folder),
    modificatedAt: Date.now(),
    accessedAt: Date.now(),
    createdAt,
    children: branches,
  };
}

export async function calcHashFromFile(filepath: string) {
  try {
    return sha256File(filepath);
  } catch (e) {
    // eslint-disable-next-line no-return-await
    return await hashFileStream(filepath);
  }
}
