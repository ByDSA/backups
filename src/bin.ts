#!/bin/node
import chalk from "chalk";
import { forceSudo, processParams } from "./index.js";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

forceSudo();

const cli = yargs(hideBin(process.argv));
processParams(cli);

console.log(chalk.green("Done!"));
