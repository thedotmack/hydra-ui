import type { WalletName } from '@solana/wallet-adapter-base';
import { BaseSignerWalletAdapter, WalletReadyState } from '@solana/wallet-adapter-base';
import type { Transaction, TransactionVersion, VersionedTransaction } from '@solana/web3.js';
export declare const UnsafeBurnerWalletName: WalletName<"Burner Wallet">;
/**
 * This burner wallet adapter is unsafe to use and is only included to provide an easy way for applications to test
 * Wallet Adapter without using a third-party wallet.
 */
export declare class UnsafeBurnerWalletAdapter extends BaseSignerWalletAdapter {
    name: WalletName<"Burner Wallet">;
    url: string;
    icon: string;
    supportedTransactionVersions: ReadonlySet<TransactionVersion>;
    /**
     * Storing a keypair locally like this is not safe because any application using this adapter could retrieve the
     * secret key, and because the keypair will be lost any time the wallet is disconnected or the window is refreshed.
     */
    private _keypair;
    constructor();
    get connecting(): boolean;
    get publicKey(): import("@solana/web3.js").PublicKey | null;
    get readyState(): WalletReadyState;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T>;
}
//# sourceMappingURL=adapter.d.ts.map