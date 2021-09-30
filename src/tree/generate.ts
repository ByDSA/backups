import findTreeAsync from "./findTree";
import saveTree from "./save";

type Opts = {
  folder: string;
  out: string;
};

export default async function generateTree(opts: Opts) {
  const tree = await findTreeAsync(opts.folder);

  saveTree(tree, opts.out);
}
