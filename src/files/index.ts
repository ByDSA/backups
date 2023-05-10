import { cmd } from "../cmd";

export function isEqualDir(d1: string, d2: string) {
  try {
    const ret = cmd(`diff -qr "${d1}" "${d2}"`);

    return !ret;
  } catch (e) {
    return false;
  }
}

export function isEqualFile(f1: string, f2: string) {
  try {
    const ret = cmd(`diff -q "${f1}" "${f2}"`);

    return !ret;
  } catch (e) {
    return false;
  }
}

export function rm(p: string) {
  cmd(`rm -rf "${p}"`);
}

export {
  default as genTmpFolder,
} from "./genTmpFolder";

export {
  hashFileStream,
} from "./hash";
