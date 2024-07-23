import { Cluster, PublicKey, SendOptions, Transaction } from '@solana/web3.js';
export interface SalmonWindow extends Window {
    salmon?: SalmonWallet;
}
export interface SalmonWallet {
    publicKey: PublicKey | null;
    isConnected: boolean;
    connect(options?: {
        onlyIfTrusted?: boolean;
    }): Promise<{
        publicKey: PublicKey;
    }>;
    disconnect(): Promise<void>;
    signAndSendTransaction(transaction: Transaction, options?: SendOptions): Promise<{
        signature: string;
        publicKey: PublicKey;
    }>;
    signTransaction(transaction: Transaction, network: string): Promise<Transaction>;
    signAllTransactions(transactions: Transaction[], network: string): Promise<Transaction[]>;
    signMessage(message: Uint8Array): Promise<{
        signature: Uint8Array;
    }>;
}
export interface SalmonConfig {
    network?: Cluster;
    provider?: string | SalmonWallet;
}
export declare type PromiseCallback = (...args: unknown[]) => unknown;
