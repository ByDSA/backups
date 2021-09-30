import Tree from "../Tree";
import FlatTree from "./FlatTree";

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
