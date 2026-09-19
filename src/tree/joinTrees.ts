import { calculateHashOfBranches, calculateSizeOfBranches } from "./branches.js";
import type { Tree } from "./Tree.js";

export default function joinTrees(name: string, ...trees: Tree[]): Tree {
  const joinedTree: Tree = {
    name,
    children: trees,
    createdAt: Date.now(),
    modificatedAt: Date.now(),
    size: calculateSizeOfBranches(trees),
    hash: calculateHashOfBranches(trees),
  };

  return joinedTree;
}
