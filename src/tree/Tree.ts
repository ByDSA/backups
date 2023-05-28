type BaseTreeWithoutChildren = {
  name: string;
  modificatedAt: number;
  createdAt: number;
  accessedAt?: number;
};
type TreeSymlink = BaseTreeWithoutChildren & {
  target: string;
};

type TreeNormal = BaseTreeWithoutChildren & {
  hash: string;
  size: number;
};

type TreeWithoutChildren = TreeNormal | TreeSymlink;

type Tree = TreeWithoutChildren & {
  children?: Tree[];
};

function isTreeSymlink(tree: TreeWithoutChildren): tree is TreeSymlink {
  return "symLinkTo" in tree;
}

function isTreeNormal(tree: TreeWithoutChildren): tree is TreeNormal {
  return "hash" in tree;
}

export default Tree;

export {
  TreeWithoutChildren,
  BaseTreeWithoutChildren,
  TreeNormal,
  isTreeNormal,
  isTreeSymlink,
};
