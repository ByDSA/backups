import { NODE_WITHOUT_CHILDREN, ROOT_WITH_TWO_DUPLICATED_CHILDREN } from "@tests/trees";
import flattenNode from "../flattenNode";
import flattenHashesMap, { HashesMap } from "./flattenHashesMap";

it("one node", () => {
  const nodeWithoutChildrenFlat = flattenNode(NODE_WITHOUT_CHILDREN);
  const expected: HashesMap = new Map([[NODE_WITHOUT_CHILDREN.hash, [nodeWithoutChildrenFlat]]]);
  const actual = flattenHashesMap(NODE_WITHOUT_CHILDREN);

  expect(actual).toStrictEqual(expected);
} );

it("node with two duplicated nodes", () => {
  const nodeWithoutChildrenFlat = flattenNode(NODE_WITHOUT_CHILDREN, `/${ROOT_WITH_TWO_DUPLICATED_CHILDREN.name}`);
  const expected: HashesMap = new Map([[NODE_WITHOUT_CHILDREN.hash, [
    nodeWithoutChildrenFlat,
    nodeWithoutChildrenFlat,
  ]]]);
  const actual = flattenHashesMap(ROOT_WITH_TWO_DUPLICATED_CHILDREN);

  expect(actual).toStrictEqual(expected);
} );
