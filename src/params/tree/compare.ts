import { compareTree, readTree } from "@app/tree";
import { Difference } from "@app/tree/compare";
import chalk from "chalk";
import yargs, { Arguments } from "yargs";

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
}

function handler<U>(argv: Arguments<U>) {
  const config = {
    input1: <string>argv.input1,
    input2: <string>argv.input2,
    onlyDeleted: <boolean>argv.onlyDeleted,
  };

  console.log(chalk.blue(`Comparing trees: '${config.input1}' and '${config.input2}' ...`));
  const t1 = readTree(config.input1);
  const t2 = readTree(config.input2);
  const opts = {
    filter: (difference: Difference) => (!config.onlyDeleted || difference.type === "deleted"),
  };

  compareTree(t1, t2, opts);
}
