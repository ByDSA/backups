import { Tree, calculateSizeOfBranches } from "~/tree";
// eslint-disable-next-line import/no-internal-modules
import { TreeNormal } from "~/tree/Tree";

function createNode(n: number): TreeNormal {
  return Object.freeze( {
    size: n * 123,
    name: `node${n}`,
    modificatedAt: Date.now(),
    createdAt: Date.now(),
    hash: `fakeHashNode${n}`,
  } );
}
function createNodeDup(n: number): TreeNormal {
  return Object.freeze( {
    ...createNode(n),
    name: `node${n}Dup`,
  } );
}

export const N1: TreeNormal = createNode(1);

export const N2: TreeNormal = createNode(2);

export const N3: TreeNormal = createNode(2);

export const N1DUP: TreeNormal = createNodeDup(1);

export const R1: TreeNormal = Object.freeze( {
  ...N1,
  name: "root",
  hash: "fakeHashRoot1",
} );

export const R1_CHILDREN_N1_N1DUP: Tree = Object.freeze( {
  ...R1,
  size: N1.size + N1DUP.size,
  children: [
    N1,
    N1DUP,
  ],
} );

export const R1_CHILDREN_N1_N2: Tree = Object.freeze( {
  ...R1,
  children: [
    N1,
    N2,
  ],
} );

function createBranch(n: number, ...children: Tree[]): Tree {
  const size = calculateSizeOfBranches(children);

  return Object.freeze( {
    ...N1,
    name: `branch${n}`,
    hash: `fakeHashBranch${n}`,
    size,
    children,
  } );
}

export const B1_N3: Tree = createBranch(1, N3);
