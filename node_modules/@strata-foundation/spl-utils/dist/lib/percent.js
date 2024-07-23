"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.percent = void 0;
const percent = (p) => {
    if (typeof p !== "undefined" && p != null) {
        return Math.floor((p / 100) * 4294967295); // unit32 max value
    }
};
exports.percent = percent;
//# sourceMappingURL=percent.js.map