import crypto from "crypto";
import { createReadStream } from "fs";
import { DefaultHashAlgorithm, SupportedAlgorithms } from "./settings";

// eslint-disable-next-line import/prefer-default-export
export function hashFileStream(fullFilePath: string, options = {
  algorithm: DefaultHashAlgorithm,
} ) {
  if (!SupportedAlgorithms.has(options.algorithm))
    throw new Error(`Unsupported hashing algorithm: ${options.algorithm}`);

  const hash = crypto.createHash(options.algorithm);

  hash.setEncoding("hex");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return new Promise<string>((resolve, reject) => {
    const input = createReadStream(fullFilePath);

    input.pipe(hash);
    input.on("end", () => {
      hash.end();
      const hashHex = hash.read();

      resolve(hashHex);
    } );
  } );
}
