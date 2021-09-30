import { removeChildren, ROOT_WITH_CHILDREN } from "@tests/trees";
import flattenNode from "./flattenNode";
import FlatTree from "./FlatTree";

describe("flattenNode", () => {
  it("removes children", () => {
    const actual = flattenNode(ROOT_WITH_CHILDREN);

    expect((<any>actual).children).toBeUndefined();
  } );

  it("only root", () => {
    const expected: FlatTree = {
      ...removeChildren(ROOT_WITH_CHILDREN),
      path: "/root",
    };
    const actual = flattenNode(ROOT_WITH_CHILDREN);

    expect(actual).toStrictEqual(expected);
  } );
} );
