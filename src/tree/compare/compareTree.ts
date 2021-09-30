import { flattenPathsMap } from "../flat";
import Tree from "../Tree";
import Difference from "./Difference";

type Options = {

};
const OptionsDefault: Options = {

};

export default function compareTree(t1: Tree, t2: Tree, opts?: Options): Difference[] {
  const finalOpts = {
    ...OptionsDefault,
    ...opts,
  };
  const differences: Difference[] = [];
  const flatPathMap1 = flattenPathsMap(t1);
  const flatPathMap2 = flattenPathsMap(t2);

  for (const pair of flatPathMap1) {
    const path = pair[0];

    if (!flatPathMap2.has(path)) { // Deleted, moved or renamed
      differences.push( {
        type: "deleted",
        from: path,
      } );
    }
  }

  // Trees que se han movido (mismo hash, otra ruta, ignorar archivos vacíos)

  // Trees nuevos

  // Trees modificados

  return differences;
}
