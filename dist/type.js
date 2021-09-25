"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTypeFile = exports.Type = void 0;
var Type;
(function (Type) {
    Type["ISO"] = "iso";
})(Type = exports.Type || (exports.Type = {}));
function isTypeFile(type) {
    return type === Type.ISO;
}
exports.isTypeFile = isTypeFile;
//# sourceMappingURL=type.js.map