import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Tree } from "./Tree.js";

const packageJson = JSON.parse(readFileSync(join(import.meta.dirname, "..", "..", "package.json")).toString());
const VERSION = packageJson.version;

export default function saveTree(tree: Tree, p: string) {
  const fileJson = {
    version: VERSION,
    content: tree,
  };

  writeFileSync(p, JSON.stringify(fileJson));
}
