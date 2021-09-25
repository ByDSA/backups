"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forceSudo = exports.cmd = exports.checkAfter = exports.deleteBaseSource = exports.makeBackup = exports.removePreviousIfNeeded = exports.calculateOutputFileName = exports.processParams = void 0;
const tslib_1 = require("tslib");
const chalk_1 = (0, tslib_1.__importDefault)(require("chalk"));
const yargs_1 = (0, tslib_1.__importDefault)(require("yargs"));
const iso_1 = require("./iso");
const paths_1 = require("./paths");
const type_1 = require("./type");
function processParams() {
    // eslint-disable-next-line global-require
    const VERSION = require("../package.json").version;
    let config;
    yargs_1.default.command("$0", `Backup ${VERSION}`, (y) => {
        y
            .alias("v", "version")
            .version(VERSION)
            .option("input", {
            alias: "i",
            type: "string",
            describe: "Input file or folder",
            demandOption: true,
        })
            .option("force", {
            alias: "f",
            boolean: true,
            describe: "Force to create backup",
        })
            .option("checkAfter", {
            alias: "c",
            boolean: true,
            describe: "Check the backup integrity after the backup done",
        })
            .option("deleteAfter", {
            alias: "d",
            boolean: true,
            describe: "Delete the original sources after the backup is done",
        })
            .option("type", {
            alias: "t",
            describe: "Type of backup",
            choices: ["iso"],
            demandOption: true,
        });
    }, (argv) => {
        config = {
            input: argv.input,
            force: !!argv.force,
            checkAfter: !!argv.checkAfter,
            deleteAfter: !!argv.deleteAfter,
            type: argv.type,
        };
        console.log(config);
    })
        .help()
        .alias("h", "help")
        .parse();
    if (!config)
        throw new Error("config undefined");
    console.log(chalk_1.default.blue(`[Backup: '${config.input}']`));
    console.log(config);
    return config;
}
exports.processParams = processParams;
function calculateOutputFileName({ out, input, type }) {
    switch (type) {
        case type_1.Type.ISO: return (0, iso_1.calculateOutput)({
            out,
            input,
        });
        default: return "";
    }
}
exports.calculateOutputFileName = calculateOutputFileName;
function removePreviousIfNeeded({ force, out }) {
    if (force)
        (0, paths_1.rm)(out);
}
exports.removePreviousIfNeeded = removePreviousIfNeeded;
function makeBackup({ input, out, type }) {
    switch (type) {
        case type_1.Type.ISO: return (0, iso_1.makeISO)(input, out);
        default: throw new Error("Type invalid");
    }
}
exports.makeBackup = makeBackup;
function deleteBaseSource({ input }) {
    console.log(chalk_1.default.blue("Deleting base source ..."));
    (0, paths_1.rm)(input);
}
exports.deleteBaseSource = deleteBaseSource;
var check_1 = require("./check");
Object.defineProperty(exports, "checkAfter", { enumerable: true, get: function () { return check_1.checkAfter; } });
var cmd_1 = require("./cmd");
Object.defineProperty(exports, "cmd", { enumerable: true, get: function () { return cmd_1.cmd; } });
Object.defineProperty(exports, "forceSudo", { enumerable: true, get: function () { return cmd_1.forceSudo; } });
//# sourceMappingURL=utils.js.map