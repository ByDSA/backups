import { mkTmpDir, testsTmpDir } from "#tests/index";
import { existsSync } from "node:fs";
import path from "node:path";
import { rm } from ".";
import genTmpFolder from "./genTmpFolder.js";

const TESTS_DIR = testsTmpDir();

beforeAll(() => {
  mkTmpDir();
} );

it("creates folder", () => {
  const here = TESTS_DIR;
  const actual = genTmpFolder(here);

  expect(existsSync(actual)).toBeTruthy();

  rm(actual);
} );

it("name normal", () => {
  const here = TESTS_DIR;
  const actual = genTmpFolder(here);
  const expected = path.resolve(here, "asdf");

  rm(actual);

  expect(actual).toBe(expected);
} );

it("name with spaces", () => {
  const here = TESTS_DIR;
  const nameBase = "name with spaces";
  const actual = genTmpFolder(here, nameBase);
  const expected = path.resolve(here, nameBase);

  rm(actual);

  expect(actual).toBe(expected);
} );
