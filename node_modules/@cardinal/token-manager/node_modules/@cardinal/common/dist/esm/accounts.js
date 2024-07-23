import { __awaiter } from "tslib";
import { BorshAccountsCoder, utils } from "@coral-xyz/anchor";
/**
 * Fetch an account with idl types
 * @param connection
 * @param pubkey
 * @param accountType
 * @param config
 * @returns
 */
export const fetchIdlAccount = (connection, pubkey, accountType, idl, config) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield fetchIdlAccountNullable(connection, pubkey, accountType, idl, config);
    if (!account)
        throw "Account info not found";
    return account;
});
/**
 * Fetch a possibly null account with idl types of a specific type
 * @param connection
 * @param pubkey
 * @param accountType
 * @param config
 * @param idl
 * @returns
 */
export const fetchIdlAccountNullable = (connection, pubkey, accountType, idl, config) => __awaiter(void 0, void 0, void 0, function* () {
    const accountInfo = yield connection.getAccountInfo(pubkey, config);
    if (!accountInfo)
        return null;
    try {
        const parsed = new BorshAccountsCoder(idl).decode(accountType, accountInfo.data);
        return Object.assign(Object.assign({}, accountInfo), { pubkey,
            parsed, type: accountType });
    }
    catch (e) {
        return null;
    }
});
/**
 * Decode an account with idl types of a specific type
 * @param accountInfo
 * @param accountType
 * @param idl
 * @returns
 */
export const decodeIdlAccount = (accountInfo, accountType, idl) => {
    const parsed = new BorshAccountsCoder(idl).decode(accountType, accountInfo.data);
    return Object.assign(Object.assign({}, accountInfo), { type: accountType, parsed });
};
/**
 * Try to decode an account with idl types of specific type
 * @param accountInfo
 * @param accountType
 * @param idl
 * @returns
 */
export const tryDecodeIdlAccount = (accountInfo, accountType, idl) => {
    try {
        return decodeIdlAccount(accountInfo, accountType, idl);
    }
    catch (e) {
        return Object.assign(Object.assign({}, accountInfo), { type: "unknown", parsed: null });
    }
};
/**
 * Decode an idl account of unknown type
 * @param accountInfo
 * @param idl
 * @returns
 */
export const decodeIdlAccountUnknown = (accountInfo, idl) => {
    if (!accountInfo)
        throw "No account found";
    // get idl accounts
    const idlAccounts = idl["accounts"];
    if (!idlAccounts)
        throw "No account definitions found in IDL";
    // find matching account name
    const accountTypes = idlAccounts.map((a) => a.name);
    const accountType = accountTypes === null || accountTypes === void 0 ? void 0 : accountTypes.find((accountType) => BorshAccountsCoder.accountDiscriminator(accountType).compare(accountInfo.data.subarray(0, 8)) === 0);
    if (!accountType)
        throw "No account discriminator match found";
    // decode
    const parsed = new BorshAccountsCoder(idl).decode(accountType, accountInfo.data);
    return Object.assign(Object.assign({}, accountInfo), { type: accountType, parsed });
};
/**
 * Try to decode an account with idl types of unknown type
 * @param accountInfo
 * @param idl
 * @returns
 */
export const tryDecodeIdlAccountUnknown = (accountInfo, idl) => {
    try {
        return decodeIdlAccountUnknown(accountInfo, idl);
    }
    catch (e) {
        return Object.assign(Object.assign({}, accountInfo), { type: "unknown", parsed: null });
    }
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
export const getProgramIdlAccounts = (connection, accountType, programId, idl, config) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const accountInfos = yield connection.getProgramAccounts(programId, {
        filters: [
            {
                memcmp: {
                    offset: 0,
                    bytes: utils.bytes.bs58.encode(BorshAccountsCoder.accountDiscriminator(accountType)),
                },
            },
            ...((_a = config === null || config === void 0 ? void 0 : config.filters) !== null && _a !== void 0 ? _a : []),
        ],
    });
    return accountInfos.map((accountInfo) => (Object.assign({ pubkey: accountInfo.pubkey }, tryDecodeIdlAccount(accountInfo.account, accountType, idl))));
});
/**
 * Decode account infos with corresponding ids
 * @param accountIds
 * @param accountInfos
 * @returns
 */
export const decodeIdlAccountInfos = (accountIds, accountInfos, programId, idl) => {
    return accountInfos.reduce((acc, accountInfo, i) => {
        var _a;
        if (!(accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.data))
            return acc;
        const accountId = accountIds[i];
        if (!accountId)
            return acc;
        const accoutIdString = (_a = accountId === null || accountId === void 0 ? void 0 : accountId.toString()) !== null && _a !== void 0 ? _a : "";
        const ownerString = accountInfo.owner.toString();
        const baseData = {
            timestamp: Date.now(),
            pubkey: accountId,
        };
        switch (ownerString) {
            // stakePool
            case programId.toString(): {
                acc[accoutIdString] = Object.assign(Object.assign({}, baseData), tryDecodeIdlAccountUnknown(accountInfo, idl));
                return acc;
            }
            // fallback
            default:
                acc[accoutIdString] = Object.assign(Object.assign(Object.assign({}, baseData), accountInfo), { type: "unknown", parsed: null });
                return acc;
        }
    }, {});
};
export const fetchIdlAccountDataById = (connection, ids, programId, idl) => __awaiter(void 0, void 0, void 0, function* () {
    const filteredIds = ids.filter((id) => id !== null);
    const accountInfos = yield getBatchedMultipleAccounts(connection, filteredIds);
    return decodeIdlAccountInfos(filteredIds, accountInfos, programId, idl);
});
/**
 * Fecthes multiple accounts in batches since there is a limit of
 * 100 accounts per connection.getMultipleAccountsInfo call
 * @param connection
 * @param ids
 * @param config
 * @param batchSize
 * @returns
 */
export const getBatchedMultipleAccounts = (connection, ids, config, batchSize = 100) => __awaiter(void 0, void 0, void 0, function* () {
    const batches = [[]];
    ids.forEach((id) => {
        const batch = batches[batches.length - 1];
        if (batch) {
            if (batch.length >= batchSize) {
                batches.push([id]);
            }
            else {
                batch.push(id);
            }
        }
    });
    const batchAccounts = yield Promise.all(batches.map((b) => b.length > 0 ? connection.getMultipleAccountsInfo(b, config) : []));
    return batchAccounts.flat();
});
/**
 * Batch fetch a map of accounts and their corresponding ids
 * @param connection
 * @param ids
 * @returns
 */
export const fetchAccountDataById = (connection, ids) => __awaiter(void 0, void 0, void 0, function* () {
    const filteredIds = ids.filter((id) => id !== null);
    const accountInfos = yield getBatchedMultipleAccounts(connection, filteredIds);
    return accountInfos.reduce((acc, accountInfo, i) => {
        if (!(accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.data))
            return acc;
        const pubkey = ids[i];
        if (!pubkey)
            return acc;
        acc[pubkey.toString()] = Object.assign({ pubkey }, accountInfo);
        return acc;
    }, {});
});
//# sourceMappingURL=accounts.js.map