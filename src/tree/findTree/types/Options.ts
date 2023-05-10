type Options = {
  rootNodeName?: string;
  useExistentTrees?: boolean;
  isRootNode?: boolean;
  ignoreValidTreeFiles?: boolean;
  followISOs?: boolean;
};

// TODO: dont follow ISOs
// (en archivo de configuración se podrá determinar qué ISOs concretos con regex).

export default Options;

export const DEFAULT: Options = Object.freeze( {
  isInsideISO: false,
  useExistentTrees: true,
  isRootNode: true,
  ignoreValidTreeFiles: false,
  followISOs: true,
} );
