"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateOutput = exports.makeISO = void 0;
const tslib_1 = require("tslib");
const chalk_1 = (0, tslib_1.__importDefault)(require("chalk"));
const fs_1 = require("fs");
const cmd_1 = require("./cmd");
const paths_1 = require("./paths");
const timestamp_1 = require("./timestamp");
function makeISO(inputFolder, outputISO) {
    console.log(chalk_1.default.blue(`Creating ISO '${outputISO}'...`));
    (0, cmd_1.cmd)(`mkisofs -allow-limited-size -iso-level 4 -J -joliet-long -l -R -o "${outputISO}" "${inputFolder}"`);
    if (!(0, fs_1.existsSync)(outputISO)) {
        console.log(chalk_1.default.red(`ISO not exists! ${outputISO}`));
        process.exit(1);
    }
}
exports.makeISO = makeISO;
function calculateOutput({ input, out }) {
    const TIMESTAMP = (0, timestamp_1.getDateTimestamp)();
    let OUT_FOLDER = "";
    if (out && !(0, fs_1.lstatSync)(out).isDirectory()) {
        if ((0, fs_1.existsSync)(out))
            OUT_FOLDER = out;
        else if ((0, fs_1.existsSync)((0, paths_1.dirname)(out)))
            OUT_FOLDER = (0, paths_1.dirname)(out);
    }
    else
        OUT_FOLDER = (0, paths_1.dirname)(input);
    return `${OUT_FOLDER}/${(0, paths_1.basename)(input)} [${TIMESTAMP}].iso`;
}
exports.calculateOutput = calculateOutput;
//# sourceMappingURL=iso.js.map