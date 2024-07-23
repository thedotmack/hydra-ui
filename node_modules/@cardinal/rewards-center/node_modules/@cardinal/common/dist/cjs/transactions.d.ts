import type { Wallet } from "@coral-xyz/anchor/dist/cjs/provider";
import type { ConfirmOptions, Connection, PublicKey, Signer, Transaction } from "@solana/web3.js";
/**
 * Utility function for adding a find or init associated token account instruction to a transaction
 * Useful when using associated token accounts so you can be sure they are created before hand
 * @param transaction
 * @param connection
 * @param mint
 * @param owner
 * @param payer
 * @param allowOwnerOffCurve
 * @returns The associated token account ID that was found or will be created. This also adds the relevent instruction to create it to the transaction if not found
 */
export declare function withFindOrInitAssociatedTokenAccount(transaction: Transaction, connection: Connection, mint: PublicKey, owner: PublicKey, payer: PublicKey, allowOwnerOffCurve?: boolean): Promise<PublicKey>;
export declare function executeTransaction(connection: Connection, tx: Transaction, wallet: Wallet, config?: {
    lookupTableIds?: PublicKey[];
    signers?: Signer[];
    silent?: boolean;
    confirmOptions?: ConfirmOptions;
}): Promise<string>;
export declare function executeTransactions<T = null>(connection: Connection, txs: Transaction[], wallet: Wallet, config?: {
    signers?: Signer[];
    batchSize?: number;
    errorHandler?: (e: unknown) => T;
    confirmOptions?: ConfirmOptions;
}): Promise<(string | null | T)[]>;
export declare function executeTransactionSequence<T = void>(connection: Connection, txs: {
    tx: Transaction;
    signers?: Signer[];
}[][], wallet: Wallet, config?: {
    batchSize?: number;
    errorHandler?: (e: unknown, ix: {
        count: number;
        sequence: number;
        sequenceCount: number;
    }) => T;
    successHandler?: (ix: {
        count: number;
        sequence: number;
        sequenceCount: number;
    }) => T;
    confirmOptions?: ConfirmOptions;
}): Promise<(string | null | T)[][]>;
export declare const logError: (e: unknown) => void;
//# sourceMappingURL=transactions.d.ts.map