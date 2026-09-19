import type { Tree } from "../Tree.js";
import { FlatTree } from "./FlatTree.js";

export default function flatten(t: Tree, basePath: string = "", acc: FlatTree[] = []): FlatTree[] {
  if (!t.children)
    return acc;

  for (const c of t.children) {
    const flatTree: FlatTree = {
      ...c,
      path: `${basePath}/${c.name}`,
    };

    acc.push(flatTree);

    flatten(c, `${basePath}/${c.name}`, acc);
  }

  return acc;
}
