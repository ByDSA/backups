import chalk from "chalk";
import path, { dirname } from "node:path";
import type { Config, ConfigWithOut } from "./Config.js";
import { rm } from "./files/index.js";
import { calculateOutputISOFileName, makeISO } from "./iso/index.js";
import { generateTree } from "./tree/index.js";
import { Type } from "./type.js";

export function calculateOutputFileName( { outFolder,
  input,
  type }: Config & { outFolder: string } ) {
  switch (type) {
    case Type.ISO: return calculateOutputISOFileName( {
      outFolder,
      input,
    } );
    default: return "";
  }
}

export function calculateOutputFolder( { input }: Config) {
  return dirname(input);
}

export function removePreviousIfNeeded( { force, outName }: ConfigWithOut) {
  if (force && outName)
    rm(outName);
}

type MakeBackupParams = ConfigWithOut & {
  outFolder: string;
  outName: string;
};
type MakeBackupReturn = {
  treePath: string;
};
export async function makeBackupAsync( { input,
  outFolder,
  outName,
  type,
  dontFollowISOs }: MakeBackupParams): Promise<MakeBackupReturn> {
  console.log("Generating tree...");
  const treeOutPath = path.resolve(input, "index.tree");
  const tree = await generateTree( {
    folder: input,
    out: treeOutPath,
    followISOs: !dontFollowISOs,
  } );
  const outFilePath = path.join(outFolder, outName);

  switch (type) {
    case Type.ISO: makeISO(input, outFilePath, {
      tree,
    } );
      break;
    default: throw new Error("Type invalid");
  }

  return {
    treePath: treeOutPath,
  };
}

export function deleteBaseSource( { input }: Config) {
  console.log(chalk.blue("Deleting base source ..."));
  rm(input);
}

export {
  checkAfter,
} from "./check.js";

export {
  cmd, forceSudo,
} from "./cmd.js";

export {
  default as processParams,
} from "./params/index.js";
