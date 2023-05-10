import Tree from "../Tree";
import CompareTreeProcess from "./CompareTreeProcess";
import Options from "./Options";
import Difference from "./types/Difference";

export {
  default as Mime,
  getMimeType,
} from "./MimeType";

export {
  default as isEqual,
} from "./isEqual";

export {
  default as Difference,
} from "./types/Difference";

export default function compareTree(
  previousTree: Tree,
  afterTree: Tree,
  opts?: Options,
): Difference[] {
  return new CompareTreeProcess(previousTree, afterTree, opts).process();
}
