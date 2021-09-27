type Tree = {
  name: string;
  size: number;
  hash: string;
  modificatedAt: number;
  createdAt: number;
  accessedAt?: number;
  children?: Tree[];
};

export default Tree;
