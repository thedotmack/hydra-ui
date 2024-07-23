import type { AccountData } from "@cardinal/common";
import { BN } from "@project-serum/anchor";
import type { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import type { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { Keypair } from "@solana/web3.js";
import type { ClaimApproverParams } from "./programs/claimApprover";
import type { TimeInvalidationParams } from "./programs/timeInvalidator";
import type { TokenManagerData } from "./programs/tokenManager";
import { InvalidationType, TokenManagerKind } from "./programs/tokenManager";
import type { UseInvalidationParams } from "./programs/useInvalidator";
export type IssueParameters = {
    claimPayment?: ClaimApproverParams;
    timeInvalidation?: TimeInvalidationParams;
    useInvalidation?: UseInvalidationParams;
    transferAuthorityInfo?: {
        transferAuthorityName: string;
        creator?: PublicKey;
    };
    mint: PublicKey;
    amount?: BN;
    issuerTokenAccountId: PublicKey;
    visibility?: "private" | "public" | "permissioned";
    permissionedClaimApprover?: PublicKey;
    kind?: TokenManagerKind;
    invalidationType?: InvalidationType;
    receiptOptions?: {
        receiptMintKeypair: Keypair;
    };
    rulesetId?: PublicKey;
    customInvalidators?: PublicKey[];
};
/**
 * Main method for issuing any managed token
 * Allows for optional payment, optional usages or expiration and includes a otp for private links
 * @param connection
 * @param wallet
 * @param parameters
 * @returns Transaction, public key for the created token manager and a otp if necessary for private links
 */
export declare const withIssueToken: (transaction: Transaction, connection: Connection, wallet: Wallet, { claimPayment, timeInvalidation, useInvalidation, mint, issuerTokenAccountId, amount, transferAuthorityInfo, kind, invalidationType, visibility, permissionedClaimApprover, receiptOptions, customInvalidators, rulesetId, }: IssueParameters, payer?: PublicKey) => Promise<[Transaction, PublicKey, Keypair | undefined]>;
/**
 * Add claim instructions to a transaction
 * @param transaction
 * @param connection
 * @param wallet
 * @param tokenManagerId
 * @param otpKeypair
 * @returns Transaction with relevent claim instructions added
 */
export declare const withClaimToken: (transaction: Transaction, connection: Connection, wallet: Wallet, tokenManagerId: PublicKey, additionalOptions?: {
    payer?: PublicKey;
}, buySideTokenAccountId?: PublicKey) => Promise<Transaction>;
export declare const withUnissueToken: (transaction: Transaction, connection: Connection, wallet: Wallet, mintId: PublicKey) => Promise<Transaction>;
export declare const withInvalidate: (transaction: Transaction, connection: Connection, wallet: Wallet, mintId: PublicKey, UTCNow?: number) => Promise<Transaction>;
export declare const withReturn: (transaction: Transaction, connection: Connection, wallet: Wallet, tokenManagerData: AccountData<TokenManagerData>) => Promise<Transaction>;
export declare const withUse: (transaction: Transaction, connection: Connection, wallet: Wallet, mintId: PublicKey, usages: number, collector?: PublicKey) => Promise<Transaction>;
export declare const withExtendExpiration: (transaction: Transaction, connection: Connection, wallet: Wallet, tokenManagerId: PublicKey, secondsToAdd: number, options?: {
    payer?: PublicKey;
}, buySideTokenAccountId?: PublicKey) => Promise<Transaction>;
export declare const withExtendUsages: (transaction: Transaction, connection: Connection, wallet: Wallet, tokenManagerId: PublicKey, usagesToAdd: number, options?: {
    payer?: PublicKey;
}, buySideTokenAccountId?: PublicKey) => Promise<Transaction>;
export declare const withResetExpiration: (transaction: Transaction, connection: Connection, wallet: Wallet, tokenManagerId: PublicKey) => Promise<Transaction>;
export declare const withUpdateMaxExpiration: (transaction: Transaction, connection: Connection, wallet: Wallet, tokenManagerId: PublicKey, newMaxExpiration: BN) => Promise<Transaction>;
export declare const withTransfer: (transaction: Transaction, connection: Connection, wallet: Wallet, mintId: PublicKey, recipient?: PublicKey) => Promise<Transaction>;
export declare const withDelegate: (transaction: Transaction, connection: Connection, wallet: Wallet, mintId: PublicKey, recipient?: PublicKey) => Promise<Transaction>;
export declare const withUndelegate: (transaction: Transaction, connection: Connection, wallet: Wallet, mintId: PublicKey, recipient?: PublicKey) => Promise<Transaction>;
export declare const withSend: (transaction: Transaction, connection: Connection, wallet: Wallet, mintId: PublicKey, senderTokenAccountId: PublicKey, target: PublicKey) => Promise<Transaction>;
export declare const withMigrate: (transaction: Transaction, connection: Connection, wallet: Wallet, mintId: PublicKey, rulesetName: string, holderTokenAccountId: PublicKey, authority: PublicKey) => Promise<Transaction>;
export declare const withReplaceInvalidator: (transaction: Transaction, connection: Connection, wallet: Wallet, tokenManagerId: PublicKey, newInvalidator: PublicKey) => Promise<Transaction>;
//# sourceMappingURL=transaction.d.ts.map