import { Type } from "./type";
export declare type Config = {
    input: string;
    out?: string;
    force: boolean;
    checkAfter: boolean;
    deleteAfter: boolean;
    type: Type;
};
export declare type ConfigWithOut = Config & {
    out: string;
};
