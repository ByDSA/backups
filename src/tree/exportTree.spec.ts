import mockGen from "@mocks/files1";
import FilesMock from "@tests/FilesMock";
import { treeDir } from "@tests/settings";
import path from "path";
import { readTree } from ".";
import isTreeEqual from "./compareTree";
import exportTree from "./exportTree";
import { findTree } from "./findTree";

describe("all", () => {
  let mock1: FilesMock;

  beforeAll(async () => {
    const basePath = await treeDir();

    mock1 = await mockGen(basePath).create();
  } );

  afterAll(async () => {
    await mock1.delete();
  } );

  it("exportTree", async () => {
    const basePath = await treeDir();
    const expected = await findTree(basePath);
    const out = path.resolve(basePath, "test.tree");

    await exportTree( {
      out,
      folder: basePath,
    } );
    const actual = readTree(out);

    expect(isTreeEqual(actual, expected)).toBeTruthy();
  } );
} );
