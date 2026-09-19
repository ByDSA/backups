import type { Tree } from "../Tree.js";
import type { FlatTree } from "./FlatTree.js";

export default function flattenNode(t: Tree, basePath: string = ""): FlatTree {
  const path = `${basePath}/${t.name}`;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const flatTree: FlatTree = ((( { children, ...obj }: Tree) => ( {
    ...obj,
    path,
  } )
  ))(t);

  return flatTree;
}
