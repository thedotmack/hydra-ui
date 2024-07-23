"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePendingRewards = exports.getRewardMap = exports.getPendingRewardsForPool = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const spl_token_1 = require("@solana/spl-token");
const accounts_1 = require("./accounts");
const pda_1 = require("./pda");
const utils_1 = require("./utils");
/**
 * Get pending rewards of mintIds for a given reward distributor
 * @param connection
 * @param wallet
 * @param mintIds
 * @param rewardDistributor
 * @returns
 */
const getPendingRewardsForPool = async (connection, wallet, mintIds, rewardDistributor, UTCNow) => {
    const rewardDistributorTokenAccountId = (0, spl_token_1.getAssociatedTokenAddressSync)(rewardDistributor.parsed.rewardMint, rewardDistributor.pubkey, true);
    const rewardDistributorTokenAccountInfo = await (0, spl_token_1.getAccount)(connection, rewardDistributorTokenAccountId);
    const stakeEntryIds = await Promise.all(mintIds.map(async (mintId) => await (0, utils_1.findStakeEntryIdFromMint)(connection, rewardDistributor.parsed.stakePool, mintId, wallet)));
    const rewardEntryIds = stakeEntryIds.map((stakeEntryId) => (0, pda_1.findRewardEntryId)(rewardDistributor.pubkey, stakeEntryId));
    const accountDataById = await (0, accounts_1.fetchIdlAccountDataById)(connection, [
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
    return (0, exports.getRewardMap)(stakeEntries, rewardEntries, rewardDistributor, new anchor_1.BN(rewardDistributorTokenAccountInfo.amount.toString()), UTCNow);
};
exports.getPendingRewardsForPool = getPendingRewardsForPool;
/**
 * Get the map of rewards for stakeEntry to rewards and next reward time
 * Also return the total claimable rewards from this map
 * @param stakeEntries
 * @param rewardEntries
 * @param rewardDistributor
 * @param remainingRewardAmount
 * @returns
 */
const getRewardMap = (stakeEntries, rewardEntries, rewardDistributor, remainingRewardAmount, UTCNow) => {
    const rewardMap = {};
    for (let i = 0; i < stakeEntries.length; i++) {
        const stakeEntry = stakeEntries[i];
        const rewardEntry = rewardEntries.find((rewardEntry) => { var _a; return (_a = rewardEntry === null || rewardEntry === void 0 ? void 0 : rewardEntry.parsed) === null || _a === void 0 ? void 0 : _a.stakeEntry.equals(stakeEntry === null || stakeEntry === void 0 ? void 0 : stakeEntry.pubkey); });
        if (stakeEntry) {
            const [claimableRewards, nextRewardsIn] = (0, exports.calculatePendingRewards)(rewardDistributor, stakeEntry, rewardEntry, remainingRewardAmount, UTCNow);
            rewardMap[stakeEntry.pubkey.toString()] = {
                claimableRewards,
                nextRewardsIn,
            };
        }
    }
    // Compute too many rewards
    let claimableRewards = Object.values(rewardMap).reduce((acc, { claimableRewards }) => acc.add(claimableRewards), new anchor_1.BN(0));
    if (claimableRewards.gt(remainingRewardAmount)) {
        claimableRewards = remainingRewardAmount;
    }
    return { rewardMap, claimableRewards };
};
exports.getRewardMap = getRewardMap;
/**
 * Calculate claimable rewards and next reward time for a give mint and reward and stake entry
 * @param rewardDistributor
 * @param stakeEntry
 * @param rewardEntry
 * @param remainingRewardAmount
 * @param UTCNow
 * @returns
 */
const calculatePendingRewards = (rewardDistributor, stakeEntry, rewardEntry, remainingRewardAmount, UTCNow) => {
    var _a;
    if (!stakeEntry ||
        stakeEntry.parsed.pool.toString() !==
            rewardDistributor.parsed.stakePool.toString()) {
        return [new anchor_1.BN(0), new anchor_1.BN(0)];
    }
    const rewardSecondsReceived = (rewardEntry === null || rewardEntry === void 0 ? void 0 : rewardEntry.parsed.rewardSecondsReceived) || new anchor_1.BN(0);
    const multiplier = ((_a = rewardEntry === null || rewardEntry === void 0 ? void 0 : rewardEntry.parsed) === null || _a === void 0 ? void 0 : _a.multiplier) ||
        rewardDistributor.parsed.defaultMultiplier;
    const currentSeconds = stakeEntry.parsed.cooldownStartSeconds
        ? new anchor_1.BN(stakeEntry.parsed.cooldownStartSeconds)
        : new anchor_1.BN(UTCNow);
    let rewardSeconds = currentSeconds
        .sub(new anchor_1.BN(stakeEntry.parsed.lastStakedAt))
        .mul(new anchor_1.BN(stakeEntry.parsed.amount))
        .add(new anchor_1.BN(stakeEntry.parsed.totalStakeSeconds));
    if (rewardDistributor.parsed.maxRewardSecondsReceived) {
        rewardSeconds = anchor_1.BN.min(rewardSeconds, new anchor_1.BN(rewardDistributor.parsed.maxRewardSecondsReceived));
    }
    let rewardAmountToReceive = rewardSeconds
        .sub(new anchor_1.BN(rewardSecondsReceived))
        .div(new anchor_1.BN(rewardDistributor.parsed.rewardDurationSeconds))
        .mul(new anchor_1.BN(rewardDistributor.parsed.rewardAmount))
        .mul(new anchor_1.BN(multiplier))
        .div(new anchor_1.BN(10).pow(new anchor_1.BN(rewardDistributor.parsed.multiplierDecimals)));
    if (rewardAmountToReceive.gt(remainingRewardAmount)) {
        rewardAmountToReceive = remainingRewardAmount;
    }
    const nextRewardsIn = new anchor_1.BN(rewardDistributor.parsed.rewardDurationSeconds).sub(currentSeconds
        .sub(new anchor_1.BN(stakeEntry.parsed.lastStakedAt))
        .add(new anchor_1.BN(stakeEntry.parsed.totalStakeSeconds))
        .mod(new anchor_1.BN(rewardDistributor.parsed.rewardDurationSeconds)));
    return [rewardAmountToReceive, nextRewardsIn];
};
exports.calculatePendingRewards = calculatePendingRewards;
//# sourceMappingURL=rewardDistribution.js.map