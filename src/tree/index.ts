import { lstatSync } from "fs";
import sha256File from "sha256-file";
import { Tree } from "./Tree";

export function findTree(folder: string): Tree {
  let stat;

  try {
    stat = lstatSync(folder);
  } catch (e) {
    switch (e.code) {
      case "ENOENT": throw new Error(`Path "${folder}" doesn't exists.`);
      default: throw e;
    }
  }
  console.log(stat);

  return {
    hash: "",
    size: 0,
    path: folder,
  };
}

export function calcHashFromFile(filepath: string) {
  return sha256File(filepath);
}
