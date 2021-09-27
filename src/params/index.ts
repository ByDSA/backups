import yargs from "yargs";
import defaultCmd from "./default";
import treeCmd from "./tree";

export default function processParams() {
  defaultCmd();
  treeCmd();

  yargs.parse();
}
