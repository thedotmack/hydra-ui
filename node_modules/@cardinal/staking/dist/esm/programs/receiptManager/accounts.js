import { tryGetAccount } from "@cardinal/common";
import { BorshAccountsCoder, utils } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { REWARD_DISTRIBUTOR_ADDRESS } from "../rewardDistributor";
import { RECEIPT_MANAGER_ADDRESS, RECEIPT_MANAGER_IDL, receiptManagerProgram, } from "./constants";
export const getReceiptManager = async (connection, receiptManagerId, commitment) => {
    const program = receiptManagerProgram(connection, undefined, { commitment });
    const parsed = (await program.account.receiptManager.fetch(receiptManagerId));
    return {
        parsed,
        pubkey: receiptManagerId,
    };
};
export const getAllreceiptManagers = async (connection, commitment) => getAllOfType(connection, "receiptManager", commitment);
export const getReceiptManagersForPool = async (connection, stakePoolId, commitment) => {
    const programAccounts = await connection.getProgramAccounts(REWARD_DISTRIBUTOR_ADDRESS, {
        filters: [
            {
                memcmp: {
                    offset: 0,
                    bytes: utils.bytes.bs58.encode(BorshAccountsCoder.accountDiscriminator("receiptManager")),
                },
            },
            {
                memcmp: {
                    offset: 9,
                    bytes: stakePoolId.toBase58(),
                },
            },
        ],
        commitment,
    });
    const ReceiptManagerDatas = [];
    const coder = new BorshAccountsCoder(RECEIPT_MANAGER_IDL);
    programAccounts.forEach((account) => {
        try {
            const ReceiptManagerData = coder.decode("receiptManager", account.account.data);
            if (ReceiptManagerData) {
                ReceiptManagerDatas.push({
                    ...account,
                    parsed: ReceiptManagerData,
                });
            }
            // eslint-disable-next-line no-empty
        }
        catch (e) { }
    });
    return ReceiptManagerDatas.sort((a, b) => a.pubkey.toBase58().localeCompare(b.pubkey.toBase58()));
};
//////// RECEIPT ENTRY ////////
export const getReceiptEntry = async (connection, receiptEntryId, commitment) => {
    const program = receiptManagerProgram(connection, undefined, { commitment });
    const parsed = (await program.account.receiptEntry.fetch(receiptEntryId));
    return {
        parsed,
        pubkey: receiptEntryId,
    };
};
//////// REWARD RECEIPT ////////
export const getRewardReceipt = async (connection, rewardReceiptId, commitment) => {
    const program = receiptManagerProgram(connection, undefined, { commitment });
    const parsed = (await program.account.rewardReceipt.fetch(rewardReceiptId));
    return {
        parsed,
        pubkey: rewardReceiptId,
    };
};
export const getAllRewardReceipts = async (connection, commitment) => getAllOfType(connection, "rewardReceipt", commitment);
export const getRewardReceiptsForManager = async (connection, rewardDistributorId, commitment) => {
    const programAccounts = await connection.getProgramAccounts(REWARD_DISTRIBUTOR_ADDRESS, {
        filters: [
            {
                memcmp: {
                    offset: 0,
                    bytes: utils.bytes.bs58.encode(BorshAccountsCoder.accountDiscriminator("rewardReceipt")),
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
    const rewardReceiptDatas = [];
    const coder = new BorshAccountsCoder(RECEIPT_MANAGER_IDL);
    programAccounts.forEach((account) => {
        try {
            const rewardReceiptData = coder.decode("rewardReceipt", account.account.data);
            if (rewardReceiptData) {
                rewardReceiptDatas.push({
                    ...account,
                    parsed: rewardReceiptData,
                });
            }
            // eslint-disable-next-line no-empty
        }
        catch (e) { }
    });
    return rewardReceiptDatas.sort((a, b) => a.pubkey.toBase58().localeCompare(b.pubkey.toBase58()));
};
export const getClaimableRewardReceiptsForManager = async (connection, receiptManagerId, commitment) => {
    const ReceiptManagerData = await tryGetAccount(() => getReceiptManager(connection, receiptManagerId, commitment));
    if (!ReceiptManagerData) {
        throw `No reward receipt manager found for ${receiptManagerId.toString()}`;
    }
    const rewardReceipts = await getRewardReceiptsForManager(connection, receiptManagerId);
    return rewardReceipts.filter((receipt) => receipt.parsed.target.toString() !== PublicKey.default.toString());
};
//////// utils ////////
export const getAllOfType = async (connection, key, commitment) => {
    const programAccounts = await connection.getProgramAccounts(RECEIPT_MANAGER_ADDRESS, {
        filters: [
            {
                memcmp: {
                    offset: 0,
                    bytes: utils.bytes.bs58.encode(BorshAccountsCoder.accountDiscriminator(key)),
                },
            },
        ],
        commitment,
    });
    const datas = [];
    const coder = new BorshAccountsCoder(RECEIPT_MANAGER_IDL);
    programAccounts.forEach((account) => {
        try {
            const data = coder.decode(key, account.account.data);
            if (data) {
                datas.push({
                    ...account,
                    parsed: data,
                });
            }
            // eslint-disable-next-line no-empty
        }
        catch (e) { }
    });
    return datas.sort((a, b) => a.pubkey.toBase58().localeCompare(b.pubkey.toBase58()));
};
//# sourceMappingURL=accounts.js.map