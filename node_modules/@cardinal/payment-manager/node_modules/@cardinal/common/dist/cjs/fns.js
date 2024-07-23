"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryGetAccount = exports.tryNull = exports.tryFn = exports.isError = void 0;
const tslib_1 = require("tslib");
function isPromiseLike(obj) {
    return (!!obj &&
        (typeof obj === "object" || typeof obj === "function") &&
        typeof obj.then === "function");
}
function tryify(fn, e) {
    return fn.then((v) => v, (err) => e !== null && e !== void 0 ? e : err);
}
const isError = (e) => {
    return e instanceof Error;
};
exports.isError = isError;
/**
 * Wrap async function in try catch
 * @param p
 * @returns
 */
const tryFn = (fn) => {
    if (isPromiseLike(fn))
        return tryify(fn);
    try {
        const v = fn();
        if (isPromiseLike(v))
            return tryify(v);
        return v;
    }
    catch (err) {
        return new Error(String(err));
    }
};
exports.tryFn = tryFn;
const tryNull = (fn, errorHandler) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const v = yield (0, exports.tryFn)(fn);
    if ((0, exports.isError)(v)) {
        errorHandler && errorHandler(v);
        return null;
    }
    return v;
});
exports.tryNull = tryNull;
/**
 * Tries to get account based on function fn
 * Return null if account doesn't exist
 * @param fn
 * @returns
 */
function tryGetAccount(fn) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            return yield fn();
        }
        catch (_a) {
            return null;
        }
    });
}
exports.tryGetAccount = tryGetAccount;
//# sourceMappingURL=fns.js.map