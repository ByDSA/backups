"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAfter = void 0;
const tslib_1 = require("tslib");
const chalk_1 = (0, tslib_1.__importDefault)(require("chalk"));
const fs_1 = require("fs");
const cmd_1 = require("./cmd");
const paths_1 = require("./paths");
const type_1 = require("./type");
// eslint-disable-next-line import/prefer-default-export
function checkAfter({ type, input, out }) {
    console.log(chalk_1.default.blue("Checking backup integrity ..."));
    if (!out)
        throw new Error("out undefined");
    switch (type) {
        case type_1.Type.ISO:
            integrityISO(input, out);
            break;
        default: break;
    }
}
exports.checkAfter = checkAfter;
function integrityISO(inputFolder, outputISO) {
    let tmp = `${inputFolder}_bkptmp`;
    tmp = umountAndRemoveIfExists(tmp);
    console.log(`Temp folder: ${tmp}`);
    (0, fs_1.mkdirSync)(tmp);
    (0, cmd_1.cmd)(`sudo mount -t iso9660 -o loop,ro,map=off,check=relaxed "${outputISO}" "${tmp}"`);
    if (!(0, paths_1.isEqualDir)(inputFolder, tmp)) {
        console.log(chalk_1.default.red("ISO is not equal as base folder!"));
        process.exit(1);
    }
    (0, cmd_1.cmd)(`umount "${tmp}"`);
    (0, cmd_1.cmd)(`rm -rf "${tmp}"`);
    console.log("Integrity ok!");
}
function umountAndRemoveIfExists(tmp, n = 1) {
    const tmpWithNum = tmp + (n > 1 ? n : "");
    if ((0, fs_1.existsSync)(tmpWithNum)) {
        try {
            (0, cmd_1.cmd)(`umount "${tmpWithNum}"`);
            (0, cmd_1.cmd)(`rm -rf "${tmpWithNum}"`);
            return tmpWithNum;
        }
        catch (e) {
            return umountAndRemoveIfExists(tmp, n + 1);
        }
    }
    return tmpWithNum;
}
//# sourceMappingURL=check.js.map