import WalletAdapter from './base';
import { Cluster, Transaction } from '@solana/web3.js';
import { SalmonWallet } from '../types';
export default class ExtensionAdapter extends WalletAdapter {
    private _provider;
    private _network;
    get publicKey(): import("@solana/web3.js").PublicKey | null;
    get connected(): boolean;
    constructor(provider: SalmonWallet, network: Cluster);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    signTransaction(transaction: Transaction): Promise<Transaction>;
    signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
    signMessage(data: Uint8Array): Promise<Uint8Array>;
}
