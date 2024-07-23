import WalletAdapter from './base';
import { Cluster, Transaction } from '@solana/web3.js';
import { SalmonWallet } from '../types';

export default class ExtensionAdapter extends WalletAdapter {
  private _provider: SalmonWallet;
  private _network: Cluster;

  get publicKey () {
    return this._provider!.publicKey;
  }

  get connected () {
    return this._provider!.isConnected;
  }

  constructor (provider: SalmonWallet, network: Cluster) {
    super();
    this._provider = provider;
    this._network = network;
  }

  async connect () {
    try {
      if (this.connected) {
        throw new Error('Wallet already connected');
      }

      await this._provider!.connect();

      this.emit('connect');
    } catch (e) {
      this.emit('disconnect');
      throw e;
    }
  }

  async disconnect () {
    if (!this.connected) {
      throw new Error('Wallet not connected');
    }

    await this._provider!.disconnect();

    this.emit('disconnect');
  }

  async signTransaction (transaction: Transaction): Promise<Transaction> {
    if (!this.connected) {
      throw new Error('Wallet not connected');
    }

    return await this._provider!.signTransaction(transaction, this._network);
  }

  async signAllTransactions (transactions: Transaction[]): Promise<Transaction[]> {
    if (!this.connected) {
      throw new Error('Wallet not connected');
    }

    return await this._provider!.signAllTransactions(transactions, this._network);
  }

  async signMessage (data: Uint8Array): Promise<Uint8Array> {
    if (!this.connected) {
      throw new Error('Wallet not connected');
    }

    if (!(data instanceof Uint8Array)) {
      throw new Error('Data must be an instance of Uint8Array');
    }

    const { signature } = await this._provider!.signMessage(data);
    
    return signature;
  }
}