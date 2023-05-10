import path from "path";
import getMainDir from "./node";

it("getPkgJsonDir", () => {
  const expected = path.resolve(__dirname, "../..");
  const actual = getMainDir();

  expect(actual).toBe(expected);
} );
