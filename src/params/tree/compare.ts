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
}

function handler<U>(argv: Arguments<U>) {
  const config = {
    input1: <string>argv.input1,
    input2: <string>argv.input2,
  };

  console.log(chalk.blue(`Comparing trees: '${config.input1}' and '${config.input2}' ...`));
  console.log(chalk.yellowBright("Not implemented yet."));
}
