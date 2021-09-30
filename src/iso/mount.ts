import { cmd } from "@app/cmd";
import { genTmpFolder, rm } from "@app/files";
import chalk from "chalk";
import { existsSync } from "fs";
import { basename, dirname } from "path";

type Options = {
  folder?: string;
  baseFolder?: string;
};
export default function mount(iso: string, opts?: Options): string {
  let folder: string | undefined = opts?.folder;
  const baseFolder = opts?.baseFolder || dirname(iso);

  if (!folder)
    folder = genTmpFolder(baseFolder, ISOwithoutExt(basename(iso)));

  console.log(chalk.blue(`Mounting ${iso} in ${folder}`));

  try {
    cmd(`sudo mount "${iso}" "${folder}"`);
  } catch (e) {
    rm(folder);
    throw e;
  }

  return folder;
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
