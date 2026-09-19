// eslint-disable-next-line import/no-internal-modules
import findTreeAsync from "./findTree/index.js";
import type { Options } from "./findTree/types/Options.js";
import saveTree from "./save.js";
import type { Tree } from "./Tree.js";

type Opts = Options & {
  folder: string;
  out: string;
};

export default async function generateTree(opts: Opts): Promise<Tree> {
  const tree = await findTreeAsync(opts.folder, opts);

  saveTree(tree, opts.out);

  return tree;
}
