import Tree from "../../Tree";
import flattenNode from "../flattenNode";
import FlatTree from "../FlatTree";

type Path = string;
type PathsMap = Map<Path, FlatTree>;
export default function flattenPathsMap(t: Tree, basePath: string = "", acc: PathsMap = new Map<Path, FlatTree>()): PathsMap {
  const flatNode = flattenNode(t, basePath);

  acc.set(flatNode.path, flatNode);

  if (t.children) {
    for (const c of t.children)
      flattenPathsMap(c, `${basePath}/${c.name}`, acc);
  }

  return acc;
}
