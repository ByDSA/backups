import { N1DUP } from "@tests/trees";
import { compareTree } from ".";
import { TREE_COMPARE1_ADD_N1DUP, TREE_COMPARE1_BASE, TREE_COMPARE1_DEL_N2, TREE_COMPARE1_REN_N1 } from "./compareTree.mock.spec";
import Difference from "./Difference";

describe("all", () => {
  it("deleted", () => {
    const expected: Difference[] = [
      {
        type: "deleted",
        from: "/root/node2",
      },
    ];
    const actual = compareTree(TREE_COMPARE1_BASE, TREE_COMPARE1_DEL_N2);

    expect(actual).toStrictEqual(expected);
  } );

  it("renamed", () => {
    const expected: Difference[] = [
      {
        type: "renamed",
        from: "/root/node1",
        to: "/root/node1Dup",
      },
    ];
    const actual = compareTree(TREE_COMPARE1_BASE, TREE_COMPARE1_REN_N1);

    expect(actual).toStrictEqual(expected);
  } );

  it("created", () => {
    const expected: Difference[] = [
      {
        type: "created",
        to: "/root/node1Dup",
        tree: N1DUP,
      },
    ];
    const actual = compareTree(TREE_COMPARE1_BASE, TREE_COMPARE1_ADD_N1DUP);

    expect(actual).toStrictEqual(expected);
  } );
} );
