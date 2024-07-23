"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchIdlAccountDataById = exports.decodeAccountInfos = exports.getProgramIdlAccounts = exports.tryDecodeIdlAccountUnknown = exports.decodeIdlAccountUnknown = exports.tryDecodeIdlAccount = exports.decodeIdlAccount = exports.fetchIdlAccountNullable = exports.fetchIdlAccount = void 0;
const common_1 = require("@cardinal/common");
const constants_1 = require("./constants");
/**
 * Fetch an account with idl types
 * @param connection
 * @param pubkey
 * @param accountType
 * @param config
 * @returns
 */
const fetchIdlAccount = async (connection, pubkey, accountType, config) => {
    return (0, common_1.fetchIdlAccount)(connection, pubkey, accountType, constants_1.REWARDS_CENTER_IDL, config);
};
exports.fetchIdlAccount = fetchIdlAccount;
/**
 * Fetch a possibly null account with idl types of a specific type
 * @param connection
 * @param pubkey
 * @param accountType
 * @param config
 * @param idl
 * @returns
 */
const fetchIdlAccountNullable = async (connection, pubkey, accountType, config) => {
    return (0, common_1.fetchIdlAccountNullable)(connection, pubkey, accountType, constants_1.REWARDS_CENTER_IDL, config);
};
exports.fetchIdlAccountNullable = fetchIdlAccountNullable;
/**
 * Decode an account with idl types of a specific type
 * @param accountInfo
 * @param accountType
 * @param idl
 * @returns
 */
const decodeIdlAccount = (accountInfo, accountType) => {
    return (0, common_1.decodeIdlAccount)(accountInfo, accountType, constants_1.REWARDS_CENTER_IDL);
};
exports.decodeIdlAccount = decodeIdlAccount;
/**
 * Try to decode an account with idl types of specific type
 * @param accountInfo
 * @param accountType
 * @param idl
 * @returns
 */
const tryDecodeIdlAccount = (accountInfo, accountType) => {
    return (0, common_1.tryDecodeIdlAccount)(accountInfo, accountType, constants_1.REWARDS_CENTER_IDL);
};
exports.tryDecodeIdlAccount = tryDecodeIdlAccount;
/**
 * Decode an idl account of unknown type
 * @param accountInfo
 * @param idl
 * @returns
 */
const decodeIdlAccountUnknown = (accountInfo) => {
    return (0, common_1.decodeIdlAccountUnknown)(accountInfo, constants_1.REWARDS_CENTER_IDL);
};
exports.decodeIdlAccountUnknown = decodeIdlAccountUnknown;
/**
 * Try to decode an account with idl types of unknown type
 * @param accountInfo
 * @param idl
 * @returns
 */
const tryDecodeIdlAccountUnknown = (accountInfo) => {
    return (0, common_1.tryDecodeIdlAccountUnknown)(accountInfo, constants_1.REWARDS_CENTER_IDL);
};
exports.tryDecodeIdlAccountUnknown = tryDecodeIdlAccountUnknown;
/**
 * Get program accounts of a specific idl type
 * @param connection
 * @param accountType
 * @param config
 * @param programId
 * @param idl
 * @returns
 */
const getProgramIdlAccounts = async (connection, accountType, config) => {
    return (0, common_1.getProgramIdlAccounts)(connection, accountType, constants_1.REWARDS_CENTER_ADDRESS, constants_1.REWARDS_CENTER_IDL, config);
};
exports.getProgramIdlAccounts = getProgramIdlAccounts;
/**
 * Decode account infos with corresponding ids
 * @param accountIds
 * @param accountInfos
 * @returns
 */
const decodeAccountInfos = (accountIds, accountInfos) => {
    return accountInfos.reduce((acc, accountInfo, i) => {
        var _a, _b;
        if (!(accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.data))
            return acc;
        const accoutIdString = (_b = (_a = accountIds[i]) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "";
        const ownerString = accountInfo.owner.toString();
        const baseData = {
            timestamp: Date.now(),
            pubkey: accountIds[i],
        };
        switch (ownerString) {
            // stakePool
            case constants_1.REWARDS_CENTER_ADDRESS.toString(): {
                acc[accoutIdString] = {
                    ...baseData,
                    ...(0, exports.tryDecodeIdlAccountUnknown)(accountInfo),
                };
                return acc;
            }
            // fallback
            default:
                acc[accoutIdString] = {
                    ...baseData,
                    ...accountInfo,
                    type: "unknown",
                    parsed: null,
                };
                return acc;
        }
    }, {});
};
exports.decodeAccountInfos = decodeAccountInfos;
/**
 * Batch fetch a map of accounts and their corresponding ids
 * @param connection
 * @param ids
 * @returns
 */
const fetchIdlAccountDataById = async (connection, ids) => {
    const filteredIds = ids.filter((id) => id !== null);
    const accountInfos = await (0, common_1.getBatchedMultipleAccounts)(connection, filteredIds);
    return (0, exports.decodeAccountInfos)(filteredIds, accountInfos);
};
exports.fetchIdlAccountDataById = fetchIdlAccountDataById;
//# sourceMappingURL=accounts.js.map