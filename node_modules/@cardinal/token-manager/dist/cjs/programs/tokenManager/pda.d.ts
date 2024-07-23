import { PublicKey } from "@solana/web3.js";
/**
 * Finds the token manager address for a given mint
 * @returns
 */
export declare const tryTokenManagerAddressFromMint: (mint: PublicKey) => PublicKey | null;
/**
 * Finds the token manager address for a given mint
 * @returns
 */
export declare const tokenManagerAddressFromMint: (mint: PublicKey) => PublicKey;
/**
 * Finds the token manager address for a given mint and mint counter
 * @returns
 */
export declare const findTokenManagerAddress: (mint: PublicKey) => PublicKey;
/**
 * Finds the claim receipt id.
 * @returns
 */
export declare const findClaimReceiptId: (tokenManagerId: PublicKey, recipientKey: PublicKey) => PublicKey;
/**
 * Finds the transfer receipt id.
 * @returns
 */
export declare const findTransferReceiptId: (tokenManagerId: PublicKey) => PublicKey;
/**
 * Finds the mint manager id.
 * @returns
 */
export declare const findMintManagerId: (mintId: PublicKey) => PublicKey;
/**
 * Finds the mint counter id.
 * @returns
 */
export declare const findMintCounterId: (mintId: PublicKey) => PublicKey;
/**
 * Finds the receipt mint manager id.
 * @returns
 */
export declare const findReceiptMintManagerId: () => PublicKey;
//# sourceMappingURL=pda.d.ts.map