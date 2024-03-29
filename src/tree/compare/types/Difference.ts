import Tree from "../../Tree";

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

type Difference = All
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
} ) ;

export default Difference;
