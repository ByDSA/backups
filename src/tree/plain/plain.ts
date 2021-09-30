import Tree from "../Tree";
import PlainTree from "./PlainTree";

export default function plain(t: Tree, basePath: string = "", acc: PlainTree[] = []): PlainTree[] {
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
