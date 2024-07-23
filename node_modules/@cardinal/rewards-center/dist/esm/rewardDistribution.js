import { BN } from "@coral-xyz/anchor";
import { getAccount, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { fetchIdlAccountDataById } from "./accounts";
import { findRewardEntryId } from "./pda";
import { findStakeEntryIdFromMint } from "./utils";
/**
 * Get pending rewards of mintIds for a given reward distributor
 * @param connection
 * @param wallet
 * @param mintIds
 * @param rewardDistributor
 * @returns
 */
export const getPendingRewardsForPool = async (connection, wallet, mintIds, rewardDistributor, UTCNow) => {
    const rewardDistributorTokenAccountId = getAssociatedTokenAddressSync(rewardDistributor.parsed.rewardMint, rewardDistributor.pubkey, true);
    const rewardDistributorTokenAccountInfo = await getAccount(connection, rewardDistributorTokenAccountId);
    const stakeEntryIds = await Promise.all(mintIds.map(async (mintId) => await findStakeEntryIdFromMint(connection, rewardDistributor.parsed.stakePool, mintId, wallet)));
    const rewardEntryIds = stakeEntryIds.map((stakeEntryId) => findRewardEntryId(rewardDistributor.pubkey, stakeEntryId));
    const accountDataById = await fetchIdlAccountDataById(connection, [
        ...stakeEntryIds,
        ...rewardEntryIds,
    ]);
    const [stakeEntries, rewardEntries] = Object.values(accountDataById).reduce((acc, account) => {
        if (account.type === "stakeEntry") {
            return [[...acc[0], account], acc[1]];
        }
        else if (account.type === "rewardEntry") {
            return [acc[0], [...acc[1], account]];
        }
        return acc;
    }, [[], []]);
    return getRewardMap(stakeEntries, rewardEntries, rewardDistributor, new BN(rewardDistributorTokenAccountInfo.amount.toString()), UTCNow);
};
/**
 * Get the map of rewards for stakeEntry to rewards and next reward time
 * Also return the total claimable rewards from this map
 * @param stakeEntries
 * @param rewardEntries
 * @param rewardDistributor
 * @param remainingRewardAmount
 * @returns
 */
export const getRewardMap = (stakeEntries, rewardEntries, rewardDistributor, remainingRewardAmount, UTCNow) => {
    const rewardMap = {};
    for (let i = 0; i < stakeEntries.length; i++) {
        const stakeEntry = stakeEntries[i];
        const rewardEntry = rewardEntries.find((rewardEntry) => { var _a; return (_a = rewardEntry === null || rewardEntry === void 0 ? void 0 : rewardEntry.parsed) === null || _a === void 0 ? void 0 : _a.stakeEntry.equals(stakeEntry === null || stakeEntry === void 0 ? void 0 : stakeEntry.pubkey); });
        if (stakeEntry) {
            const [claimableRewards, nextRewardsIn] = calculatePendingRewards(rewardDistributor, stakeEntry, rewardEntry, remainingRewardAmount, UTCNow);
            rewardMap[stakeEntry.pubkey.toString()] = {
                claimableRewards,
                nextRewardsIn,
            };
        }
    }
    // Compute too many rewards
    let claimableRewards = Object.values(rewardMap).reduce((acc, { claimableRewards }) => acc.add(claimableRewards), new BN(0));
    if (claimableRewards.gt(remainingRewardAmount)) {
        claimableRewards = remainingRewardAmount;
    }
    return { rewardMap, claimableRewards };
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
export const calculatePendingRewards = (rewardDistributor, stakeEntry, rewardEntry, remainingRewardAmount, UTCNow) => {
    var _a;
    if (!stakeEntry ||
        stakeEntry.parsed.pool.toString() !==
            rewardDistributor.parsed.stakePool.toString()) {
        return [new BN(0), new BN(0)];
    }
    const rewardSecondsReceived = (rewardEntry === null || rewardEntry === void 0 ? void 0 : rewardEntry.parsed.rewardSecondsReceived) || new BN(0);
    const multiplier = ((_a = rewardEntry === null || rewardEntry === void 0 ? void 0 : rewardEntry.parsed) === null || _a === void 0 ? void 0 : _a.multiplier) ||
        rewardDistributor.parsed.defaultMultiplier;
    const currentSeconds = stakeEntry.parsed.cooldownStartSeconds
        ? new BN(stakeEntry.parsed.cooldownStartSeconds)
        : new BN(UTCNow);
    let rewardSeconds = currentSeconds
        .sub(new BN(stakeEntry.parsed.lastStakedAt))
        .mul(new BN(stakeEntry.parsed.amount))
        .add(new BN(stakeEntry.parsed.totalStakeSeconds));
    if (rewardDistributor.parsed.maxRewardSecondsReceived) {
        rewardSeconds = BN.min(rewardSeconds, new BN(rewardDistributor.parsed.maxRewardSecondsReceived));
    }
    let rewardAmountToReceive = rewardSeconds
        .sub(new BN(rewardSecondsReceived))
        .div(new BN(rewardDistributor.parsed.rewardDurationSeconds))
        .mul(new BN(rewardDistributor.parsed.rewardAmount))
        .mul(new BN(multiplier))
        .div(new BN(10).pow(new BN(rewardDistributor.parsed.multiplierDecimals)));
    if (rewardAmountToReceive.gt(remainingRewardAmount)) {
        rewardAmountToReceive = remainingRewardAmount;
    }
    const nextRewardsIn = new BN(rewardDistributor.parsed.rewardDurationSeconds).sub(currentSeconds
        .sub(new BN(stakeEntry.parsed.lastStakedAt))
        .add(new BN(stakeEntry.parsed.totalStakeSeconds))
        .mod(new BN(rewardDistributor.parsed.rewardDurationSeconds)));
    return [rewardAmountToReceive, nextRewardsIn];
};
//# sourceMappingURL=rewardDistribution.js.map