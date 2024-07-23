export function isObject(value) {
    if (value === null) {
        return false;
    }
    if (typeof value !== 'object') {
        return false;
    }
    return true;
}
//# sourceMappingURL=guards.js.map