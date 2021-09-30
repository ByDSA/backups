import { Tree } from "@app/tree";

export * from "./mocks";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function removeChildren( { children, ...obj }: Tree) {
  return obj;
}
