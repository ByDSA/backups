import Tree from "../Tree";

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

type Difference = From & {
  type: "deleted";
} | FromTo & {
  type: "moved";
} | To & Treeable & {
  type: "created";
} | To & Treeable & {
  type: "updated";
};

export default Difference;
