import { PublicKey } from "@solana/web3.js";
export declare function shortPubKey(pubkey: PublicKey | string | null | undefined, startChars?: number, endChars?: number): string;
export declare function pubKeyUrl(pubkey: PublicKey | null | undefined, cluster: string): string;
export declare const tryPublicKey: (publicKeyString: string | string[] | undefined | null) => PublicKey | null;
export declare function transactionUrl(txid: string, cluster: string): string;
//# sourceMappingURL=publicKeys.d.ts.map