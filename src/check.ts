import chalk from "chalk";
import { existsSync, mkdirSync } from "fs";
import { cmd } from "./cmd";
import { Config } from "./Config";
import { isEqualDir } from "./paths";
import { Type } from "./type";

// eslint-disable-next-line import/prefer-default-export
export function checkAfter( { type, input, out }: Config) {
  console.log(chalk.blue("Checking backup integrity ..."));

  if (!out)
    throw new Error("out undefined");

  switch (type) {
    case Type.ISO:
      integrityISO(input, out);
      break;
    default: break;
  }
}

function integrityISO(inputFolder: string, outputISO: string) {
  let tmp = `${inputFolder}_bkptmp`;

  tmp = umountAndRemoveIfExists(tmp);
  console.log(`Temp folder: ${tmp}`);

  mkdirSync(tmp);
  cmd(`sudo mount -t iso9660 -o loop,ro,map=off,check=relaxed "${outputISO}" "${tmp}"`);

  if (!isEqualDir(inputFolder, tmp)) {
    console.log(chalk.red("ISO is not equal as base folder!"));
    process.exit(1);
  }

  cmd(`umount "${tmp}"`);
  cmd(`rm -rf "${tmp}"`);

  console.log("Integrity ok!");
}

function umountAndRemoveIfExists(tmp: string, n = 1): string {
  const tmpWithNum = tmp + (n > 1 ? n : "");

  if (existsSync(tmpWithNum)) {
    try {
      cmd(`umount "${tmpWithNum}"`);
      cmd(`rm -rf "${tmpWithNum}"`);

      return tmpWithNum;
    } catch (e) {
      return umountAndRemoveIfExists(tmp, n + 1);
    }
  }

  return tmpWithNum;
}
