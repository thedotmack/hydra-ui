/// <reference types="node" />
import { AccountInfo } from "@solana/web3.js";
export declare const chunks: <T>(array: T[], size: number) => T[][];
export declare const getMultipleAccounts: (connection: any, keys: string[], commitment: string) => Promise<{
    keys: string[];
    array: AccountInfo<Buffer>[];
}>;
//# sourceMappingURL=getMultipleAccounts.d.ts.map