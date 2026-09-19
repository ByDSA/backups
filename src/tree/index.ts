export type {
  Tree,
  TreeWithoutChildren,
} from "./Tree.js";

export {
  calculateSizeOfBranches,
} from "./branches.js";

export {
  default as compareTree, isEqual as isTreeEqual,
// eslint-disable-next-line import/no-internal-modules
} from "./compare/index.js";

export {
  default as findDuplicates,
} from "./findDuplicates.js";

export {
  default as generateTree,
} from "./generate.js";

export {
  default as isTree,
} from "./isTree.js";

export {
  default as joinTrees,
} from "./joinTrees.js";

export {
  default as readTree,
} from "./read.js";

export {
  default as saveTree,
} from "./save.js";
