import type { Tree } from "../Tree.js";
import CompareTreeProcess from "./CompareTreeProcess.js";
import type { Options } from "./Options.js";
import type { Difference } from "./types/Difference.js";

export {
  default as Mime,
  getMimeType,
} from "./MimeType.js";

export {
  default as isEqual,
} from "./isEqual.js";

export {
  type Difference,
};

export default function compareTree(
  previousTree: Tree,
  afterTree: Tree,
  opts?: Options,
): Difference[] {
  return new CompareTreeProcess(previousTree, afterTree, opts).process();
}
