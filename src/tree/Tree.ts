type TreeWithoutChildren = {
  name: string;
  size: number;
  hash: string;
  modificatedAt: number;
  createdAt: number;
  accessedAt?: number;
};

type Tree = TreeWithoutChildren & {
  children?: Tree[];
};

export default Tree;

export {
  TreeWithoutChildren,
};
