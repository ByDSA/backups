import { testsTmpDir } from "@tests/index";
import { writeFileSync } from "fs";
import path from "path";
import sha256File from "sha256-file";
import { hashFileStream } from "./hashFileStream";

describe("all", () => {
  const fullFilePath = path.resolve(testsTmpDir(), "file");

  beforeAll(() => {
    writeFileSync(fullFilePath, "asdfg");
  } );
  it("Same as normal", async () => {
    const expected = sha256File(fullFilePath);
    const actual = await hashFileStream(fullFilePath);

    expect(actual).toBe(expected);
  } );

  it("hashFileStream", async () => {
    const actual = await hashFileStream(fullFilePath);

    expect(actual).toBe("f969fdbe811d8a66010d6f8973246763147a2a0914afc8087839e29b563a5af0");
  }, 1000);
} );
