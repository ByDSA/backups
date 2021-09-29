import isTree from "@app/tree/isTree";
import Tree from "@app/tree/Tree";
import { existsSync, readFileSync, statSync } from "fs";

const malformedError = new Error("The tree file is malformed");
const fileNotExistsError = (f: string) => new Error(`File '${f}' doesn't exist`);

export default function readTree(file: string): Tree {
  if (!existsSync(file) || !statSync(file).isFile())
    throw fileNotExistsError(file);

  const treeFileTxt = readFileSync(file, "utf8");
  const treeFileAny = JSON.parse(treeFileTxt);

  if (isValidTreeFileJson(treeFileAny))
    return <Tree>treeFileAny.content;

  throw malformedError;
}

function isValidTreeFileJson(json: any): boolean {
  return json.version && isTree(json.content);
}
