import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export default function getMainDir() {
  let currentDir = dirname(fileURLToPath(import.meta.url));

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const candidate = resolve(currentDir, "node_modules");

    if (existsSync(candidate))
      return dirname(candidate);

    const parentDir = dirname(currentDir);

    if (parentDir === currentDir)
      break;

    currentDir = parentDir;
  }

  throw new Error();
}

export function fetchPackageJson() {
  const packageJsonPath = resolve(getMainDir(), "package.json");
  const packageJsonTxt = readFileSync(packageJsonPath, "utf8");
  const packageJson = JSON.parse(packageJsonTxt);

  return packageJson;
}
