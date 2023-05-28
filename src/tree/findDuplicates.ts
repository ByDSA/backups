import { flattenTree, FlatTree } from "./flat";
import Tree, { isTreeNormal, isTreeSymlink } from "./Tree";

type Options = {
  consider?: {
    hash?: boolean;
    modificatedAt?: boolean;
    createdAt?: boolean;
    name?: boolean;
    size?: boolean;
    children?: boolean;
    empty?: boolean;
  };
  deep: boolean;
};
const DefaultOptions: Options = {
  consider: {
    hash: true,
    modificatedAt: false,
    createdAt: false,
    name: false,
    size: false,
    children: false,
    empty: false,
  },
  deep: false,
};

export default function findDuplicates(t: Tree, opts?: Options): Set<FlatTree>[] {
  const finalOpts = {
    ...DefaultOptions,
    ...opts,
  };
  const flatTree = flattenTree(t);
  const checked: Map<string, FlatTree> = new Map();
  const duplicates: Map<string, Set<FlatTree>> = new Map();

  for (const node of flatTree) {
    if (isIgnored(node, opts) || isTreeSymlink(node))
      // eslint-disable-next-line no-continue
      continue;

    const id = idGen(node, finalOpts);
    const checkedWithThisHash = checked.get(id);

    if (checkedWithThisHash !== undefined) {
      let duplicatesSet = duplicates.get(node.hash);

      if (duplicatesSet === undefined) {
        duplicatesSet = new Set<FlatTree>();
        duplicates.set(id, duplicatesSet);
        duplicatesSet.add(checkedWithThisHash);
      }

      duplicatesSet.add(node);
    } else
      checked.set(id, node);
  }

  return Array.from(duplicates.values());
}

function isIgnored(node: Tree, opts?: Options): boolean {
  if (isTreeSymlink(node) || (!opts?.consider?.empty && node.size === 0))
    return true;

  return false;
}

function idGen(node: Tree, opts?: Options) {
  let id = "";

  if (opts?.consider?.hash && isTreeNormal(node))
    id += node.hash;

  if (opts?.consider?.modificatedAt)
    id += node.modificatedAt;

  if (opts?.consider?.createdAt)
    id += node.createdAt;

  if (opts?.consider?.name)
    id += node.name;

  if (opts?.consider?.size && isTreeNormal(node))
    id += node.size;

  if (opts?.consider?.children && node.children) {
    for (const c of node.children)
      id += idGen(c);
  }

  return id;
}
