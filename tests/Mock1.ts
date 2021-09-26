import FileNode from "./FileNode";
import Mock from "./FilesMock";

const files: FileNode[] = [
  {
    path: "sampleFile",
    content: "fdfdfsdfsdfsdfsdf",
    modificatedAt: 1632649278,
  },
  {
    path: "folder",
    folder: true,
    modificatedAt: 3,
  },
  {
    path: "folder/sampleFile",
    content: "fdfdfsdfsdfsdfsdf",
    modificatedAt: 66,
  },
  {
    path: "folder/emptyFile",
    modificatedAt: 1632649277,
  },
  {
    path: "folder2",
    folder: true,
    modificatedAt: 4,
  },
  {
    path: "folder2/emptyFile",
    modificatedAt: 1632649277,
  },
  {
    path: "emptyFolder",
    folder: true,
    modificatedAt: 9,
  },
];
const generateMock = (basePath: string) => new Mock( {
  files,
  basePath,
} );

export default generateMock;
