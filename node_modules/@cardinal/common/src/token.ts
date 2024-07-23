import { getAssociatedTokenAddress } from "@solana/spl-token";
import type { PublicKey } from "@solana/web3.js";

/**
 * Utility function to get associated token address
 * @param mint
 * @param owner
 * @param allowOwnerOffCurve
 * @returns
 */
export async function findAta(
  mint: PublicKey,
  owner: PublicKey,
  allowOwnerOffCurve?: boolean
): Promise<PublicKey> {
  return getAssociatedTokenAddress(mint, owner, allowOwnerOffCurve);
}
