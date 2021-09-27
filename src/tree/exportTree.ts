import { findTree } from "@app/tree/findTree";
import fs from "fs";

type Opts = {
  folder: string;
  out: string;
};

const V0_0_1 = "0.0.1";
const LATEST_VERSION = V0_0_1;

export default async function exportTree(opts: Opts) {
  const tree = await findTree(opts.folder);
  const fileJson = {
    version: LATEST_VERSION,
    content: tree,
  };

  fs.writeFileSync(opts.out, JSON.stringify(fileJson));
}
