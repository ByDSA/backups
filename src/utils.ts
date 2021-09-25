import chalk from "chalk";
import { dirname } from "path";
import yargs from "yargs";
import { Config, ConfigWithOut } from "./Config";
import { calculateOutput as calculateOutputISOFileName, makeISO } from "./iso";
import { rm } from "./paths";
import { Type } from "./type";

const { constants, promises: { access } } = require("fs");

export function processParams() {
  // eslint-disable-next-line global-require
  const VERSION = require("../package.json").version;
  let config: Config | undefined;

  yargs.command("$0", `Backup ${VERSION}`, (y) => {
    y
      .alias("v", "version")
      .version(VERSION)
      .option("input", {
        alias: "i",
        type: "string",
        describe: "Input file or folder",
        demandOption: true,
      } )
      .option("force", {
        alias: "f",
        boolean: true,
        describe: "Force to create backup",
      } )
      .option("checkAfter", {
        alias: "c",
        boolean: true,
        describe: "Check the backup integrity after the backup done",
      } )
      .option("deleteAfter", {
        alias: "d",
        boolean: true,
        describe: "Delete the original sources after the backup is done",
      } )
      .option("type", {
        alias: "t",
        describe: "Type of backup",
        choices: ["iso"],
        demandOption: true,
      } );
  }, (argv) => {
    config = {
      input: <string>argv.input,
      force: !!argv.force,
      checkAfter: !!argv.checkAfter,
      deleteAfter: !!argv.deleteAfter,
      type: <Type>argv.type,
    };
    console.log(config);
  } )
    .help()
    .alias("h", "help")
    .parse();

  if (!config)
    throw new Error("config undefined");

  console.log(chalk.blue(`[Backup: '${config.input}']`));
  console.log(config);

  return config;
}

export function calculateOutputFileName( { out, input, type }: ConfigWithOut) {
  switch (type) {
    case Type.ISO: return calculateOutputISOFileName( {
      out,
      input,
    } );
    default: return "";
  }
}

export function removePreviousIfNeeded( { force, out }: ConfigWithOut) {
  if (force)
    rm(out);
}

export function makeBackup( { input, out, type }: ConfigWithOut) {
  switch (type) {
    case Type.ISO: return makeISO(input, out);
    default: throw new Error("Type invalid");
  }
}

export function deleteBaseSource( { input }: Config) {
  console.log(chalk.blue("Deleting base source ..."));
  rm(input);
}

export {
  checkAfter,
} from "./check";

export {
  cmd, forceSudo,
} from "./cmd";

export async function getPkgJsonDir() {
  for (const path of module.paths) {
    try {
      const prospectivePkgJsonDir = dirname(path);

      // eslint-disable-next-line no-await-in-loop
      await access(path, constants.F_OK);

      return prospectivePkgJsonDir;
    // eslint-disable-next-line no-empty
    } catch (e) {}
  }

  throw new Error();
}
