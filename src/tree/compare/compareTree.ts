import { plainPathsMap } from "../plain";
import Tree from "../Tree";

type Options = {

};
const OptionsDefault: Options = {

};

type From = {
  from: string;
};
type To = {
  to: string;
};

type FromTo = From & To;

type Treeable = {
  tree: Tree;
};

type Difference = From & {
  type: "deleted";
} | FromTo & {
  type: "moved";
} | To & Treeable & {
  type: "created";
} | To & Treeable & {
  type: "updated";
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
