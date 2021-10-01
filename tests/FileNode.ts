type BufferEncoding = "ascii" | "base64" | "base64url" | "binary" | "hex" | "latin1" | "ucs-2" | "ucs2" | "utf-8" | "utf8" | "utf16le";

type FileNode = {
  path: string;
  content?: string;
  modificatedAt?: number;
  folder?: boolean;
  encoding?: BufferEncoding;
};
export default FileNode;
