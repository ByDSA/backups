import findTreeAsync from "./findTree";
import Options from "./findTree/Options";
import saveTree from "./save";
import Tree from "./Tree";

type Opts = Options & {
  folder: string;
  out: string;
};

export default async function generateTree(opts: Opts): Promise<Tree> {
  const tree = await findTreeAsync(opts.folder, opts);

  saveTree(tree, opts.out);

  return tree;
}
