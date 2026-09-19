import { type Tree, isTreeSymlink } from "../../Tree.js";
import flattenNode from "../flattenNode.js";
import type { FlatTree } from "../FlatTree.js";
import type { Hash, HashesMap } from "./types.js";

export default function flattenHashesMap(t: Tree, basePath: string = "", acc: HashesMap = new Map<Hash, FlatTree[]>()): HashesMap {
  const flatTree = flattenNode(t, basePath);

  if (isTreeSymlink(flatTree))
    return acc;

  const { hash } = flatTree;
  let array: FlatTree[] | undefined = acc.get(hash);

  if (!array) {
    array = [];
    acc.set(hash, array);
  }

  array.push(flatTree);

  if (t.children) {
    for (const c of t.children)
      flattenHashesMap(c, `${basePath}/${t.name}`, acc);
  }

  return acc;
}
