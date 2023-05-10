import chalk from "chalk";
import { isEqualDir, rm } from "~/files";
import mount, { umount } from "./mount";

export default function integrity(inputFolder: string, outputISO: string) {
  const tmp = mount(outputISO);

  console.log(`Temp folder: ${tmp}`);

  if (!isEqualDir(inputFolder, tmp)) {
    console.log(chalk.red("ISO is not equal as base folder!"));
    process.exit(1);
  }

  umount(tmp);
  rm(tmp);
  console.log("Integrity ok!");
}
