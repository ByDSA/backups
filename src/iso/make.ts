import { cmd } from "@app/cmd";
import { Tree } from "@app/tree";
import chalk from "chalk";
import { existsSync } from "fs";
import { basename } from "path";

type Options = {
  tree?: Tree;
};

export default function make(inputFolder: string, outputISO: string, opts?: Options) {
  console.log(chalk.blue(`Creating ISO '${outputISO}'...`));

  const label = basename(inputFolder);
  let sizeLimitation: Tree | null = null;
  let lengthLimitation: Tree | null = null;

  if (opts?.tree) {
    sizeLimitation = findOneSizeLimitation(opts.tree);
    lengthLimitation = findOneLengthLimitation(opts.tree);
  }

  if (sizeLimitation && lengthLimitation)
    throw new Error(`SizeLimitation exceeded: ${sizeLimitation?.name}\nLengthLimitation exceeded: ${lengthLimitation?.name}`);

  try {
    makeLongNames( {
      label,
      outputISO,
      inputFolder,
    } );
  } catch (e) {
    if (lengthLimitation)
      throw new Error(`LengthLimitation exceeded: ${lengthLimitation?.name}`);
    else {
      makeLongSizes( {
        label,
        outputISO,
        inputFolder,
      } );
    }
  }

  checkIsISOCreated(outputISO);
}

function makeLongSizes( { label, outputISO, inputFolder }: any) {
  console.log("Try makeLongSizes...");
  cmd(`mkisofs -R -J -joliet-long -allow-limited-size -iso-level 3 -V "${label}" -o "${outputISO}" "${inputFolder}"`);
}

function makeLongNames( { label, outputISO, inputFolder }: any) {
  console.log("Try makeLongNames [filename MAX=103]...");
  cmd(`mkisofs -R -J -joliet-long -iso-level 4 -V "${label}" -o "${outputISO}" "${inputFolder}"`);
}

function checkIsISOCreated(outputISO: string) {
  if (!existsSync(outputISO)) {
    console.log(chalk.red(`ISO not exists! ${outputISO}`));
    process.exit(1);
  }
}

function findOneSizeLimitation(tree: Tree): Tree | null {
  return findOne(tree, (t: Tree) => t.children === undefined && t.size >= 4 * 1024 ** 3);
}

function findOneLengthLimitation(tree: Tree): Tree | null {
  return findOne(tree, (t: Tree) => (t.children === undefined && t.name.length > 310)
   || t.name.length > 300);
}

function findOne(tree: Tree, condition: (tree: Tree)=> boolean): Tree | null {
  if (condition(tree))
    return tree;

  if (tree.children) {
    for (const c of tree.children) {
      const found = findOne(c, condition);

      if (found)
        return found;
    }
  }

  return null;
}
