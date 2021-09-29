import crypto from "crypto";
import Tree from "./Tree";

export function calculateSizeOfBranches(branches: Tree[]) {
  let size = 0;

  branches.forEach((n) => {
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
    .map((n) => n.hash)
    .sort()
    .join();

  return createSha256CspHash(joinedHashes);
}
