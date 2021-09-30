import Tree from "../Tree";
import FindTreeProcess from "./FindTreeProcess";
import Options from "./Options";

export default function findTreeAsync(folder: string, opts?: Options): Promise<Tree> {
  return new FindTreeProcess(opts).processAsync(folder);
}
