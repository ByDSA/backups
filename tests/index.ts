import { mkdirSync } from "fs";
import { resolve } from "path";
import getMainDir from "~/utils/node";

export function treeDir() {
  return resolve(testsTmpDir(), "tree");
}

export function testsTmpDir() {
  const DIR_BASE = getMainDir();

  return resolve(DIR_BASE, "tmp");
}

export function mkTmpDir() {
  mkdirSync(testsTmpDir(), {
    recursive: true,
  } );
}
