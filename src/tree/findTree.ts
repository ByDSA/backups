import crypto from "crypto";
import { Dirent, lstatSync, readdirSync } from "fs";
import { basename, resolve } from "path";
import sha256File from "sha256-file";
import { Tree } from "./Tree";

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

  if (!stat.isDirectory())
    throw new Error(`Path ${folder} is not a directory`);
}

function dirent2Tree(folder: string): (d: Dirent)=> Tree {
  return (d: Dirent) => {
    const fullpath = resolve(folder, d.name);
    const stats = lstatSync(fullpath);
    const baseNode = {
      name: d.name,
      modificatedAt: stats.mtimeMs / 1000,
      createdAt: stats.ctimeMs / 1000,
      accessedAt: stats.atimeMs / 1000,
    };

    if (d.isFile()) {
      const hash = sha256File(fullpath);
      const ret: Tree = {
        ...baseNode,
        size: stats.size,
        hash,
      };

      return ret;
    }

    if (d.isDirectory()) {
      const subBranches = getBranchesFrom(fullpath);
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

function calculateSizeOfBranches(branches: Tree[]) {
  let size = 0;

  branches.forEach((n) => {
    size += n.size;
  } );

  return size;
}

function createSha256CspHash(content: string) {
  return crypto
    .createHash("sha256")
    .update(content)
    .digest("hex");
}

function calculateHashOfBranches(branches: Tree[]) {
  const joinedHashes = branches
    .map((n) => n.hash)
    .sort()
    .join();

  return createSha256CspHash(joinedHashes);
}

function getBranchesFrom(folder: string): Tree[] {
  const content = readdirSync(folder, {
    withFileTypes: true,
  } );
  const branches = content.map(dirent2Tree(folder));

  return branches;
}

// eslint-disable-next-line require-await
export async function findTree(folder: string): Promise<Tree> {
  const createdAt = Date.now();

  checkFolderIsValid(folder);

  const branches = getBranchesFrom(folder);
  const hash = calculateHashOfBranches(branches);
  const size = calculateSizeOfBranches(branches);

  return {
    hash,
    size,
    name: basename(folder),
    modificatedAt: Date.now(),
    accessedAt: Date.now(),
    createdAt,
    children: branches,
  };
}

export function calcHashFromFile(filepath: string) {
  return sha256File(filepath);
}
