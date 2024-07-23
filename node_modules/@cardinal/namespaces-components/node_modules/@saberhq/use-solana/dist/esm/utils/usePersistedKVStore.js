import { useCallback, useEffect, useState } from "react";
export function usePersistedKVStore(key, defaultState, storageAdapter) {
    const [state, setState] = useState(null);
    useEffect(() => {
        void (async () => {
            const storedState = await storageAdapter.get(key);
            if (storedState) {
                console.debug(`Restoring user settings for ${key}`);
                setState(JSON.parse(storedState));
            }
        })();
    }, [key, storageAdapter]);
    const setLocalStorageState = useCallback(async (newState) => {
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
//# sourceMappingURL=usePersistedKVStore.js.map