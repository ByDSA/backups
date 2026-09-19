import type { Tree } from "../../Tree.js";
import flattenNode from "../flattenNode.js";
import { FlatTree } from "../FlatTree.js";
import { Path, PathsMap } from "./types.js";

export default function flattenPathsMap(t: Tree, basePath: string = "", acc: PathsMap = new Map<Path, FlatTree>()): PathsMap {
  const flatNode = flattenNode(t, basePath);

  acc.set(flatNode.path, flatNode);

  if (t.children) {
    for (const c of t.children)
      flattenPathsMap(c, `${basePath}/${t.name}`, acc);
  }

  return acc;
}
