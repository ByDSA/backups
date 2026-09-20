import chalk from "chalk";
import { existsSync } from "node:fs";
import { basename, dirname } from "node:path";
import { cmd } from "#src/cmd.js";
import { genTmpFolder, rm } from "#src/files/index.js";

type Options = {
  folder?: string;
  baseFolder?: string;
};
export default function mount(isoFullpath: string, opts?: Options): string {
  let folder: string | undefined = opts?.folder;
  const baseFolder = opts?.baseFolder || dirname(isoFullpath);

  if (!folder)
    folder = genTmpFolder(baseFolder, ISOwithoutExt(basename(isoFullpath)));

  if (!folder)
    throw new Error("never");

  console.log(chalk.blue(`Mounting ${isoFullpath} in ${folder}`));

  try {
    // const isISO9660 = execSync(`file "${isoFullpath}"`)
    //   .toString()
    //   .includes("ISO 9660");

    try {
      cmd(`sudo mount "${isoFullpath}" "${folder}" -t udf`);
    } catch (e1) {
      cmd(`sudo mount "${isoFullpath}" "${folder}" -t iso9660`);
    }
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

export function isMountPoint(fullpath: string): boolean {
  try {
    cmd(`mountpoint -q -- "${fullpath}"`);

    return true;
  } catch (e) {
    return false;
  }
}
