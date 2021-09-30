import { TreeWithoutChildren } from "../Tree";

type PlainTree = TreeWithoutChildren & {
  path: string;
};

export default PlainTree;
