import { cmd } from "@app/cmd";
import { genTmpFolder } from "@app/files";
import chalk from "chalk";
import { existsSync } from "fs";
import { basename, dirname } from "path";

export default function mount(iso: string, folder?: string): string {
  let finalFolder: string;

  if (!folder)
    finalFolder = genTmpFolder(dirname(iso), ISOwithoutExt(basename(iso)));
  else
    finalFolder = folder;

  console.log(chalk.blue(`Mounting ${iso} in ${finalFolder}`));

  cmd(`sudo mount "${iso}" "${finalFolder}"`);

  return finalFolder;
}

function ISOwithoutExt(name: string): string {
  return name.substring(0, name.length - 4);
}

export function umount(folder: string) {
  cmd(`sudo umount -l "${folder}"`);
}

export function umountIfExists(folder: string) {
  if (existsSync(folder)) {
    umount(folder);

    return true;
  }

  return false;
}
