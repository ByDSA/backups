import chalk from "chalk";
import yargs, { Arguments } from "yargs";
import { ConfigWithOut } from "~/Config";
import { checkAfter } from "~/check";
import { Type } from "~/type";
import { fetchPackageJson } from "~/utils/node";
import { calculateOutputFileName, calculateOutputFolder, deleteBaseSource, makeBackupAsync, removePreviousIfNeeded } from "..";

export default function command() {
  yargs.command("$0 [input]", `Backup ${version()}`, builder, handler)
    .help()
    .alias("h", "help");

  return yargs;
}

function builder(y: yargs.Argv<{}>) {
  versionParam(y);
  optionParams(y);
  y.positional("input", {
    type: "string",
    describe: "Input file or folder",
    demandOption: true,
  } );
}

async function handler<U>(argv: Arguments<U>) {
  const config: ConfigWithOut = {
    input: <string>argv.input,
    outFolder: <string>argv.outFolder,
    outName: <string>argv.outName,
    force: !!argv.force,
    checkAfter: !!argv.checkAfter,
    deleteAfter: !!argv.deleteAfter,
    type: <Type>argv.type,
    deleteTreeAfter: !!argv.deleteTreeAfter,
    dontFollowISOs: !!argv.dontFollowISOs,
  };

  console.log(chalk.blue(`[Backup: '${config.input}']`));

  if (!config.outName)
    config.outName = calculateOutputFileName(config);

  if (!config.outFolder)
    config.outFolder = calculateOutputFolder(config);

  console.log(config);

  removePreviousIfNeeded(config);

  await makeBackupAsync(config);

  if (config.checkAfter)
    checkAfter(config);

  if (config.deleteAfter)
    deleteBaseSource(config);
}

function versionParam(y: yargs.Argv<{}>) {
  y
    .alias("v", "version")
    .version(version());

  return y;
}

// eslint-disable-next-line no-underscore-dangle
let _v: string;

function version() {
  if (!_v) {
    const packageJson = fetchPackageJson();

    _v = packageJson.version;
  }

  return _v;
}

function optionParams(y: yargs.Argv<{}>) {
  y.option("force", {
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
    .option("dontFollowISOs", {
      alias: "i",
      boolean: true,
      describe: "Don't follow ISOs when generating the tree",
    } )
    .option("deleteTreeAfter", {
      alias: "l",
      boolean: true,
      describe: "Delete generated tree from the original sources after the backup is done",
    } )
    .option("type", {
      alias: "t",
      describe: "Type of backup",
      choices: ["iso"],
      demandOption: true,
    } )
    .option("outFolder", {
      alias: "o",
      describe: "Output folder",
      type: "string",
    } )
    .option("outName", {
      alias: "n",
      describe: "Name of the backup",
      type: "string",
    } );

  return y;
}
