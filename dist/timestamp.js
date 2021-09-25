"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateTimestamp = void 0;
// eslint-disable-next-line import/prefer-default-export
function getDateTimestamp() {
    const NOW = new Date();
    return `${NOW.getFullYear()}-${(NOW.getMonth() + 1).toString().padStart(2, "0")}-${NOW.getDate().toString()
        .padStart(2, "0")}`;
}
exports.getDateTimestamp = getDateTimestamp;
//# sourceMappingURL=timestamp.js.map