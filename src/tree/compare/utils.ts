import { basename } from "path";
import Difference from "./Difference";

export function ignoreListContains(ignoreList: string[], p: string): boolean {
  for (const s of ignoreList) {
    if (p.startsWith(`${s}/`))
      return true;
  }

  return false;
}

export function genIsFolderObj(isFolder: boolean) {
  const isFolderObj = {
    ...(isFolder && {
      isFolder,
    } ),
  };

  return isFolderObj;
}

export function show(difference: Difference) {
  let msg: string;

  switch (difference.type) {
    case "created":
      msg = `New: ${difference.to}`;
      break;
    case "updated":
      msg = `Updated: ${difference.to}`;
      break;
    case "deleted":
      msg = `Del: ${difference.from}`;
      break;
    case "moved":
      msg = `Moved from '${difference.from}' to '${difference.to}'`;
      break;
    case "renamed":
      msg = `Renamed '${difference.from}' to '${basename(difference.to)}'`;
      break;
    default: throw new Error();
  }

  console.log(msg);
}
