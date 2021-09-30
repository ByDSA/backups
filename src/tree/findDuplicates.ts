import { flatten, FlatTree } from "./flat";
import Tree from "./Tree";

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
  const flatTree = flatten(t);
  const checked: FlatTree[] = [];
  const duplicates: Set<FlatTree>[] = [];

  for (const node of flatTree) {
    if (isIgnored(node, opts))
      // eslint-disable-next-line no-continue
      continue;

    const id = idGen(node, finalOpts);
    const checkedWithThisHash = checked[id];

    if (checkedWithThisHash !== undefined) {
      let duplicatesSet = duplicates[node.hash];
      const existsDuplicatesSet = duplicatesSet !== undefined;

      if (!existsDuplicatesSet) {
        duplicatesSet = new Set<FlatTree>();
        duplicates[id] = duplicatesSet;
        duplicatesSet.add(checkedWithThisHash);
      }

      duplicatesSet.add(node);
    } else
      checked[id] = node;
  }

  return duplicates;
}

function isIgnored(node: Tree, opts?: Options): boolean {
  if (!opts?.consider?.empty && node.size === 0)
    return true;

  return false;
}

function idGen(node: Tree, opts?: Options) {
  let id = "";

  if (opts?.consider?.hash)
    id += node.hash;

  if (opts?.consider?.modificatedAt)
    id += node.modificatedAt;

  if (opts?.consider?.createdAt)
    id += node.createdAt;

  if (opts?.consider?.name)
    id += node.name;

  if (opts?.consider?.size)
    id += node.size;

  if (opts?.consider?.children && node.children) {
    for (const c of node.children)
      id += idGen(c);
  }

  return id;
}
