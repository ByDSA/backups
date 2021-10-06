type Options = {
  rootNodeName?: string;
  useExistentTrees?: boolean;
  isRootNode?: boolean;
  ignoreValidTreeFiles?: boolean;
};

export default Options;

export const DEFAULT: Options = Object.freeze( {
  isInsideISO: false,
  useExistentTrees: true,
  isRootNode: true,
  ignoreValidTreeFiles: false,
} );
