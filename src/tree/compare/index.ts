import Tree from "../Tree";
import CompareTreeProcess from "./CompareTreeProcess";
import Difference from "./Difference";
import Options from "./Options";

export {
  default as Difference,
} from "./Difference";

export {
  default as isEqual,
} from "./isEqual";

export {
  default as Mime,
  getMimeType,
} from "./MimeType";

export default function compareTree(
  previousTree: Tree,
  afterTree: Tree,
  opts?: Options,
): Difference[] {
  return new CompareTreeProcess(previousTree, afterTree, opts).process();
}
