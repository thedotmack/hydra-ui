import type { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import type { Connection, PublicKey, Signer, Transaction } from "@solana/web3.js";
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
    signers?: Signer[];
    silent?: boolean;
}): Promise<string>;
export declare function executeTransactions<T = null>(connection: Connection, txs: Transaction[], wallet: Wallet, config?: {
    signers?: Signer[];
    batchSize?: number;
    errorHandler?: (e: unknown) => T;
}): Promise<(string | null | T)[]>;
export declare const handleError: (e: unknown) => void;
//# sourceMappingURL=transactions.d.ts.map