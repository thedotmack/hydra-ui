"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPaymentInfoId = exports.PAYMENT_INFO_SEED = exports.findRewardReceiptId = exports.REWARD_RECEIPT_SEED = exports.findReceiptManagerId = exports.RECEIPT_MANAGER_SEED = exports.findRewardEntryId = exports.REWARD_ENTRY_SEED = exports.findRewardDistributorId = exports.REWARD_DISTRIBUTOR_SEED = exports.findStakeBoosterId = exports.STAKE_BOOSTER_SEED = exports.findUserEscrowId = exports.USER_ESCROW_SEED = exports.findStakeAuthorizationRecordId = exports.STAKE_AUTHORIZATION_RECORD_SEED = exports.findStakePoolId = exports.STAKE_POOL_SEED = exports.findStakeEntryId = exports.STAKE_ENTRY_SEED = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const web3_js_1 = require("@solana/web3.js");
const constants_1 = require("./constants");
exports.STAKE_ENTRY_SEED = "stake-entry";
const findStakeEntryId = (stakePoolId, mintId, user, isFungible) => {
    return web3_js_1.PublicKey.findProgramAddressSync([
        anchor_1.utils.bytes.utf8.encode(exports.STAKE_ENTRY_SEED),
        stakePoolId.toBuffer(),
        mintId.toBuffer(),
        user && isFungible ? user.toBuffer() : web3_js_1.PublicKey.default.toBuffer(),
    ], constants_1.REWARDS_CENTER_ADDRESS)[0];
};
exports.findStakeEntryId = findStakeEntryId;
exports.STAKE_POOL_SEED = "stake-pool";
const findStakePoolId = (identifier) => {
    return web3_js_1.PublicKey.findProgramAddressSync([
        anchor_1.utils.bytes.utf8.encode(exports.STAKE_POOL_SEED),
        anchor_1.utils.bytes.utf8.encode(identifier),
    ], constants_1.REWARDS_CENTER_ADDRESS)[0];
};
exports.findStakePoolId = findStakePoolId;
exports.STAKE_AUTHORIZATION_RECORD_SEED = "stake-authorization";
const findStakeAuthorizationRecordId = (stakePoolId, mintId) => {
    return web3_js_1.PublicKey.findProgramAddressSync([
        anchor_1.utils.bytes.utf8.encode(exports.STAKE_AUTHORIZATION_RECORD_SEED),
        stakePoolId.toBuffer(),
        mintId.toBuffer(),
    ], constants_1.REWARDS_CENTER_ADDRESS)[0];
};
exports.findStakeAuthorizationRecordId = findStakeAuthorizationRecordId;
exports.USER_ESCROW_SEED = "escrow";
const findUserEscrowId = (user) => {
    return web3_js_1.PublicKey.findProgramAddressSync([anchor_1.utils.bytes.utf8.encode(exports.USER_ESCROW_SEED), user.toBuffer()], constants_1.REWARDS_CENTER_ADDRESS)[0];
};
exports.findUserEscrowId = findUserEscrowId;
exports.STAKE_BOOSTER_SEED = "stake-booster";
const findStakeBoosterId = (stakePoolId, identifier) => {
    return web3_js_1.PublicKey.findProgramAddressSync([
        anchor_1.utils.bytes.utf8.encode(exports.STAKE_BOOSTER_SEED),
        stakePoolId.toBuffer(),
        (identifier !== null && identifier !== void 0 ? identifier : new anchor_1.BN(0)).toArrayLike(Buffer, "le", 8),
    ], constants_1.REWARDS_CENTER_ADDRESS)[0];
};
exports.findStakeBoosterId = findStakeBoosterId;
exports.REWARD_DISTRIBUTOR_SEED = "reward-distributor";
const findRewardDistributorId = (stakePoolId, identifier) => {
    return web3_js_1.PublicKey.findProgramAddressSync([
        anchor_1.utils.bytes.utf8.encode(exports.REWARD_DISTRIBUTOR_SEED),
        stakePoolId.toBuffer(),
        (identifier !== null && identifier !== void 0 ? identifier : new anchor_1.BN(0)).toArrayLike(Buffer, "le", 8),
    ], constants_1.REWARDS_CENTER_ADDRESS)[0];
};
exports.findRewardDistributorId = findRewardDistributorId;
exports.REWARD_ENTRY_SEED = "reward-entry";
const findRewardEntryId = (rewardDistributorId, stakeEntryId) => {
    return web3_js_1.PublicKey.findProgramAddressSync([
        anchor_1.utils.bytes.utf8.encode(exports.REWARD_ENTRY_SEED),
        rewardDistributorId.toBuffer(),
        stakeEntryId.toBuffer(),
    ], constants_1.REWARDS_CENTER_ADDRESS)[0];
};
exports.findRewardEntryId = findRewardEntryId;
exports.RECEIPT_MANAGER_SEED = "receipt-manager";
const findReceiptManagerId = (stakePoolId, identifier) => {
    return web3_js_1.PublicKey.findProgramAddressSync([
        anchor_1.utils.bytes.utf8.encode(exports.RECEIPT_MANAGER_SEED),
        stakePoolId.toBuffer(),
        anchor_1.utils.bytes.utf8.encode(identifier),
    ], constants_1.REWARDS_CENTER_ADDRESS)[0];
};
exports.findReceiptManagerId = findReceiptManagerId;
exports.REWARD_RECEIPT_SEED = "reward-receipt";
const findRewardReceiptId = (receiptManagerId, stakeEntryId) => {
    return web3_js_1.PublicKey.findProgramAddressSync([
        anchor_1.utils.bytes.utf8.encode(exports.REWARD_RECEIPT_SEED),
        receiptManagerId.toBuffer(),
        stakeEntryId.toBuffer(),
    ], constants_1.REWARDS_CENTER_ADDRESS)[0];
};
exports.findRewardReceiptId = findRewardReceiptId;
exports.PAYMENT_INFO_SEED = "payment-info";
const findPaymentInfoId = (identifier) => {
    return web3_js_1.PublicKey.findProgramAddressSync([
        anchor_1.utils.bytes.utf8.encode(exports.PAYMENT_INFO_SEED),
        anchor_1.utils.bytes.utf8.encode(identifier),
    ], constants_1.REWARDS_CENTER_ADDRESS)[0];
};
exports.findPaymentInfoId = findPaymentInfoId;
//# sourceMappingURL=pda.js.map