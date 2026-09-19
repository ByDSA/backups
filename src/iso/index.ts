import { basename } from "node:path";
import { getDateTimestamp } from "../timestamp.js";

type Params = { input: string; outFolder?: string };
export function calculateOutputISOFileName( { input }: Params) {
  const TIMESTAMP = getDateTimestamp();

  return `${basename(input)} [${TIMESTAMP}].iso`;
}

export {
  default as checkIntegrityISO,
} from "./integrity.js";

export {
  default as makeISO,
} from "./make.js";

export {
  isMountPoint, default as mountISO,
  umount as umountISO,
} from "./mount.js";
