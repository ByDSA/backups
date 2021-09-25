import path from "path";
import { getPkgJsonDir } from "./utils";

it("getPkgJsonDir", async () => {
  const expected = path.resolve(__dirname, "../");
  const actual = await getPkgJsonDir();

  expect(actual).toBe(expected);
} );
