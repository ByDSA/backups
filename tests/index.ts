import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import getMainDir from "#src/utils/node.js";

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
