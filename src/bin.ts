#!/bin/node
import chalk from "chalk";
import { forceSudo, processParams } from "./index";

forceSudo();
processParams();

console.log(chalk.green("Done!"));
