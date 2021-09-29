import crypto from "crypto";
import { DefaultHashAlgorithm, SupportedAlgorithms } from "./settings";

export const hashString = (str: string, options = {
  algorithm: DefaultHashAlgorithm,
} ) => {
  if (!SupportedAlgorithms.has(options.algorithm))
    throw new Error(`Unsupported hashing algorithm: ${options.algorithm}`);

  const hash = crypto.createHash(options.algorithm);

  hash.update(str);
  const hashHex = hash.digest("hex");

  return hashHex;
};

export const hashObject = (obj, options) => {
  const objText = JSON.stringify(obj);

  return hashString(objText, options);
};

export {
  hashFileStream,
} from "./hashFileStream";
