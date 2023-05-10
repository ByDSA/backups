import chalk from "chalk";
import yargs, { Arguments } from "yargs";
import { compareTree, readTree, Tree } from "~/tree";
import { Difference } from "~/tree/compare/types";
import { getTreeAt } from "~/tree/findTree/utils";

export default function command() {
  return yargs.command("compare [input1] [input2]", "Tree comparator", builder, handler);
}

function builder(y: yargs.Argv<{}>) {
  y.positional("input1", {
    type: "string",
    describe: "Input tree file",
    demandOption: true,
  } );
  y.positional("input2", {
    type: "string",
    describe: "Input tree file",
    demandOption: true,
  } );
  y.option("onlyDeleted", {
    type: "boolean",
    describe: "Shows only deleted files or folders",
  } );
  y.option("onlyFiles", {
    type: "boolean",
    describe: "Shows only files and not folders",
  } );
  y.option("ignoreTrees", {
    type: "boolean",
    describe: "Ignore folder (or ISO) tree files",
  } );
}

function handler<U>(argv: Arguments<U>) {
  const config = {
    input1: <string>argv.input1,
    input2: <string>argv.input2,
    onlyDeleted: <boolean>argv.onlyDeleted,
    onlyFiles: <boolean>argv.onlyFiles,
  };

  console.log(chalk.blue(`Comparing trees: '${config.input1}' and '${config.input2}' ...`));
  const t1 = readOrGetTree(config.input1);
  const t2 = readOrGetTree(config.input2);
  const opts = {
    filter: (difference: Difference) => {
      if (config.onlyDeleted && difference.type !== "deleted")
        return false;

      if (config.onlyFiles && difference.isFolder)
        return false;

      return true;
    },
  };

  compareTree(t1, t2, opts);
}

function readOrGetTree(fullpath: string): Tree {
  let ret: Tree | null;

  try {
    ret = readTree(fullpath);

    return ret;
  } catch (e) {
    if (fullpath.endsWith(".tree"))
      throw new Error(`Cannot be found tree '${fullpath}'`);
  }

  ret = getTreeAt(fullpath);

  if (!ret)
    throw new Error(`Cannot be found a tree for ${fullpath}`);

  return ret;
}
