import { cmd } from "./cmd";

export function dirname(path: string) {
  const fixedPath = normalizePath(path);
  const lastSlashIndex = fixedPath.lastIndexOf("/");

  return path.substring(0, lastSlashIndex);
}

export function basename(path: string) {
  const fixedPath = normalizePath(path);
  const lastSlashIndex = fixedPath.lastIndexOf("/");

  return fixedPath.substring(lastSlashIndex + 1);
}

export function normalizePath(path: string) {
  let fixedPath = path;

  while (fixedPath.slice(-1) === "/")
    fixedPath = path.substring(0, path.length - 1);

  return fixedPath;
}

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

export function rm(path: string) {
  cmd(`rm -rf "${path}"`);
}
