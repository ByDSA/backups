// eslint-disable-next-line import/prefer-default-export
export function normalizePath(path: string) {
  let fixedPath = path;

  while (fixedPath.slice(-1) === "/")
    fixedPath = path.substring(0, path.length - 1);

  return fixedPath;
}
