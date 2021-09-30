import { N1, N1DUP, N2, R1 } from "@tests/trees";
import Tree from "../Tree";

export const TREE_COMPARE1_BASE: Tree = Object.freeze( {
  ...R1,
  children: [
    N1,
    N2,
  ],
} );

export const TREE_COMPARE1_DEL_N2: Tree = Object.freeze( {
  ...R1,
  children: [
    N1,
  ],
} );

export const TREE_COMPARE1_REN_N1: Tree = Object.freeze( {
  ...R1,
  children: [
    N1DUP,
    N2,
  ],
} );

export const TREE_COMPARE1_ADD_N1DUP: Tree = Object.freeze( {
  ...R1,
  children: [
    N1, N2, N1DUP,
  ],
} );
