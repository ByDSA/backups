/* eslint-disable import/prefer-default-export */
import Tree from "./Tree";

export type PlainTree = Tree & {
  path: string;
};

export function plain(t: Tree, basePath: string = "", acc: PlainTree[] = []): PlainTree[] {
  if (!t.children)
    return acc;

  for (const c of t.children) {
    const plainTree = {
      ...c,
      path: `${basePath}/${c.name}`,
    };

    delete plainTree.children;
    acc.push(plainTree);

    plain(c, `${basePath}/${c.name}`, acc);
  }

  return acc;
}
