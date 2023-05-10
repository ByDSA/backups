import { N1, N1DUP, R1_CHILDREN_N1_N1DUP } from "#tests/trees";
import flattenNode from "../flattenNode";
import flattenPathsMap from "./flattenPathsMap";
import { PathsMap } from "./types";

it("one node", () => {
  const nodeWithoutChildrenFlat = flattenNode(N1);
  const expected: PathsMap = new Map([[nodeWithoutChildrenFlat.path, nodeWithoutChildrenFlat]]);
  const actual = flattenPathsMap(N1);

  expect(actual).toStrictEqual(expected);
} );

it("root with two duplicated nodes", () => {
  const rootFlat = flattenNode(R1_CHILDREN_N1_N1DUP);
  const nodeWithoutChildrenFlat = flattenNode(N1, `/${R1_CHILDREN_N1_N1DUP.name}`);
  const nodeWithoutChildrenFlat2 = flattenNode(N1DUP, `/${R1_CHILDREN_N1_N1DUP.name}`);
  const expected: PathsMap = new Map([
    [nodeWithoutChildrenFlat.path, nodeWithoutChildrenFlat],
    [nodeWithoutChildrenFlat2.path, nodeWithoutChildrenFlat2],
    [rootFlat.path, rootFlat],
  ]);
  const actual = flattenPathsMap(R1_CHILDREN_N1_N1DUP);

  expect(actual).toStrictEqual(expected);
} );
