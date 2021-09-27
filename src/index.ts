import chalk from "chalk";
import { Config, ConfigWithOut } from "./Config";
import { calculateOutput as calculateOutputISOFileName, makeISO } from "./iso";
import { rm } from "./paths";
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

export {
  default as processParams,
} from "./params";
