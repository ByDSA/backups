import { Config, ConfigWithOut } from "./Config";
export declare function processParams(): Config;
export declare function calculateOutputFileName({ out, input, type }: ConfigWithOut): string;
export declare function removePreviousIfNeeded({ force, out }: ConfigWithOut): void;
export declare function makeBackup({ input, out, type }: ConfigWithOut): void;
export declare function deleteBaseSource({ input }: Config): void;
export { checkAfter, } from "./check";
export { cmd, forceSudo, } from "./cmd";
