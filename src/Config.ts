import { Type } from "./type";

export type Config = {
  input: string;
  outName?: string;
  outFolder?: string;
  force: boolean;
  checkAfter: boolean;
  deleteAfter: boolean;
  type: Type;
  deleteTreeAfter?: boolean;
  dontFollowISOs?: boolean;
};

export type ConfigWithOut = Config & {
    outFolder: string;
    outName: string;
};
