import { existsSync, mkdirSync } from "fs";
import path from "path";

export default function genTmpFolder(location: string, nameBase?: string): string {
  // eslint-disable-next-line no-param-reassign
  nameBase ??= "asdf";
  let num = 1;

  while (existsSync(folderWithNum(nameBase, num)))
    num++;

  // eslint-disable-next-line no-param-reassign
  nameBase = folderWithNum(nameBase, num);

  const fullPath = path.resolve(location, nameBase);

  mkdirSync(fullPath);

  return fullPath;
}

function folderWithNum(folder: string, num: number = 1) {
  if (num <= 1)
    return folder;

  return folder + num;
}
