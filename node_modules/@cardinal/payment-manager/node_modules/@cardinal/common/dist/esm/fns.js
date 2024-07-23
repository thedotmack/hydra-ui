import { __awaiter } from "tslib";
function isPromiseLike(obj) {
    return (!!obj &&
        (typeof obj === "object" || typeof obj === "function") &&
        typeof obj.then === "function");
}
function tryify(fn, e) {
    return fn.then((v) => v, (err) => e !== null && e !== void 0 ? e : err);
}
export const isError = (e) => {
    return e instanceof Error;
};
/**
 * Wrap async function in try catch
 * @param p
 * @returns
 */
export const tryFn = (fn) => {
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
export const tryNull = (fn, errorHandler) => __awaiter(void 0, void 0, void 0, function* () {
    const v = yield tryFn(fn);
    if (isError(v)) {
        errorHandler && errorHandler(v);
        return null;
    }
    return v;
});
/**
 * Tries to get account based on function fn
 * Return null if account doesn't exist
 * @param fn
 * @returns
 */
export function tryGetAccount(fn) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield fn();
        }
        catch (_a) {
            return null;
        }
    });
}
//# sourceMappingURL=fns.js.map