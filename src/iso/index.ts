import { existsSync, lstatSync } from "fs";
import { basename, dirname } from "path";
import { getDateTimestamp } from "../timestamp";

type Params = { input: string; out?: string };
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

export {
  default as checkIntegrityISO,
} from "./integrity";

export {
  default as makeISO,
} from "./make";

export {
  isMountPoint, default as mountISO,
  umount as umountISO,
} from "./mount";
