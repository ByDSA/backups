import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import Tree from "./Tree";

const packageJson = JSON.parse(readFileSync(join(__dirname, "..", "..", "package.json")).toString());
const VERSION = packageJson.version;

export default function saveTree(tree: Tree, p: string) {
  const fileJson = {
    version: VERSION,
    content: tree,
  };

  writeFileSync(p, JSON.stringify(fileJson));
}
