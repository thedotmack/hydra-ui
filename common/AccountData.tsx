import { PublicKey } from '@solana/web3.js'

/**
 * Generic AccountData type
 * @param pubkey account public key
 * @param parsed parsed data from account
 */
export type AccountData<T> = {
    pubkey: PublicKey;
    parsed: T;
  };