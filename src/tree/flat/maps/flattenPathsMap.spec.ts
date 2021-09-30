import { NODE_WITHOUT_CHILDREN, ROOT_WITH_TWO_DUPLICATED_CHILDREN } from "@tests/trees";
import flattenNode from "../flattenNode";
import flattenPathsMap, { PathsMap } from "./flattenPathsMap";

it("one node", () => {
  const nodeWithoutChildrenFlat = flattenNode(NODE_WITHOUT_CHILDREN);
  const expected: PathsMap = new Map([[nodeWithoutChildrenFlat.path, nodeWithoutChildrenFlat]]);
  const actual = flattenPathsMap(NODE_WITHOUT_CHILDREN);

  expect(actual).toStrictEqual(expected);
} );

it("root with two duplicated nodes", () => {
  const rootFlat = flattenNode(ROOT_WITH_TWO_DUPLICATED_CHILDREN);
  const nodeWithoutChildrenFlat = flattenNode(NODE_WITHOUT_CHILDREN, `/${ROOT_WITH_TWO_DUPLICATED_CHILDREN.name}`);
  const nodeWithoutChildrenFlat2 = flattenNode( {
    ...NODE_WITHOUT_CHILDREN,
    name: "node2",
  }, `/${ROOT_WITH_TWO_DUPLICATED_CHILDREN.name}`);
  const expected: PathsMap = new Map([
    [nodeWithoutChildrenFlat.path, nodeWithoutChildrenFlat],
    [nodeWithoutChildrenFlat2.path, nodeWithoutChildrenFlat2],
    [rootFlat.path, rootFlat],
  ]);
  const actual = flattenPathsMap(ROOT_WITH_TWO_DUPLICATED_CHILDREN);

  expect(actual).toStrictEqual(expected);
} );
