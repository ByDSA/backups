
import chalk from "chalk";
import yargs, { Arguments } from "yargs";
import compareCmd from "./compare";
import duplicatesCmd from "./duplicates";
import generateCmd from "./generate";
import joinCmd from "./join";

export default function command() {
  return yargs.command("tree", "Tree", builder, handler);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function builder(y: yargs.Argv<{}>) {
  generateCmd();
  compareCmd();
  duplicatesCmd();
  joinCmd();
}

function handler<U>(argv: Arguments<U>) {
  const config = {
    input: <string>argv.input,
  };

  console.log(chalk.red(`Finding duplicates in tree '${config.input}' ...`));
}
