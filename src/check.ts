import chalk from "chalk";
import path from "node:path";
import { ConfigWithOut } from "./Config.js";
import { checkIntegrityISO } from "./iso/index.js";
import { Type } from "./type.js";

// eslint-disable-next-line import/prefer-default-export
export function checkAfter( { type, input, outFolder, outName }: ConfigWithOut) {
  console.log(chalk.blue("Checking backup integrity ..."));

  if (!outFolder)
    throw new Error("outFolder undefined");

  if (!outName)
    throw new Error("outName undefined");

  const out = path.join(outFolder, outName);

  switch (type) {
    case Type.ISO:
      checkIntegrityISO(input, out);
      break;
    default: break;
  }
}
