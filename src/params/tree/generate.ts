import { generateTree } from "@app/tree";
import chalk from "chalk";
import yargs, { Arguments } from "yargs";

export default function command() {
  return yargs.command("gen [input]", "Tree generator", builder, handler);
}

function builder(y: yargs.Argv<{}>) {
  y.positional("input", {
    type: "string",
    describe: "Input file or folder",
    demandOption: true,
  } );
  y.option("out", {
    alias: "o",
    type: "string",
    describe: "Output file path",
  } );
}

async function handler<U>(argv: Arguments<U>) {
  const config = {
    input: <string>argv.input,
    out: <string>argv.out,
    ignoreTrees: <boolean>argv.ignoreTrees,
  };
  const out = config.out || `${config.input}.tree`;

  console.log(chalk.blue(`Generating tree from '${config.input}'...`));

  await generateTree( {
    folder: config.input,
    out,
    ignoreValidTreeFiles: config.ignoreTrees,
  } );

  console.log(chalk.green(`Generated at "${out}"`));
}
