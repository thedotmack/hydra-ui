"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePersistedKVStore = void 0;
const react_1 = require("react");
function usePersistedKVStore(key, defaultState, storageAdapter) {
    const [state, setState] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        void (async () => {
            const storedState = await storageAdapter.get(key);
            if (storedState) {
                console.debug(`Restoring user settings for ${key}`);
                setState(JSON.parse(storedState));
            }
        })();
    }, [key, storageAdapter]);
    const setLocalStorageState = (0, react_1.useCallback)(async (newState) => {
        const changed = state !== newState;
        if (!changed) {
            return;
        }
        if (newState === null) {
            await storageAdapter.remove(key);
            setState(defaultState);
        }
        else {
            await storageAdapter.set(key, JSON.stringify(newState));
            setState(newState);
        }
    }, [state, defaultState, storageAdapter, key]);
    return [state !== null && state !== void 0 ? state : defaultState, setLocalStorageState];
}
exports.usePersistedKVStore = usePersistedKVStore;
//# sourceMappingURL=usePersistedKVStore.js.map