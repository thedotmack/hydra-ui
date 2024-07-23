import type { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import type { Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
import { Transaction } from "@solana/web3.js";
/**
 * Build and execute mint Tx
 * @param connection
 * @param wallet
 * @param config
 * @returns
 */
export declare const createMint: (connection: Connection, wallet: Wallet, config?: MintConfig) => Promise<[PublicKey, PublicKey]>;
export declare type MintConfig = {
    target?: PublicKey;
    amount?: number;
    decimals?: number;
};
/**
 * Transaction for creating a mint
 * @param connection
 * @param mintId
 * @param authority
 * @param config
 * @returns
 */
export declare const createMintTx: (connection: Connection, mintId: PublicKey, authority: PublicKey, config?: MintConfig) => Promise<[Transaction, PublicKey]>;
/**
 * Instructions for creating a mint
 * @param connection
 * @param mintId
 * @param authority
 * @param config
 * @returns
 */
export declare const createMintIxs: (connection: Connection, mintId: PublicKey, authority: PublicKey, config?: MintConfig) => Promise<[TransactionInstruction[], PublicKey]>;
//# sourceMappingURL=mints.d.ts.map