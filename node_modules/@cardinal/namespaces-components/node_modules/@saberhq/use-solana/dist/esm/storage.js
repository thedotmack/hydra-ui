/**
 * Adapter to use `localStorage` for storage.
 */
export const LOCAL_STORAGE_ADAPTER = {
    get(key) {
        return Promise.resolve(localStorage.getItem(key));
    },
    set(key, value) {
        localStorage.setItem(key, value);
        return Promise.resolve();
    },
    remove(key) {
        localStorage.removeItem(key);
        return Promise.resolve();
    },
};
//# sourceMappingURL=storage.js.map