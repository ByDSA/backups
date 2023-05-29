import chalk from "chalk";
import path from "path";
import { Config } from "./Config";
import { checkIntegrityISO } from "./iso";
import { Type } from "./type";

// eslint-disable-next-line import/prefer-default-export
export function checkAfter( { type, input, outFolder, outName }: Config) {
  console.log(chalk.blue("Checking backup integrity ..."));

  if (!outFolder || !outName)
    throw new Error("out undefined");

  const out = path.join(outFolder, outName);

  switch (type) {
    case Type.ISO:
      checkIntegrityISO(input, out);
      break;
    default: break;
  }
}
