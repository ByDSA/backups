import chalk from "chalk";
import path from "path";
import { Config, ConfigWithOut } from "./Config";
import { rm } from "./files";
import { calculateOutput as calculateOutputISOFileName, makeISO } from "./iso";
import { generateTree } from "./tree";
import { Type } from "./type";

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

export async function makeBackupAsync( { input, out, type }: ConfigWithOut) {
  console.log("Generating tree...");
  const tree = await generateTree( {
    folder: input,
    out: path.resolve(input, "index.tree"),
  } );

  switch (type) {
    case Type.ISO: return makeISO(input, out, {
      tree,
    } );
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

export {
  default as processParams,
} from "./params";
