import { TreeWithoutChildren } from "../Tree";

type FlatTree = TreeWithoutChildren & {
  path: string;
};

export default FlatTree;
