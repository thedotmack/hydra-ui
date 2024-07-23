/**
 * Allows storing and persisting user settings.
 */
export interface StorageAdapter {
    get(key: string): Promise<string | null>;
    set(key: string, value: string): Promise<void>;
    remove(key: string): Promise<void>;
}
/**
 * Adapter to use `localStorage` for storage.
 */
export declare const LOCAL_STORAGE_ADAPTER: StorageAdapter;
//# sourceMappingURL=storage.d.ts.map