import { cmd } from "@app/cmd";
import { generateTree } from "@app/tree";
import chalk from "chalk";
import { existsSync } from "fs";
import path, { basename } from "path";

export default function make(inputFolder: string, outputISO: string) {
  console.log(chalk.blue(`Creating ISO '${outputISO}'...`));

  const label = basename(inputFolder);

  generateTreeMake(inputFolder);

  cmd(`mkisofs -allow-limited-size -iso-level 4 -J -joliet-long -l -R -V "${label}" -o "${outputISO}" "${inputFolder}"`);

  checkProcessIsDone(outputISO);
}

function checkProcessIsDone(outputISO: string) {
  if (!existsSync(outputISO)) {
    console.log(chalk.red(`ISO not exists! ${outputISO}`));
    process.exit(1);
  }
}

function generateTreeMake(inputFolder: string) {
  const out = path.resolve(inputFolder, "index.tree");

  generateTree( {
    folder: inputFolder,
    out,
  } );
}
