import chalk from "chalk";
import { basename } from "path";
import yargs, { Arguments } from "yargs";
import { Tree, joinTrees, readTree, saveTree } from "~/tree";

export default function command() {
  return yargs.command("join [input..]", "Tree comparator", builder, handler);
}

function builder(y: yargs.Argv<{}>) {
  y.option("out", {
    alias: "o",
    type: "string",
    describe: "Output file path",
    demandOption: true,
  } );
}

function handler<U>(argv: Arguments<U>) {
  const config = {
    input: <string[]>argv.input,
    out: <string>argv.out,
  };

  console.log(chalk.blue(`Joining trees: '${config.input}' ...`));
  const createdAt = Date.now();
  const trees = inputPaths2Trees(config.input);
  const name = getNameFromPath(config.out);
  const joinedTree: Tree = joinTrees(name, ...trees);

  joinedTree.createdAt = createdAt;

  saveTree(joinedTree, config.out);
}

function getNameFromPath(p: string): string {
  const base = basename(p);
  const indexTreeExt = base.indexOf(".tree");

  if (indexTreeExt > 0)
    return base.substring(0, indexTreeExt);

  return base;
}

function inputPaths2Trees(input: string[]): Tree[] {
  if (!input || input.length <= 1)
    throw new Error("Must entry two or more file trees.");

  const trees: Tree[] = [];

  for (const i of input) {
    const t = readTree(i);

    trees.push(t);
  }

  return trees;
}
