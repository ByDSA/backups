import chalk from "chalk";
import { rm } from "fs/promises";
import yargs, { Arguments } from "yargs";
import { Config, ConfigWithOut } from "~/Config";
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

function fixConfig(config: Config): ConfigWithOut {
  let { outName } = config;
  const outFolder = config.outFolder ?? calculateOutputFolder(config);

  if (!outFolder)
    throw new Error("outFolder undefined");

  if (!config.outName) {
    const configWithOutFolder = {
      ...config,
      outFolder,
    };

    outName = calculateOutputFileName(configWithOutFolder);
  }

  if (!outName)
    throw new Error("outName undefined");

  const ret: ConfigWithOut = {
    ...config,
    outFolder,
    outName,
  };

  return ret;
}

async function handler<U>(argv: Arguments<U>) {
  const config: Config = {
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

  const configWithOut = fixConfig(config);

  console.log(configWithOut);

  removePreviousIfNeeded(configWithOut);

  const resultBackup = await makeBackupAsync(configWithOut);

  if (configWithOut.checkAfter)
    checkAfter(configWithOut);

  if (configWithOut.deleteAfter)
    deleteBaseSource(configWithOut);
  else if (configWithOut.deleteTreeAfter) {
    console.log(`Deleting tree: ${resultBackup.treePath}`);
    await rm(resultBackup.treePath);
  }
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
