import { writeFileSync } from "fs";
import Tree from "./Tree";

const V0_0_1 = "0.0.1";
const LATEST_VERSION = V0_0_1;

export default function saveTree(tree: Tree, p: string) {
  const fileJson = {
    version: LATEST_VERSION,
    content: tree,
  };

  writeFileSync(p, JSON.stringify(fileJson));
}
