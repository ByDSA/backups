import chalk from "chalk";
import path, { dirname } from "path";
import { Config, ConfigWithOut } from "./Config";
import { rm } from "./files";
import { calculateOutputISOFileName, makeISO } from "./iso";
import { generateTree } from "./tree";
import { Type } from "./type";

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
} from "./check";

export {
  cmd, forceSudo,
} from "./cmd";

export {
  default as processParams,
} from "./params";
