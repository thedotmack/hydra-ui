import type { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import type { Connection } from "@solana/web3.js";
import { PublicKey, Transaction } from "@solana/web3.js";
import type BN from "bn.js";
export declare const withInit: (transaction: Transaction, connection: Connection, wallet: Wallet, params: {
    paymentManagerName: string;
    feeCollectorId: PublicKey;
    makerFeeBasisPoints: number;
    takerFeeBasisPoints: number;
    includeSellerFeeBasisPoints: boolean;
    royaltyFeeShare?: BN;
    payer?: PublicKey;
    authority?: PublicKey;
}) => Promise<[Transaction, PublicKey]>;
export declare const withManagePayment: (transaction: Transaction, connection: Connection, wallet: Wallet, params: {
    paymentManagerName: string;
    paymentAmount: BN;
    payerTokenAccountId: PublicKey;
    feeCollectorTokenAccountId: PublicKey;
    paymentTokenAccountId: PublicKey;
}) => Promise<Transaction>;
export declare const withHandlePaymentWithRoyalties: (transaction: Transaction, connection: Connection, wallet: Wallet, params: {
    paymentManagerName: string;
    paymentAmount: BN;
    mintId: PublicKey;
    paymentMintId: PublicKey;
    payerTokenAccountId: PublicKey;
    feeCollectorTokenAccountId: PublicKey;
    paymentTokenAccountId: PublicKey;
    buySideTokenAccountId?: PublicKey;
    excludeCretors?: string[];
}) => Promise<Transaction>;
export declare const withHandleNativePaymentWithRoyalties: (transaction: Transaction, connection: Connection, wallet: Wallet, params: {
    paymentManagerName: string;
    paymentAmount: BN;
    mintId: PublicKey;
    feeCollectorId: PublicKey;
    paymentTargetId: PublicKey;
    buySideTokenAccountId?: PublicKey;
    excludeCretors?: string[];
}) => Promise<Transaction>;
export declare const withClose: (transaction: Transaction, connection: Connection, wallet: Wallet, params: {
    paymentManagerName: string;
    collectorId?: PublicKey;
}) => Promise<Transaction>;
export declare const withUpdate: (transaction: Transaction, connection: Connection, wallet: Wallet, params: {
    paymentManagerName: string;
    authority?: PublicKey;
    feeCollectorId?: PublicKey;
    makerFeeBasisPoints?: number;
    takerFeeBasisPoints?: number;
    royaltyFeeShare?: BN;
}) => Promise<Transaction>;
//# sourceMappingURL=transaction.d.ts.map