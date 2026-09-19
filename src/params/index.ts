import { Argv } from "yargs";
import defaultCmd from "./default.js";
// eslint-disable-next-line import/no-internal-modules
import treeCmd from "./tree/index.js";

export default function processParams(cli: Argv) {
  defaultCmd(cli);
  treeCmd(cli);

  cli.parse();
}
