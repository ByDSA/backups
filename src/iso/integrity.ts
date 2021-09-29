import { isEqualDir, rm } from "@app/files";
import chalk from "chalk";
import { mkdirSync } from "fs";
import mount, { umount, umountIfExists } from "./mount";

export default function integrity(inputFolder: string, outputISO: string) {
  const tmp = `${inputFolder}_bkptmp`;

  if (umountIfExists(tmp))
    rm(tmp);

  console.log(`Temp folder: ${tmp}`);

  mkdirSync(tmp);
  mount(outputISO, tmp);

  if (!isEqualDir(inputFolder, tmp)) {
    console.log(chalk.red("ISO is not equal as base folder!"));
    process.exit(1);
  }

  umount(tmp);
  rm(tmp);
  console.log("Integrity ok!");
}
