import Tree from "../../Tree";
import flattenNode from "../flattenNode";
import FlatTree from "../FlatTree";
import { Hash, HashesMap } from "./types";

export default function flattenHashesMap(t: Tree, basePath: string = "", acc: HashesMap = new Map<Hash, FlatTree[]>()): HashesMap {
  const flatTree = flattenNode(t, basePath);
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
