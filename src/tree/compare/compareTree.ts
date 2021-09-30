import { plainPathsMap } from "../plain";
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
  const plainPathMap1 = plainPathsMap(t1);
  const plainPathMap2 = plainPathsMap(t2);

  for (const pair of plainPathMap1) {
    const path = pair[0];

    if (!plainPathMap2.has(path)) { // Deleted, moved or renamed
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
