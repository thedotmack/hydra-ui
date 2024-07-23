/// <reference types="node" />
import { AccountInfo, Commitment, Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
import { EventEmitter } from "./eventEmitter";
export declare const DEFAULT_CHUNK_SIZE = 99;
export declare const DEFAULT_DELAY = 50;
export declare type TypedAccountParser<T> = (pubkey: PublicKey, data: AccountInfo<Buffer>) => T;
export interface ParsedAccountBase<T> {
    pubkey: PublicKey;
    account: AccountInfo<Buffer>;
    info?: T;
}
export declare type AccountParser<T> = (pubkey: PublicKey, data: AccountInfo<Buffer>) => ParsedAccountBase<T> | undefined;
export declare class AccountFetchCache {
    connection: Connection;
    chunkSize: number;
    delay: number;
    commitment: Commitment;
    accountWatchersCount: Map<string, number>;
    accountChangeListeners: Map<string, number>;
    statics: Set<string>;
    missingAccounts: Map<string, AccountParser<unknown> | undefined>;
    genericCache: Map<string, ParsedAccountBase<unknown> | null>;
    keyToAccountParser: Map<string, AccountParser<unknown> | undefined>;
    timeout: NodeJS.Timeout | null;
    currentBatch: Set<string>;
    pendingCallbacks: Map<string, (info: AccountInfo<Buffer> | null, err: Error | null) => void>;
    pendingCalls: Map<string, Promise<ParsedAccountBase<unknown>>>;
    emitter: EventEmitter;
    missingInterval: NodeJS.Timeout;
    constructor({ connection, chunkSize, delay, commitment, missingRefetchDelay, extendConnection, }: {
        connection: Connection;
        chunkSize?: number;
        delay?: number;
        commitment: Commitment;
        missingRefetchDelay?: number;
        /** Add functionatility to getAccountInfo that uses the cache */
        extendConnection?: boolean;
    });
    requeryMissing(instructions: TransactionInstruction[]): Promise<void>;
    fetchMissing(): Promise<void>;
    close(): void;
    fetchBatch(): Promise<{
        keys: string[];
        array: AccountInfo<Buffer>[];
    }>;
    addToBatch(id: PublicKey): Promise<AccountInfo<Buffer>>;
    flush(): Promise<void>;
    searchAndWatch<T>(pubKey: string | PublicKey, parser?: AccountParser<T> | undefined, isStatic?: Boolean, // optimization, set if the data will never change
    forceRequery?: boolean): Promise<[ParsedAccountBase<T> | undefined, () => void]>;
    updateCache<T>(id: string, data: ParsedAccountBase<T> | null): Promise<void>;
    static defaultParser: AccountParser<any>;
    search<T>(pubKey: string | PublicKey, parser?: AccountParser<T> | undefined, isStatic?: Boolean, // optimization, set if the data will never change
    forceRequery?: boolean): Promise<ParsedAccountBase<T> | undefined>;
    onAccountChange<T>(key: PublicKey, parser: AccountParser<T> | undefined, account: AccountInfo<Buffer>): void;
    watch<T>(id: PublicKey, parser?: AccountParser<T> | undefined, exists?: Boolean): () => void;
    query<T>(pubKey: string | PublicKey, parser?: AccountParser<T>): Promise<ParsedAccountBase<T>>;
    getParsed<T>(id: PublicKey | string, obj: AccountInfo<Buffer>, parser?: AccountParser<T>): ParsedAccountBase<T> | undefined;
    get(pubKey: string | PublicKey): ParsedAccountBase<unknown> | null | undefined;
    delete(pubKey: string | PublicKey): boolean;
    byParser<T>(parser: AccountParser<T>): string[];
    registerParser<T>(pubkey: PublicKey | string, parser: AccountParser<T> | undefined): string | PublicKey;
}
//# sourceMappingURL=accountFetchCache.d.ts.map