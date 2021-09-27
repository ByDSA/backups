/* eslint-disable guard-for-in */
import Tree from "./Tree";

export type Options = {
  level: number;
  ignoreTimesLevel0: boolean;
};
const defaultOptions = {
  level: 0,
  ignoreTimesLevel0: true,
};

export default function isTreeEqual(t1: Tree, t2: Tree, opts?: Options): boolean {
  const finalOpts = {
    ...defaultOptions,
    ...opts,
  };

  if (((finalOpts.level === 0 && !finalOpts.ignoreTimesLevel0)
    || finalOpts.level > 0)) {
    if (t1.createdAt !== t2.createdAt)
      return false;

    if (t1.modificatedAt !== t2.modificatedAt)
      return false;
  }

  if (t1.hash !== t2.hash)
    return false;

  if (t1.name !== t2.name)
    return false;

  if (t1.size !== t2.size)
    return false;

  if (xor(t1.children === undefined, t2.children === undefined)
    || t1.children?.length !== t2.children?.length)
    return false;

  if (t1.children !== undefined) {
    // eslint-disable-next-line no-restricted-syntax
    for (const i in t1.children) {
      if (t2.children === undefined)
        throw new Error();

      if (!isTreeEqual(
        t1.children.sort()[i],
        t2.children.sort()[i],
        {
          ...finalOpts,
          level: finalOpts.level + 1,
        },
      ))
        return false;
    }
  }

  return true;
}

function xor(a: boolean, b: boolean): boolean {
  return a ? !b : b;
}

// TODO
/*
export default function compareTree(t1: Tree, t2: Tree, opts?: Options): Difference[] {
  const finalOpts = {
    ...defaultOptions,
    ...opts,
  };

  // Trees que se han movido (mismo hash, otra ruta, ignorar archivos vacíos)

  // Trees que se han borrado

  // Trees nuevos

  // Trees modificados

  return {
  };
}
*/
