import Tree from "@app/tree/Tree";
import mockGen from "@mocks/files1";
import FilesMock from "@tests/FilesMock";
import { treeDir } from "@tests/index";
import findTreeAsync from "./findTree";

describe("all", () => {
  let DIR_TREE_BASE: string;
  let mock1: FilesMock;

  beforeAll(async () => {
    DIR_TREE_BASE = treeDir();
    Object.freeze(DIR_TREE_BASE);

    mock1 = await mockGen(DIR_TREE_BASE).create();
  } );

  afterAll(async () => {
    await mock1.delete();
  } );

  it("findTree", async () => {
    const actual: Tree = await findTreeAsync(DIR_TREE_BASE);
    const expected: Tree = {
      hash: "b909225523bb35b83825b8def68c1f6eaecd778f5e2e4bf30f50e67e6a3a2dfd",
      size: 34,
      name: "tree",
      modificatedAt: actual.modificatedAt,
      createdAt: actual.createdAt,
      accessedAt: actual.accessedAt,
      children: [
        {
          name: "emptyFolder",
          size: 0,
          hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
          accessedAt: <number>(<any>actual).children[0].accessedAt,
          modificatedAt: <number>mock1.findFileByPath("emptyFolder").modificatedAt,
          createdAt: <number>(<any>actual).children[0].createdAt,
          children: [],
        },
        {
          name: "folder",
          size: 17,
          hash: "12ee94ba257ddfb93dc1d489f762a7f44c4e8ef1e053a7f0b1b45a23f69b7013",
          accessedAt: <number>(<any>actual).children[1].accessedAt,
          modificatedAt: <number>mock1.findFileByPath("folder").modificatedAt,
          createdAt: <number>(<any>actual).children[1].createdAt,
          children: [
            {
              name: "emptyFile",
              size: 0,
              hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
              accessedAt: <number>(<any>actual).children[1].children[0].accessedAt,
              modificatedAt: <number>mock1.findFileByPath("folder/emptyFile").modificatedAt,
              createdAt: <number>(<any>actual).children[1].children[0].createdAt,
            },
            {
              name: "sampleFile",
              size: 17,
              hash: "bc6aa764a8c428c1fa04081a7fa98cfde121612eb190487195964fe49794a3bd",
              accessedAt: <number>(<any>actual).children[1].children[1].accessedAt,
              modificatedAt: <number>mock1.findFileByPath("folder/sampleFile").modificatedAt,
              createdAt: <number>(<any>actual).children[1].children[1].createdAt,
            },
          ],
        },
        {
          name: "folder2",
          size: 0,
          hash: "cd372fb85148700fa88095e3492d3f9f5beb43e555e5ff26d95f5a6adc36f8e6",
          accessedAt: <number>(<any>actual).children[2].accessedAt,
          modificatedAt: <number>mock1.findFileByPath("folder2").modificatedAt,
          createdAt: <number>(<any>actual).children[2].createdAt,
          children: [
            {
              name: "emptyFile",
              size: 0,
              hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
              accessedAt: <number>(<any>actual).children[2].children[0].accessedAt,
              modificatedAt: <number>mock1.findFileByPath("folder2/emptyFile").modificatedAt,
              createdAt: <number>(<any>actual).children[2].children[0].createdAt,
            },
          ],
        },
        {
          name: "sampleFile",
          size: 17,
          hash: "bc6aa764a8c428c1fa04081a7fa98cfde121612eb190487195964fe49794a3bd",
          accessedAt: <number>(<any>actual).children[3].accessedAt,
          modificatedAt: <number>mock1.findFileByPath("sampleFile").modificatedAt,
          createdAt: <number>(<any>actual).children[3].createdAt,
        },
      ],
    };

    expect(actual).toEqual(expected);
  } );
} );
