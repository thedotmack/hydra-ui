import type { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import type { PublicKey, Transaction } from "@solana/web3.js";

/**
 * A utility for creating a wallet interface given a publicKey. This can be used when a wallet parameter is required but it will not need to sign
 * @param publicKey
 * @returns A wallet interface with empty sign methods
 */
export const emptyWallet = (publicKey: PublicKey): Wallet => ({
  signTransaction: async (tx: Transaction) => new Promise(() => tx),
  signAllTransactions: async (txs: Transaction[]) => new Promise(() => txs),
  publicKey: publicKey,
});
