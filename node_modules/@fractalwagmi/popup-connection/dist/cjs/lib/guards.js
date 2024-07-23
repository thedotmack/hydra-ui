"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObject = void 0;
function isObject(value) {
    if (value === null) {
        return false;
    }
    if (typeof value !== 'object') {
        return false;
    }
    return true;
}
exports.isObject = isObject;
//# sourceMappingURL=guards.js.map