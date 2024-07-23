import type { ParsedIdlAccountData } from "@cardinal/common";
import { Program } from "@project-serum/anchor";
import type { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import type { ConfirmOptions, Connection } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import * as TOKEN_MANAGER_TYPES from "../../idl/cardinal_token_manager";
export declare const TOKEN_MANAGER_ADDRESS: PublicKey;
export declare const MINT_COUNTER_SEED = "mint-counter";
export declare const MINT_MANAGER_SEED = "mint-manager";
export declare const TRANSFER_RECEIPT_SEED = "transfer-receipt";
export declare const CLAIM_RECEIPT_SEED = "claim-receipt";
export declare const TOKEN_MANAGER_SEED = "token-manager";
export declare const RECEIPT_MINT_MANAGER_SEED = "receipt-mint-manager";
export declare const TOKEN_MANAGER_IDL: TOKEN_MANAGER_TYPES.CardinalTokenManager;
export type TOKEN_MANAGER_PROGRAM = TOKEN_MANAGER_TYPES.CardinalTokenManager;
export type TokenManagerData = ParsedIdlAccountData<"tokenManager", TOKEN_MANAGER_PROGRAM>;
export type MintManagerData = ParsedIdlAccountData<"mintManager", TOKEN_MANAGER_PROGRAM>;
export type MintCounterData = ParsedIdlAccountData<"mintCounter", TOKEN_MANAGER_PROGRAM>;
export type TransferReceiptData = ParsedIdlAccountData<"transferReceipt", TOKEN_MANAGER_PROGRAM>;
export declare enum TokenManagerKind {
    Managed = 1,
    Unmanaged = 2,
    Edition = 3,
    Permissioned = 4,
    Programmable = 5
}
export declare enum InvalidationType {
    Return = 1,
    Invalidate = 2,
    Release = 3,
    Reissue = 4,
    Vest = 5
}
export declare enum TokenManagerState {
    Initialized = 0,
    Issued = 1,
    Claimed = 2,
    Invalidated = 3
}
export declare const CRANK_KEY: PublicKey;
export declare const tokenManagerProgram: (connection: Connection, wallet?: Wallet, confirmOptions?: ConfirmOptions) => Program<TOKEN_MANAGER_TYPES.CardinalTokenManager>;
//# sourceMappingURL=constants.d.ts.map