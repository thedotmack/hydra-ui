export declare class CacheUpdateEvent {
    static type: string;
    id: string;
    parser: any;
    isNew: boolean;
    constructor(id: string, isNew: boolean, parser: any);
}
export declare class CacheDeleteEvent {
    static type: string;
    id: string;
    constructor(id: string);
}
export declare class EventEmitter {
    private emitter;
    onCache(callback: (args: CacheUpdateEvent) => void): () => import("eventemitter3")<string | symbol, any>;
    raiseCacheUpdated(id: string, isNew: boolean, parser: any): void;
    raiseCacheDeleted(id: string): void;
}
//# sourceMappingURL=eventEmitter.d.ts.map