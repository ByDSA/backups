import path from "node:path";
import getMainDir from "./node.js";

it("getPkgJsonDir", () => {
  const expected = path.resolve(import.meta.dirname, "../..");
  const actual = getMainDir();

  expect(actual).toBe(expected);
} );
