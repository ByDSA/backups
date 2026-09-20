import type { Tree } from "#src/tree/index.js";

export * from "./mocks/index.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function removeChildren( { children, ...obj }: Tree) {
  return obj;
}
