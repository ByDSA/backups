import { getPkgJsonDir } from "@app/utils";
import path from "path";

// eslint-disable-next-line import/prefer-default-export
export async function treeDir() {
  const DIR_BASE = await getPkgJsonDir();

  return path.resolve(DIR_BASE, "tests/tree");
}
