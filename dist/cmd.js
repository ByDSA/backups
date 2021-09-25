"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cmd = exports.forceSudo = exports.checkSudo = void 0;
const child_process_1 = require("child_process");
function checkSudo() {
    const uid = process.env.SUDO_UID;
    return !!uid;
}
exports.checkSudo = checkSudo;
function forceSudo() {
    if (!checkSudo()) {
        console.log("Please run this script with sudo.");
        process.exit(1);
    }
}
exports.forceSudo = forceSudo;
function cmd(c) {
    return (0, child_process_1.execSync)(c, {
        stdio: "inherit",
    });
}
exports.cmd = cmd;
//# sourceMappingURL=cmd.js.map