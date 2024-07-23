import { Transaction, PublicKey } from '@solana/web3.js';
export declare class FractalWalletAdapterImpl {
    private readonly popupManager;
    private publicKey;
    private connecting;
    getPublicKey(): PublicKey | null;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    signTransaction<T extends Transaction>(transaction: T): Promise<T>;
    signAllTransactions<T extends Transaction>(transactions: T[]): Promise<T[]>;
    signMessage(encodedMessage: Uint8Array): Promise<Uint8Array>;
    private signTransactions;
    private checkWalletReadiness;
}
//# sourceMappingURL=fractal-wallet-adapter-impl.d.ts.map