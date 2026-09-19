
import chalk from "chalk";
import { Argv, Arguments } from "yargs";
import compareCmd from "./compare.js";
import duplicatesCmd from "./duplicates.js";
import generateCmd from "./generate.js";
import joinCmd from "./join.js";

export default function command(cli: Argv) {
  return cli.command("tree", "Tree", builder, handler);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function builder(y: Argv<{}>) {
  generateCmd(y);
  compareCmd(y);
  duplicatesCmd(y);
  joinCmd(y);
}

function handler<U>(argv: Arguments<U>) {
  const config = {
    input: <string>argv.input,
  };

  console.log(chalk.red(`Finding duplicates in tree '${config.input}' ...`));
}
