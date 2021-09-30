import { Tree, TreeWithoutChildren } from "@app/tree";

export const NODE_WITHOUT_CHILDREN: TreeWithoutChildren = {
  size: 123,
  name: "node",
  modificatedAt: Date.now(),
  createdAt: Date.now(),
  hash: "fakeHash1",
};

export const ROOT_WITH_TWO_DUPLICATED_CHILDREN: Tree = {
  size: 123 * 2,
  name: "root",
  modificatedAt: Date.now(),
  createdAt: Date.now(),
  hash: "fakeHash2",
  children: [
    NODE_WITHOUT_CHILDREN,
    {
      ...NODE_WITHOUT_CHILDREN,
      name: "node2",
    },
  ],
};

export const NODE_WITH_CHILDREN: Tree = {
  ...NODE_WITHOUT_CHILDREN,
  name: "root",
  children: [
    NODE_WITHOUT_CHILDREN,
    {
      ...NODE_WITHOUT_CHILDREN,
      name: "node2",
    },
  ],
};
