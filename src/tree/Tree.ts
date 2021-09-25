export type Tree = {
  path: string;
  size: number;
  hash: string;
  modificatedAt: number;
  createdAt: number;
  children?: Tree[];
};
