export type Tree = {
  path: string;
  size: number;
  hash: string;
  children?: Tree[];
};
