import type { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import type { AccountMeta, Connection, Transaction } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
export declare const withRemainingAccountsForPayment: (transaction: Transaction, connection: Connection, wallet: Wallet, mint: PublicKey, paymentMint: PublicKey, issuerId: PublicKey, paymentManagerId: PublicKey, buySideTokenAccountId?: PublicKey, options?: {
    payer?: PublicKey;
    receiptMint?: PublicKey | null;
}) => Promise<[PublicKey, PublicKey, AccountMeta[]]>;
export declare const withRemainingAccountsForHandlePaymentWithRoyalties: (transaction: Transaction, connection: Connection, wallet: Wallet, mint: PublicKey, paymentMint: PublicKey, buySideTokenAccountId?: PublicKey, excludeCreators?: string[]) => Promise<AccountMeta[]>;
//# sourceMappingURL=utils.d.ts.map