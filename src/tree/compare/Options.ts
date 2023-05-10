import Difference from "./types/Difference";
import { show } from "./utils";

type DifferenceCallBack = (difference: Difference)=> void;
type Filter = (difference: Difference)=> boolean;

type Options = {
  onDifference?: DifferenceCallBack;
  filter?: Filter;
};
export const DEFAULT_OPTIONS: Options = {
  onDifference: show,
};

export default Options;
