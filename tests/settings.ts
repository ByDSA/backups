import { getMainDir } from "@app/utils/node";
import path from "path";

// eslint-disable-next-line import/prefer-default-export
export function treeDir() {
  const DIR_BASE = getMainDir();

  return path.resolve(DIR_BASE, "tests/tree");
}
