import { BN } from "@coral-xyz/anchor";
import type { Connection, PublicKey } from "@solana/web3.js";
import type { RewardDistributor, RewardEntry, StakeEntry } from "./constants";
/**
 * Get pending rewards of mintIds for a given reward distributor
 * @param connection
 * @param wallet
 * @param mintIds
 * @param rewardDistributor
 * @returns
 */
export declare const getPendingRewardsForPool: (connection: Connection, wallet: PublicKey, mintIds: PublicKey[], rewardDistributor: RewardDistributor, UTCNow: number) => Promise<{
    rewardMap: {
        [mintId: string]: {
            claimableRewards: BN;
            nextRewardsIn: BN;
        };
    };
    claimableRewards: BN;
}>;
/**
 * Get the map of rewards for stakeEntry to rewards and next reward time
 * Also return the total claimable rewards from this map
 * @param stakeEntries
 * @param rewardEntries
 * @param rewardDistributor
 * @param remainingRewardAmount
 * @returns
 */
export declare const getRewardMap: (stakeEntries: StakeEntry[], rewardEntries: RewardEntry[], rewardDistributor: RewardDistributor, remainingRewardAmount: BN, UTCNow: number) => {
    rewardMap: {
        [stakeEntryId: string]: {
            claimableRewards: BN;
            nextRewardsIn: BN;
        };
    };
    claimableRewards: BN;
};
/**
 * Calculate claimable rewards and next reward time for a give mint and reward and stake entry
 * @param rewardDistributor
 * @param stakeEntry
 * @param rewardEntry
 * @param remainingRewardAmount
 * @param UTCNow
 * @returns
 */
export declare const calculatePendingRewards: (rewardDistributor: RewardDistributor, stakeEntry: StakeEntry, rewardEntry: RewardEntry | undefined, remainingRewardAmount: BN, UTCNow: number) => [BN, BN];
//# sourceMappingURL=rewardDistribution.d.ts.map