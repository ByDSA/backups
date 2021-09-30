/* eslint-disable import/prefer-default-export */
import Tree, { TreeWithoutChildren } from "./Tree";

export type PlainTree = TreeWithoutChildren & {
  path: string;
};

export function plain(t: Tree, basePath: string = "", acc: PlainTree[] = []): PlainTree[] {
  if (!t.children)
    return acc;

  for (const c of t.children) {
    const plainTree: PlainTree = {
      ...c,
      path: `${basePath}/${c.name}`,
    };

    acc.push(plainTree);

    plain(c, `${basePath}/${c.name}`, acc);
  }

  return acc;
}

type Path = string;
type PathsMap = Map<Path, PlainTree>;
export function plainPathsMap(t: Tree, basePath: string = "", acc: PathsMap = new Map<Path, PlainTree>()): PathsMap {
  if (!t.children)
    return acc;

  for (const c of t.children) {
    const path = `${basePath}/${c.name}`;
    const plainTreePath: PlainTree = {
      ...c,
      path,
    };

    acc.set(path, plainTreePath);

    plainPathsMap(c, `${basePath}/${c.name}`, acc);
  }

  return acc;
}
