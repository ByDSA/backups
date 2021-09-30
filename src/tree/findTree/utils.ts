import { hashFileStream } from "@app/files/hash";
import { isMountPoint } from "@app/iso/mount";
import { lstatSync } from "fs";
import path, { basename, dirname } from "path";
import sha256File from "sha256-file";
import { Tree } from "..";
import readTree from "../read";

export function checkFolderOrFileIsValid(folder: string) {
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

  if (!(stat.isFile() && isISOFile(folder)) && !stat.isDirectory())
    throw new Error(`Path ${folder} is not a valid directory`);
}

export function getTreeIndexAt(folder: string): Tree | null {
  const inFolder = path.resolve(folder, "index.tree");

  try {
    return readTree(inFolder);
  } catch (e) {
    return null;
  }
}

export function getTreeBesideAt(folder: string): Tree | null {
  const besideFolder = path.resolve(dirname(folder), `${basename(folder)}.tree`);

  try {
    return readTree(besideFolder);
  } catch (e) {
    return null;
  }
}

export function getTreeAt(folder: string): Tree | null {
  return getTreeBesideAt(folder) || getTreeIndexAt(folder);
}

export function isISOFile(folder: string) {
  return folder.toLocaleLowerCase().endsWith(".iso");
}

export async function calcHashFromFileAsync(filepath: string) {
  try {
    return sha256File(filepath);
  } catch (e) {
    return await hashFileStream(filepath); // eslint-disable-line no-return-await
  }
}

export async function getTreeFromNormalFileAsync(fullpath: string): Promise<Tree> {
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

export function isPathInMountedDevice(fullpath: string): boolean {
  while (fullpath) {
    if (isMountPoint(fullpath))
      return true;

    fullpath = dirname(fullpath); // eslint-disable-line no-param-reassign
  }

  return false;
}
