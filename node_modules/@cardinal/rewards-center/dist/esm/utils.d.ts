import type { Connection } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
export declare const METADATA_PROGRAM_ID: PublicKey;
/**
 * Convenience method to find the stake entry id from a mint
 * NOTE: This will lookup the mint on-chain to get the supply
 * @returns
 */
export declare const findStakeEntryIdFromMint: (connection: Connection, stakePoolId: PublicKey, stakeMintId: PublicKey, user: PublicKey, isFungible?: boolean) => Promise<PublicKey>;
export declare const findMintMetadataId: (mintId: PublicKey) => PublicKey;
export declare const findMintEditionId: (mintId: PublicKey) => PublicKey;
//# sourceMappingURL=utils.d.ts.map