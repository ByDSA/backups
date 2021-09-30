import { NODE_WITH_CHILDREN, removeChildren } from "@tests/trees";
import flattenNode from "./flattenNode";
import FlatTree from "./FlatTree";

describe("flattenNode", () => {
  it("removes children", () => {
    const actual = flattenNode(NODE_WITH_CHILDREN);

    expect((<any>actual).children).toBeUndefined();
  } );

  it("only root", () => {
    const expected: FlatTree = {
      ...removeChildren(NODE_WITH_CHILDREN),
      path: "/root",
    };
    const actual = flattenNode(NODE_WITH_CHILDREN);

    expect(actual).toStrictEqual(expected);
  } );
} );
