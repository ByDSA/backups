import chalk from "chalk";
import { existsSync, lstatSync } from "fs";
import { cmd } from "./cmd";
import { basename, dirname } from "./paths";
import { getDateTimestamp } from "./timestamp";

export function makeISO(inputFolder: string, outputISO: string) {
  console.log(chalk.blue(`Creating ISO '${outputISO}'...`));

  cmd(`mkisofs -allow-limited-size -iso-level 4 -J -joliet-long -l -R -o "${outputISO}" "${inputFolder}"`);

  if (!existsSync(outputISO)) {
    console.log(chalk.red(`ISO not exists! ${outputISO}`));
    process.exit(1);
  }
}

type Params = { input: string; out: string };
export function calculateOutput( { input, out }: Params) {
  const TIMESTAMP = getDateTimestamp();
  let OUT_FOLDER: string = "";

  if (out && !lstatSync(out).isDirectory()) {
    if (existsSync(out))
      OUT_FOLDER = out;
    else if (existsSync(dirname(out)))
      OUT_FOLDER = dirname(out);
  } else
    OUT_FOLDER = dirname(input);

  return `${OUT_FOLDER}/${basename(input)} [${TIMESTAMP}].iso`;
}
