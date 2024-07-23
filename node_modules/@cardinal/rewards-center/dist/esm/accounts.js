import { decodeIdlAccount as cDecodeIdlAccount, decodeIdlAccountUnknown as cDecodeIdlAccountUnknown, fetchIdlAccount as cFetchIdlAccount, fetchIdlAccountNullable as cFetchIdlAccountNullable, getBatchedMultipleAccounts, getProgramIdlAccounts as cGetProgramIdlAccounts, tryDecodeIdlAccount as cTryDecodeIdlAccount, tryDecodeIdlAccountUnknown as cTryDecodeIdlAccountUnknown, } from "@cardinal/common";
import { REWARDS_CENTER_ADDRESS, REWARDS_CENTER_IDL } from "./constants";
/**
 * Fetch an account with idl types
 * @param connection
 * @param pubkey
 * @param accountType
 * @param config
 * @returns
 */
export const fetchIdlAccount = async (connection, pubkey, accountType, config) => {
    return cFetchIdlAccount(connection, pubkey, accountType, REWARDS_CENTER_IDL, config);
};
/**
 * Fetch a possibly null account with idl types of a specific type
 * @param connection
 * @param pubkey
 * @param accountType
 * @param config
 * @param idl
 * @returns
 */
export const fetchIdlAccountNullable = async (connection, pubkey, accountType, config) => {
    return cFetchIdlAccountNullable(connection, pubkey, accountType, REWARDS_CENTER_IDL, config);
};
/**
 * Decode an account with idl types of a specific type
 * @param accountInfo
 * @param accountType
 * @param idl
 * @returns
 */
export const decodeIdlAccount = (accountInfo, accountType) => {
    return cDecodeIdlAccount(accountInfo, accountType, REWARDS_CENTER_IDL);
};
/**
 * Try to decode an account with idl types of specific type
 * @param accountInfo
 * @param accountType
 * @param idl
 * @returns
 */
export const tryDecodeIdlAccount = (accountInfo, accountType) => {
    return cTryDecodeIdlAccount(accountInfo, accountType, REWARDS_CENTER_IDL);
};
/**
 * Decode an idl account of unknown type
 * @param accountInfo
 * @param idl
 * @returns
 */
export const decodeIdlAccountUnknown = (accountInfo) => {
    return cDecodeIdlAccountUnknown(accountInfo, REWARDS_CENTER_IDL);
};
/**
 * Try to decode an account with idl types of unknown type
 * @param accountInfo
 * @param idl
 * @returns
 */
export const tryDecodeIdlAccountUnknown = (accountInfo) => {
    return cTryDecodeIdlAccountUnknown(accountInfo, REWARDS_CENTER_IDL);
};
/**
 * Get program accounts of a specific idl type
 * @param connection
 * @param accountType
 * @param config
 * @param programId
 * @param idl
 * @returns
 */
export const getProgramIdlAccounts = async (connection, accountType, config) => {
    return cGetProgramIdlAccounts(connection, accountType, REWARDS_CENTER_ADDRESS, REWARDS_CENTER_IDL, config);
};
/**
 * Decode account infos with corresponding ids
 * @param accountIds
 * @param accountInfos
 * @returns
 */
export const decodeAccountInfos = (accountIds, accountInfos) => {
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
            case REWARDS_CENTER_ADDRESS.toString(): {
                acc[accoutIdString] = {
                    ...baseData,
                    ...tryDecodeIdlAccountUnknown(accountInfo),
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
/**
 * Batch fetch a map of accounts and their corresponding ids
 * @param connection
 * @param ids
 * @returns
 */
export const fetchIdlAccountDataById = async (connection, ids) => {
    const filteredIds = ids.filter((id) => id !== null);
    const accountInfos = await getBatchedMultipleAccounts(connection, filteredIds);
    return decodeAccountInfos(filteredIds, accountInfos);
};
//# sourceMappingURL=accounts.js.map