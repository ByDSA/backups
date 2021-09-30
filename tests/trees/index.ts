import { Tree } from "@app/tree";

export {
  genFileMock1,
  NODE_WITHOUT_CHILDREN,
  NODE_WITH_CHILDREN,
  ROOT_WITH_TWO_DUPLICATED_CHILDREN,
} from "./mocks";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function removeChildren( { children, ...obj }: Tree) {
  return obj;
}
