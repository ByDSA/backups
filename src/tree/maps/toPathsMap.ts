import Tree from "../Tree";

type Path = string;
type PathsMap = Map<Path, Tree>;
export default function toPathMap(t: Tree, baseName: string = "", acc: PathsMap = new Map<Path, Tree>()): PathsMap {
  const path = `${baseName}/${t.name}`;

  if (acc.has(path))
    throw new Error(`The path '${path}'is duplicated.`);

  acc.set(path, t);

  addChildren(t, path, acc);

  return acc;
}

function addChildren(t: Tree, baseName: string, acc: PathsMap) {
  const { children } = t;

  if (children) {
    for (const c of children)
      toPathMap(c, baseName, acc);
  }
}
