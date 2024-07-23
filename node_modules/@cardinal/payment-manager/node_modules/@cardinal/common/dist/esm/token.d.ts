import type { PublicKey } from "@solana/web3.js";
/**
 * Utility function to get associated token address
 * @param mint
 * @param owner
 * @param allowOwnerOffCurve
 * @returns
 */
export declare function findAta(mint: PublicKey, owner: PublicKey, allowOwnerOffCurve?: boolean): Promise<PublicKey>;
//# sourceMappingURL=token.d.ts.map