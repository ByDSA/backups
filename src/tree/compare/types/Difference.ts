import type { Tree } from "../../Tree.js";

type From = {
  from: string;
};
type To = {
  to: string;
};

type FromTo = From & To;

type Treeable = {
  tree: Tree;
};

type All = {
  isFolder?: boolean;
  type: string;
};

export type Difference = All
& (From & {
  type: "deleted";
} | FromTo & {
  type: "moved";
} | FromTo & {
  type: "renamed";
} | To & Treeable & {
  type: "created";
} | To & Treeable & {
  type: "updated";
} );
