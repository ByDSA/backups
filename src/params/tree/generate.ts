import chalk from "chalk";
import path, { basename, dirname } from "path";
import yargs, { Arguments } from "yargs";
import { generateTree } from "~/tree";

export default function command() {
  return yargs.command("gen [input]", "Tree generator", builder, handler);
}

function builder(y: yargs.Argv<{}>) {
  y.positional("input", {
    type: "string",
    describe: "Input file or folder",
    demandOption: true,
  } );
  y.option("dontFollowISOs", {
    type: "boolean",
    describe: "Don't follow ISOs recursively",
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
    dontFollowISOs: <boolean>argv.dontFollowISOs,
  };
  const out = calcOutPath(config);

  console.log(chalk.blue(`Generating tree from '${config.input}'...`));

  await generateTree( {
    folder: config.input,
    out,
    ignoreValidTreeFiles: config.ignoreTrees,
    followISOs: !config.dontFollowISOs,
  } );

  console.log(chalk.green(`Generated at "${out}"`));
}

function calcOutPath(config: any) {
  if (config.out)
    return config.out;

  const inputFullPath = path.resolve(dirname(config.input), basename(config.input));

  return `${inputFullPath}.tree`;
}
