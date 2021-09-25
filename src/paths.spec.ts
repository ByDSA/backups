import { dirname } from "./paths";

it("dirname", () => {
  const expected = "base";
  const actual = dirname("base/file");

  expect(actual).toBe(expected);
} );
