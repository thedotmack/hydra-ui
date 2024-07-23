import type { SendTransactionOptions, WalletName } from '@solana/wallet-adapter-base';
import { BaseMessageSignerWalletAdapter, WalletReadyState } from '@solana/wallet-adapter-base';
import type { Connection, Transaction, TransactionSignature, TransactionVersion, VersionedTransaction } from '@solana/web3.js';
import { PublicKey } from '@solana/web3.js';
export interface PhantomWalletAdapterConfig {
}
export declare const PhantomWalletName: WalletName<"Phantom">;
export declare class PhantomWalletAdapter extends BaseMessageSignerWalletAdapter {
    name: WalletName<"Phantom">;
    url: string;
    icon: string;
    supportedTransactionVersions: ReadonlySet<TransactionVersion>;
    private _connecting;
    private _wallet;
    private _publicKey;
    private _readyState;
    constructor(config?: PhantomWalletAdapterConfig);
    get publicKey(): PublicKey | null;
    get connecting(): boolean;
    get readyState(): WalletReadyState;
    autoConnect(): Promise<void>;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    sendTransaction<T extends Transaction | VersionedTransaction>(transaction: T, connection: Connection, options?: SendTransactionOptions): Promise<TransactionSignature>;
    signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T>;
    signAllTransactions<T extends Transaction | VersionedTransaction>(transactions: T[]): Promise<T[]>;
    signMessage(message: Uint8Array): Promise<Uint8Array>;
    private _disconnected;
    private _accountChanged;
}
//# sourceMappingURL=adapter.d.ts.map