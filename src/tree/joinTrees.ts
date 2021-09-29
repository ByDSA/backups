import { calculateHashOfBranches, calculateSizeOfBranches } from "./branches";
import Tree from "./Tree";

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
