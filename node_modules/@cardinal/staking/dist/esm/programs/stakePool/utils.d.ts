import type { ParsedIdlAccountData } from "@cardinal/common";
import { BN } from "@coral-xyz/anchor";
import type { Wallet } from "@coral-xyz/anchor/dist/cjs/provider";
import type { AccountMeta, Connection, PublicKey, Transaction } from "@solana/web3.js";
import type { CardinalStakePool } from "../../idl/cardinal_stake_pool";
export declare const remainingAccountsForInitStakeEntry: (stakePoolId: PublicKey, originalMintId: PublicKey) => AccountMeta[];
export declare const withRemainingAccountsForUnstake: (transaction: Transaction, connection: Connection, wallet: Wallet, stakeEntryId: PublicKey, receiptMint: PublicKey | null | undefined) => Promise<AccountMeta[]>;
/**
 * Convenience method to find the stake entry id from a mint
 * NOTE: This will lookup the mint on-chain to get the supply
 * @returns
 */
export declare const findStakeEntryIdFromMint: (connection: Connection, wallet: PublicKey, stakePoolId: PublicKey, originalMintId: PublicKey, isFungible?: boolean) => Promise<PublicKey>;
export declare const getTotalStakeSeconds: (connection: Connection, stakeEntryId: PublicKey) => Promise<BN>;
export declare const getActiveStakeSeconds: (connection: Connection, stakeEntryId: PublicKey) => Promise<BN>;
export declare const getUnclaimedRewards: (connection: Connection, stakePoolId: PublicKey) => Promise<BN>;
export declare const getClaimedRewards: (connection: Connection, stakePoolId: PublicKey) => Promise<BN>;
export declare const shouldReturnReceipt: (stakePoolData: ParsedIdlAccountData<"stakePool", CardinalStakePool>, stakeEntryData: ParsedIdlAccountData<"stakeEntry", CardinalStakePool>) => boolean;
//# sourceMappingURL=utils.d.ts.map