"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRewardEntries = exports.getRewardEntriesForRewardDistributor = exports.getRewardDistributors = exports.getRewardDistributor = exports.getRewardEntries = exports.getRewardEntry = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const _1 = require(".");
const constants_1 = require("./constants");
const getRewardEntry = async (connection, rewardEntryId, commitment) => {
    const program = (0, constants_1.rewardDistributorProgram)(connection, undefined, {
        commitment,
    });
    const parsed = (await program.account.rewardEntry.fetch(rewardEntryId));
    return {
        parsed,
        pubkey: rewardEntryId,
    };
};
exports.getRewardEntry = getRewardEntry;
const getRewardEntries = async (connection, rewardEntryIds, commitment) => {
    const program = (0, constants_1.rewardDistributorProgram)(connection, undefined, {
        commitment,
    });
    const rewardEntries = (await program.account.rewardEntry.fetchMultiple(rewardEntryIds));
    return rewardEntries.map((entry, i) => ({
        parsed: entry,
        pubkey: rewardEntryIds[i],
    }));
};
exports.getRewardEntries = getRewardEntries;
const getRewardDistributor = async (connection, rewardDistributorId, commitment) => {
    const program = (0, constants_1.rewardDistributorProgram)(connection, undefined, {
        commitment,
    });
    const parsed = (await program.account.rewardDistributor.fetch(rewardDistributorId));
    return {
        parsed,
        pubkey: rewardDistributorId,
    };
};
exports.getRewardDistributor = getRewardDistributor;
const getRewardDistributors = async (connection, rewardDistributorIds, commitment) => {
    const program = (0, constants_1.rewardDistributorProgram)(connection, undefined, {
        commitment,
    });
    const rewardDistributors = (await program.account.rewardDistributor.fetchMultiple(rewardDistributorIds));
    return rewardDistributors.map((distributor, i) => ({
        parsed: distributor,
        pubkey: rewardDistributorIds[i],
    }));
};
exports.getRewardDistributors = getRewardDistributors;
const getRewardEntriesForRewardDistributor = async (connection, rewardDistributorId, commitment) => {
    const programAccounts = await connection.getProgramAccounts(_1.REWARD_DISTRIBUTOR_ADDRESS, {
        filters: [
            {
                memcmp: {
                    offset: 0,
                    bytes: anchor_1.utils.bytes.bs58.encode(anchor_1.BorshAccountsCoder.accountDiscriminator("rewardEntry")),
                },
            },
            {
                memcmp: {
                    offset: 41,
                    bytes: rewardDistributorId.toBase58(),
                },
            },
        ],
        commitment,
    });
    const rewardEntryDatas = [];
    const coder = new anchor_1.BorshAccountsCoder(_1.REWARD_DISTRIBUTOR_IDL);
    programAccounts.forEach((account) => {
        try {
            const rewardEntryData = coder.decode("rewardEntry", account.account.data);
            if (rewardEntryData) {
                rewardEntryDatas.push({
                    ...account,
                    parsed: rewardEntryData,
                });
            }
            // eslint-disable-next-line no-empty
        }
        catch (e) { }
    });
    return rewardEntryDatas.sort((a, b) => a.pubkey.toBase58().localeCompare(b.pubkey.toBase58()));
};
exports.getRewardEntriesForRewardDistributor = getRewardEntriesForRewardDistributor;
const getAllRewardEntries = async (connection, commitment) => {
    const programAccounts = await connection.getProgramAccounts(_1.REWARD_DISTRIBUTOR_ADDRESS, {
        filters: [
            {
                memcmp: {
                    offset: 0,
                    bytes: anchor_1.utils.bytes.bs58.encode(anchor_1.BorshAccountsCoder.accountDiscriminator("rewardEntry")),
                },
            },
        ],
        commitment,
    });
    const rewardEntryDatas = [];
    const coder = new anchor_1.BorshAccountsCoder(_1.REWARD_DISTRIBUTOR_IDL);
    programAccounts.forEach((account) => {
        try {
            const rewardEntryData = coder.decode("rewardEntry", account.account.data);
            if (rewardEntryData) {
                rewardEntryDatas.push({
                    ...account,
                    parsed: rewardEntryData,
                });
            }
            // eslint-disable-next-line no-empty
        }
        catch (e) { }
    });
    return rewardEntryDatas.sort((a, b) => a.pubkey.toBase58().localeCompare(b.pubkey.toBase58()));
};
exports.getAllRewardEntries = getAllRewardEntries;
//# sourceMappingURL=accounts.js.map