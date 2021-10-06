import findTreeAsync from "./findTree";
import saveTree from "./save";
import Tree from "./Tree";

type Opts = {
  folder: string;
  out: string;
  ignoreValidTreeFiles?: boolean;
};

export default async function generateTree(opts: Opts): Promise<Tree> {
  const tree = await findTreeAsync(opts.folder, {
    ignoreValidTreeFiles: opts.ignoreValidTreeFiles,
  } );

  saveTree(tree, opts.out);

  return tree;
}
