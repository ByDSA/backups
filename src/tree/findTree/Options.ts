type Options = {
  rootNodeName?: string;
  useExistentTrees?: boolean;
  isRootNode?: boolean;
};

export default Options;

export const DEFAULT = Object.freeze( {
  isInsideISO: false,
  useExistentTrees: true,
  isRootNode: true,
} );
