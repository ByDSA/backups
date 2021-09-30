import { R1, R1_CHILDREN_N1_N2, removeChildren } from "@tests/trees";
import flattenNode from "./flattenNode";
import FlatTree from "./FlatTree";

describe("flattenNode", () => {
  it("removes children", () => {
    const actual = flattenNode(R1_CHILDREN_N1_N2);

    expect((<any>actual).children).toBeUndefined();
  } );

  it("returns only root", () => {
    const expected: FlatTree = {
      ...removeChildren(R1),
      path: `/${R1.name}`,
    };
    const actual = flattenNode(R1_CHILDREN_N1_N2);

    expect(actual).toStrictEqual(expected);
  } );
} );
