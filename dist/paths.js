"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rm = exports.isEqualFile = exports.isEqualDir = exports.normalizePath = exports.basename = exports.dirname = void 0;
const cmd_1 = require("./cmd");
function dirname(path) {
    const fixedPath = normalizePath(path);
    const lastSlashIndex = fixedPath.lastIndexOf("/");
    return path.substring(0, lastSlashIndex);
}
exports.dirname = dirname;
function basename(path) {
    const fixedPath = normalizePath(path);
    const lastSlashIndex = fixedPath.lastIndexOf("/");
    return fixedPath.substring(lastSlashIndex + 1);
}
exports.basename = basename;
function normalizePath(path) {
    let fixedPath = path;
    while (fixedPath.slice(-1) === "/")
        fixedPath = path.substring(0, path.length - 1);
    return fixedPath;
}
exports.normalizePath = normalizePath;
function isEqualDir(d1, d2) {
    try {
        const ret = (0, cmd_1.cmd)(`diff -qr "${d1}" "${d2}"`);
        return !ret;
    }
    catch (e) {
        return false;
    }
}
exports.isEqualDir = isEqualDir;
function isEqualFile(f1, f2) {
    try {
        const ret = (0, cmd_1.cmd)(`diff -q "${f1}" "${f2}"`);
        return !ret;
    }
    catch (e) {
        return false;
    }
}
exports.isEqualFile = isEqualFile;
function rm(path) {
    (0, cmd_1.cmd)(`rm -rf "${path}"`);
}
exports.rm = rm;
//# sourceMappingURL=paths.js.map