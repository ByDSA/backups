import Tree from "../Tree";
import PlainTree from "./PlainTree";

type Path = string;
type PathsMap = Map<Path, PlainTree>;
export default function plainPathsMap(t: Tree, basePath: string = "", acc: PathsMap = new Map<Path, PlainTree>()): PathsMap {
  if (!t.children)
    return acc;

  for (const c of t.children) {
    const path = `${basePath}/${c.name}`;
    const plainTree: PlainTree = {
      ...c,
      path,
    };

    acc.set(path, plainTree);

    plainPathsMap(c, `${basePath}/${c.name}`, acc);
  }

  return acc;
}
