import { PublicKey } from "@solana/web3.js";
/**
 * Finds the address of the transfer authority.
 * @returns
 */
export declare const findTransferAuthorityAddress: (name: string) => PublicKey;
/**
 * Finds the address of the marketplace.
 * @returns
 */
export declare const findMarketplaceAddress: (name: string) => PublicKey;
/**
 * Finds the address of the listing.
 * @returns
 */
export declare const findListingAddress: (mintId: PublicKey) => PublicKey;
/**
 * Finds the address of the transfer.
 * @returns
 */
export declare const findTransferAddress: (mintId: PublicKey) => PublicKey;
//# sourceMappingURL=pda.d.ts.map