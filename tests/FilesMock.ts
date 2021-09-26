import fs from "fs";
import { dirname } from "path";
import util from "util";
import { utimes } from "utimes";
import FileNode from "./FileNode";

export enum MockStatus {
  READY, CREATED, DELETED,
}

export type MockConfig = {
  basePath: string;
  files: FileNode[];
};

export default class FilesMock {
  private _status: MockStatus;

  constructor(protected config: MockConfig) {
    this._status = MockStatus.READY;
    Object.freeze(this.config);
  }

  // eslint-disable-next-line accessor-pairs
  get status(): MockStatus {
    return this._status;
  }

  // eslint-disable-next-line accessor-pairs
  get files(): FileNode[] {
    return this.config.files;
  }

  findFileByPath(p: string) {
    return this.files.filter((f) => f.path === p)[0];
  }

  async create(): Promise<FilesMock> {
    if (this.status !== MockStatus.READY)
      throw new Error("Mock is already created.");

    await this._delete();

    const { basePath, files } = this.config;

    fs.mkdirSync(basePath, {
      recursive: true,
    } );

    const folders = [];

    for (const f of files) {
      const fullPath = `${basePath}/${f.path}`;
      const folderFullPath = f.folder ? fullPath : dirname(fullPath);

      fs.mkdirSync(folderFullPath, {
        recursive: true,
      } );

      if (!f.folder) {
        fs.writeFileSync(fullPath, f.content ?? "");
        // eslint-disable-next-line no-await-in-loop
        await getUpdateFileTimeFunc(basePath)(f);
      } else
        folders.push(f);
    }

    const folderPromises = folders.map((f) => getUpdateFileTimeFunc(basePath)(f));

    await Promise.all(folderPromises);

    this._status = MockStatus.CREATED;

    return this;
  }

  private _delete() {
    return util.promisify(fs.rmdir)(this.config.basePath, {
      recursive: true,
    } );
  }

  async delete(): Promise<FilesMock> {
    if (this.status !== MockStatus.CREATED)
      throw new Error("Mock is not created yet.");

    await this._delete();

    this._status = MockStatus.DELETED;

    return this;
  }
}

function getUpdateFileTimeFunc(basePath: string) {
  return (f: FileNode) => utimes(`${basePath}/${f.path}`, {
    mtime: f.modificatedAt ? f.modificatedAt * 1000 : undefined,
  } );
}
