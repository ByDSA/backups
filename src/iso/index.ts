import { basename } from "path";
import { getDateTimestamp } from "../timestamp";

type Params = { input: string; outFolder?: string };
export function calculateOutputISOFileName( { input }: Params) {
  const TIMESTAMP = getDateTimestamp();

  return `${basename(input)} [${TIMESTAMP}].iso`;
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
