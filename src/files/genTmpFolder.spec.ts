import { mkTmpDir, testsTmpDir } from "@tests/index";
import { existsSync } from "fs";
import path from "path";
import { rm } from ".";
import genTmpFolder from "./genTmpFolder";

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
