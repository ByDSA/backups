import { readTree } from "@app/tree";
import findDuplicates from "@app/tree/findDuplicates";
import chalk from "chalk";
import yargs, { Arguments } from "yargs";

export default function command() {
  return yargs.command("dup [input]", "Tree find duplicates", builder, handler);
}

function builder(y: yargs.Argv<{}>) {
  y.positional("input", {
    type: "string",
    describe: "Input tree file",
    demandOption: true,
  } );
  optionParams(y);
}

function handler<U>(argv: Arguments<U>) {
  const config = {
    input: <string>argv.input,
    cName: <boolean>argv.considerName,
    cHash: <boolean>argv.considerHash,
    cFolders: <boolean>argv.considerFolders,
    cTime: <boolean>argv.considerTime,
    cSize: <boolean>argv.considerSize,
    cEmpty: <boolean>argv.considerEmpty,
    deep: <boolean>argv.deep,
  };

  try {
    console.log(chalk.blue(`Finding duplicates in tree '${config.input}' ...`));
    const tree = readTree(config.input);
    const opts = {
      consider: {
        size: config.cSize,
        name: config.cName,
        hash: config.cHash,
        modificatedAt: config.cTime,
        createdAt: config.cTime,
        empty: config.cEmpty,
      },
      deep: config.deep,
    };
    const sets = findDuplicates(tree, opts);
    let i = 1;

    for (const s of sets) {
      if (s) {
        console.log(`[Group ${i}]`);

        for (const n of s)
          console.log(n.path);

        i++;
      }
    }
  } catch (e: any) {
    console.log(chalk.red(e.message));
  }
}

function optionParams(y: yargs.Argv<{}>) {
  y.option("considerFolders", {
    alias: "f",
    boolean: true,
    default: true,
    describe: "Consider folders",
  } )
    .option("considerTime", {
      alias: "t",
      boolean: true,
      default: false,
      describe: "Consider timestamps",
    } )
    .option("considerName", {
      alias: "n",
      boolean: true,
      default: true,
      describe: "Consider filename",
    } )
    .option("considerSize", {
      alias: "s",
      boolean: true,
      default: true,
      describe: "Consider size",
    } )
    .option("considerEmpty", {
      alias: "e",
      boolean: true,
      default: false,
      describe: "Consider empty files or folders",
    } )
    .option("deep", {
      boolean: true,
      default: false,
      describe: "Deep comparison",
    } );

  return y;
}
