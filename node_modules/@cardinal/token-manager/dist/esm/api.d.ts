import type { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import type { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Transaction } from "@solana/web3.js";
import type { IssueParameters } from ".";
export declare const useTransaction: (connection: Connection, wallet: Wallet, mintId: PublicKey, usages: number, collector?: PublicKey) => Promise<Transaction>;
export declare const invalidate: (connection: Connection, wallet: Wallet, mintId: PublicKey) => Promise<Transaction>;
export declare const release: (connection: Connection, wallet: Wallet, mintId: PublicKey, transferAuthorityId: PublicKey, listerTokenAccountId: PublicKey) => Promise<Transaction>;
export declare const issueToken: (connection: Connection, wallet: Wallet, rentalParameters: IssueParameters) => Promise<[Transaction, PublicKey, Keypair | undefined]>;
export declare const unissueToken: (connection: Connection, wallet: Wallet, mintId: PublicKey) => Promise<Transaction>;
export declare const claimToken: (connection: Connection, wallet: Wallet, tokenManagerId: PublicKey, additionalOptions?: {
    payer?: PublicKey;
}) => Promise<Transaction>;
export declare const extendExpiration: (connection: Connection, wallet: Wallet, tokenManagerId: PublicKey, paymentAmount: number) => Promise<Transaction>;
export declare const extendUsages: (connection: Connection, wallet: Wallet, tokenManagerId: PublicKey, usagesToAdd: number) => Promise<Transaction>;
//# sourceMappingURL=api.d.ts.map