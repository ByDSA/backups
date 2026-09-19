import crypto from "crypto";
import type { Tree, TreeNormal } from "./Tree.js";
import { isTreeNormal } from "./Tree.js";

export function calculateSizeOfBranches(branches: Tree[]) {
  let size = 0;

  branches.forEach((n) => {
    if (isTreeNormal(n))
      size += n.size;
  } );

  return size;
}

function createSha256CspHash(content: string) {
  return crypto
    .createHash("sha256")
    .update(content)
    .digest("hex");
}

export function calculateHashOfBranches(branches: Tree[]) {
  const joinedHashes = branches
    .filter((n) => isTreeNormal(n))
    .map((n) => (n as TreeNormal).hash)
    .sort()
    .join();

  return createSha256CspHash(joinedHashes);
}
