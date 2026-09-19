import type { TreeWithoutChildren } from "../Tree.js";

export type FlatTree = TreeWithoutChildren & {
  path: string;
};
