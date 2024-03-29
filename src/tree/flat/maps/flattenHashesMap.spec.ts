import { N1, N1DUP, R1_CHILDREN_N1_N1DUP } from "#tests/trees";
// eslint-disable-next-line import/no-internal-modules
import { TreeNormal } from "~/tree/Tree";
import flattenNode from "../flattenNode";
import flattenHashesMap from "./flattenHashesMap";
import { HashesMap } from "./types";

it("one node", () => {
  const nodeWithoutChildrenFlat = flattenNode(N1);
  const expected: HashesMap = new Map([[N1.hash, [nodeWithoutChildrenFlat]]]);
  const actual = flattenHashesMap(N1);

  expect(actual).toStrictEqual(expected);
} );

it("root with two duplicated nodes", () => {
  const rootFlat = flattenNode(R1_CHILDREN_N1_N1DUP);
  const nodeWithoutChildrenFlat = flattenNode(N1, `/${R1_CHILDREN_N1_N1DUP.name}`);
  const nodeWithoutChildrenFlat2 = flattenNode(N1DUP, `/${R1_CHILDREN_N1_N1DUP.name}`);
  const expected: HashesMap = new Map([
    [
      N1.hash, [
        nodeWithoutChildrenFlat,
        nodeWithoutChildrenFlat2,
      ],
    ],
    [
      (R1_CHILDREN_N1_N1DUP as TreeNormal).hash, [
        rootFlat,
      ],
    ],
  ]);
  const actual = flattenHashesMap(R1_CHILDREN_N1_N1DUP);

  expect(actual).toStrictEqual(expected);
} );
