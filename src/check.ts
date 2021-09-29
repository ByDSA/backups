import chalk from "chalk";
import { Config } from "./Config";
import { checkIntegrityISO } from "./iso";
import { Type } from "./type";

// eslint-disable-next-line import/prefer-default-export
export function checkAfter( { type, input, out }: Config) {
  console.log(chalk.blue("Checking backup integrity ..."));

  if (!out)
    throw new Error("out undefined");

  switch (type) {
    case Type.ISO:
      checkIntegrityISO(input, out);
      break;
    default: break;
  }
}
