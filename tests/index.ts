import { getMainDir } from "@app/utils/node";
import { mkdirSync } from "fs";
import path from "path";

export function treeDir() {
  return path.resolve(testsTmpDir(), "tree");
}

export function testsTmpDir() {
  const DIR_BASE = getMainDir();

  return path.resolve(DIR_BASE, "tmp");
}

export function mkTmpDir() {
  mkdirSync(testsTmpDir(), {
    recursive: true,
  } );
}
