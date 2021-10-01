import { execSync } from "child_process";

enum MimeType {
  FOLDER = "inode/directory",
  TEXT = "text/plain",
  NOT_EXISTS = "inode/x-empty",
  EMPTY = "inode/x-empty",
  PNG = "image/png",
  BMP = "image/x-ms-bmp",
}

export default MimeType;

export function getMimeType(fullpath: string): string | null {
  const ret = execSync(`file --mime-type -b "${fullpath}"`).toString();

  if (ret.includes("No such file"))
    return null;

  return ret.replace(/\n/g, "");
}
