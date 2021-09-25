import path from "path";
import { getPkgJsonDir } from "../utils";
import { findTree } from "./index";

const DIR_BASE = await getPkgJsonDir();
const DIR_TREE_BASE = path.resolve(DIR_BASE, "tests/tree");

it("findTree", () => {
  const expected = null;
  const actual = findTree(DIR_TREE_BASE);

  expect(actual).toBe(expected);
} );
