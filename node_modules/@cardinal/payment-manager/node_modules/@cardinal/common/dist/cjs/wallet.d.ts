import type { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import type { PublicKey } from "@solana/web3.js";
/**
 * A utility for creating a wallet interface given a publicKey. This can be used when a wallet parameter is required but it will not need to sign
 * @param publicKey
 * @returns A wallet interface with empty sign methods
 */
export declare const emptyWallet: (publicKey: PublicKey) => Wallet;
//# sourceMappingURL=wallet.d.ts.map