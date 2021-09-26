type FileNode = {
  path: string;
  content?: string;
  modificatedAt?: number;
  folder?: boolean;
};
export default FileNode;
