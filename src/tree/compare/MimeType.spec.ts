import FilesMock from "@tests/FilesMock";
import { treeDir } from "@tests/index";
import { genFileMimeMock } from "@tests/trees";
import path from "path";
import Mime, { getMimeType } from "./MimeType";

describe("all", () => {
  let DIR_BASE: string;
  let mock1: FilesMock;

  beforeAll(async () => {
    DIR_BASE = path.resolve(treeDir(), "mime");
    Object.freeze(DIR_BASE);

    mock1 = await genFileMimeMock(DIR_BASE).create();
  } );

  afterAll(async () => {
    await mock1.delete();
  } );

  it("text", () => {
    const expected = Mime.TEXT;
    const fullpath = path.resolve(DIR_BASE, "text");
    const actual = getMimeType(fullpath);

    expect(actual).toBe(expected);
  } );
  it("noContent", () => {
    const expected = Mime.EMPTY;
    const fullpath = path.resolve(DIR_BASE, "noContent");
    const actual = getMimeType(fullpath);

    expect(actual).toBe(expected);
  } );
  it("not exists", () => {
    const fullpath = path.resolve(DIR_BASE, "not exists");
    const actual = getMimeType(fullpath);

    expect(actual).toBeNull();
  } );
  it("png", () => {
    const expected = Mime.PNG;
    const fullpath = path.resolve(DIR_BASE, "image.png");
    const actual = getMimeType(fullpath);

    expect(actual).toBe(expected);
  } );

  it("fake png (text for real)", () => {
    const expected = Mime.TEXT;
    const fullpath = path.resolve(DIR_BASE, "fakeImage.png");
    const actual = getMimeType(fullpath);

    expect(actual).toBe(expected);
  } );

  it("bmp", () => {
    const expected = Mime.BMP;
    const fullpath = path.resolve(DIR_BASE, "image.bmp");
    const actual = getMimeType(fullpath);

    expect(actual).toBe(expected);
  } );
  it("txt", () => {
    const expected = Mime.TEXT;
    const fullpath = path.resolve(DIR_BASE, "text.txt");
    const actual = getMimeType(fullpath);

    expect(actual).toBe(expected);
  } );
} );
