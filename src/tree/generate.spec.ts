import FilesMock from "#tests/FilesMock";
import { treeDir } from "#tests/index";
import mockGen from "#tests/trees/mocks/files1";
import path from "path";
import { readTree } from ".";
import { isEqual } from "./compare";
import findTreeAsync from "./findTree";
import generateTree from "./generate";

describe("all", () => {
  let mock1: FilesMock;

  beforeAll(async () => {
    const basePath = treeDir();

    mock1 = await mockGen(basePath).create();
  } );

  afterAll(async () => {
    await mock1.delete();
  } );

  it("exportTree", async () => {
    const basePath = treeDir();
    const expected = await findTreeAsync(basePath);
    const out = path.resolve(basePath, "test.tree");

    await generateTree( {
      out,
      folder: basePath,
    } );
    const actual = readTree(out);

    expect(isEqual(actual, expected)).toBeTruthy();
  } );
} );
