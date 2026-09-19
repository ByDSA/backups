import type { Tree } from "../Tree.js";
import FindTreeProcess from "./FindTreeProcess.js";
import type { Options } from "./types/Options.js";

export default function findTreeAsync(folder: string, opts?: Options): Promise<Tree> {
  return new FindTreeProcess(opts).processAsync(folder);
}

export {
  Options,
};
