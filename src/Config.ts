import { Type } from "./type";

export type Config = {
  input: string;
    out?: string;
    force: boolean;
    checkAfter: boolean;
    deleteAfter: boolean;
    type: Type;
};

export type ConfigWithOut = Config & {
    out: string;
};
