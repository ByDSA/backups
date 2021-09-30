import { existsSync, mkdirSync } from "fs";
import path from "path";

export default function genTmpFolder(location: string, nameBase?: string): string {
  // eslint-disable-next-line no-param-reassign
  nameBase ??= "asdf";
  let num = 1;

  while (existsSync(getFullPath(location, folderWithNum(nameBase, num))))
    num++;

  // eslint-disable-next-line no-param-reassign
  nameBase = folderWithNum(nameBase, num);

  const fullPath = getFullPath(location, nameBase);

  mkdirSync(fullPath);

  return fullPath;
}

function folderWithNum(folder: string, num: number = 1) {
  if (num <= 1)
    return folder;

  return folder + num;
}

function getFullPath(location: string, folder: string): string {
  return path.resolve(location, folder);
}
