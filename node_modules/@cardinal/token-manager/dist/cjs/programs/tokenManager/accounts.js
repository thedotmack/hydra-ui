"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransferReceipt = exports.getTokenManagersForIssuer = exports.getMintCounter = exports.getMintManager = exports.getTokenManagersByState = exports.getTokenManagers = exports.getTokenManager = void 0;
const anchor_1 = require("@project-serum/anchor");
const constants_1 = require("./constants");
const getTokenManager = async (connection, tokenManagerId) => {
    const program = (0, constants_1.tokenManagerProgram)(connection);
    const parsed = await program.account.tokenManager.fetch(tokenManagerId);
    return {
        parsed,
        pubkey: tokenManagerId,
    };
};
exports.getTokenManager = getTokenManager;
const getTokenManagers = async (connection, tokenManagerIds) => {
    const program = (0, constants_1.tokenManagerProgram)(connection);
    let tokenManagers = [];
    try {
        tokenManagers = (await program.account.tokenManager.fetchMultiple(tokenManagerIds));
    }
    catch (e) {
        console.log(e);
    }
    return tokenManagers.map((tm, i) => ({
        parsed: tm,
        pubkey: tokenManagerIds[i],
    }));
};
exports.getTokenManagers = getTokenManagers;
const getTokenManagersByState = async (connection, state) => {
    const programAccounts = await connection.getProgramAccounts(constants_1.TOKEN_MANAGER_ADDRESS, {
        filters: [
            {
                memcmp: {
                    offset: 0,
                    bytes: anchor_1.utils.bytes.bs58.encode(anchor_1.BorshAccountsCoder.accountDiscriminator("tokenManager")),
                },
            },
            ...(state
                ? [
                    {
                        memcmp: {
                            offset: 92,
                            bytes: anchor_1.utils.bytes.bs58.encode(new anchor_1.BN(state).toArrayLike(Buffer, "le", 1)),
                        },
                    },
                ]
                : []),
        ],
    });
    const tokenManagerDatas = [];
    const coder = new anchor_1.BorshAccountsCoder(constants_1.TOKEN_MANAGER_IDL);
    programAccounts.forEach((account) => {
        try {
            const tokenManagerData = coder.decode("tokenManager", account.account.data);
            if (tokenManagerData) {
                tokenManagerDatas.push({
                    ...account,
                    parsed: tokenManagerData,
                });
            }
        }
        catch (e) {
            console.log(`Failed to decode token manager data`);
        }
    });
    return tokenManagerDatas.sort((a, b) => a.pubkey.toBase58().localeCompare(b.pubkey.toBase58()));
};
exports.getTokenManagersByState = getTokenManagersByState;
const getMintManager = async (connection, mintManagerId) => {
    const program = (0, constants_1.tokenManagerProgram)(connection);
    const parsed = await program.account.mintManager.fetch(mintManagerId);
    return {
        parsed,
        pubkey: mintManagerId,
    };
};
exports.getMintManager = getMintManager;
const getMintCounter = async (connection, mintCounterId) => {
    const program = (0, constants_1.tokenManagerProgram)(connection);
    const parsed = await program.account.mintCounter.fetch(mintCounterId);
    return {
        parsed,
        pubkey: mintCounterId,
    };
};
exports.getMintCounter = getMintCounter;
const getTokenManagersForIssuer = async (connection, issuerId) => {
    const programAccounts = await connection.getProgramAccounts(constants_1.TOKEN_MANAGER_ADDRESS, {
        filters: [
            {
                memcmp: {
                    offset: 0,
                    bytes: anchor_1.utils.bytes.bs58.encode(anchor_1.BorshAccountsCoder.accountDiscriminator("tokenManager")),
                },
            },
            { memcmp: { offset: 19, bytes: issuerId.toBase58() } },
        ],
    });
    const tokenManagerDatas = [];
    const coder = new anchor_1.BorshAccountsCoder(constants_1.TOKEN_MANAGER_IDL);
    programAccounts.forEach((account) => {
        try {
            const tokenManagerData = coder.decode("tokenManager", account.account.data);
            if (tokenManagerData) {
                tokenManagerDatas.push({
                    ...account,
                    parsed: tokenManagerData,
                });
            }
        }
        catch (e) {
            console.log(`Failed to decode token manager data`);
        }
    });
    return tokenManagerDatas.sort((a, b) => a.pubkey.toBase58().localeCompare(b.pubkey.toBase58()));
};
exports.getTokenManagersForIssuer = getTokenManagersForIssuer;
const getTransferReceipt = async (connection, transferReceiptId) => {
    const program = (0, constants_1.tokenManagerProgram)(connection);
    const parsed = await program.account.transferReceipt.fetch(transferReceiptId);
    return {
        parsed,
        pubkey: transferReceiptId,
    };
};
exports.getTransferReceipt = getTransferReceipt;
//# sourceMappingURL=accounts.js.map