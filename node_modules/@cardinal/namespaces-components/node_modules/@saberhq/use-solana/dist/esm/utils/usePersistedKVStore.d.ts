import type { StorageAdapter } from "../storage";
export declare function usePersistedKVStore<T>(key: string, defaultState: T, storageAdapter: StorageAdapter): [T, (newState: T | null) => Promise<void>];
//# sourceMappingURL=usePersistedKVStore.d.ts.map