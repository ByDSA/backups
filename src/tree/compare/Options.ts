import type { Difference } from "./types/Difference.js";
import { show } from "./utils.js";

type DifferenceCallBack = (difference: Difference)=> void;
type Filter = (difference: Difference)=> boolean;

export type Options = {
  onDifference?: DifferenceCallBack;
  filter?: Filter;
};

export const DEFAULT_OPTIONS: Options = {
  onDifference: show,
};
