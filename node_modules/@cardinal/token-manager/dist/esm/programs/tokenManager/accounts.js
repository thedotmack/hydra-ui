import { BN, BorshAccountsCoder, utils } from "@project-serum/anchor";
import { TOKEN_MANAGER_ADDRESS, TOKEN_MANAGER_IDL, tokenManagerProgram, } from "./constants";
export const getTokenManager = async (connection, tokenManagerId) => {
    const program = tokenManagerProgram(connection);
    const parsed = await program.account.tokenManager.fetch(tokenManagerId);
    return {
        parsed,
        pubkey: tokenManagerId,
    };
};
export const getTokenManagers = async (connection, tokenManagerIds) => {
    const program = tokenManagerProgram(connection);
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
export const getTokenManagersByState = async (connection, state) => {
    const programAccounts = await connection.getProgramAccounts(TOKEN_MANAGER_ADDRESS, {
        filters: [
            {
                memcmp: {
                    offset: 0,
                    bytes: utils.bytes.bs58.encode(BorshAccountsCoder.accountDiscriminator("tokenManager")),
                },
            },
            ...(state
                ? [
                    {
                        memcmp: {
                            offset: 92,
                            bytes: utils.bytes.bs58.encode(new BN(state).toArrayLike(Buffer, "le", 1)),
                        },
                    },
                ]
                : []),
        ],
    });
    const tokenManagerDatas = [];
    const coder = new BorshAccountsCoder(TOKEN_MANAGER_IDL);
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
export const getMintManager = async (connection, mintManagerId) => {
    const program = tokenManagerProgram(connection);
    const parsed = await program.account.mintManager.fetch(mintManagerId);
    return {
        parsed,
        pubkey: mintManagerId,
    };
};
export const getMintCounter = async (connection, mintCounterId) => {
    const program = tokenManagerProgram(connection);
    const parsed = await program.account.mintCounter.fetch(mintCounterId);
    return {
        parsed,
        pubkey: mintCounterId,
    };
};
export const getTokenManagersForIssuer = async (connection, issuerId) => {
    const programAccounts = await connection.getProgramAccounts(TOKEN_MANAGER_ADDRESS, {
        filters: [
            {
                memcmp: {
                    offset: 0,
                    bytes: utils.bytes.bs58.encode(BorshAccountsCoder.accountDiscriminator("tokenManager")),
                },
            },
            { memcmp: { offset: 19, bytes: issuerId.toBase58() } },
        ],
    });
    const tokenManagerDatas = [];
    const coder = new BorshAccountsCoder(TOKEN_MANAGER_IDL);
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
export const getTransferReceipt = async (connection, transferReceiptId) => {
    const program = tokenManagerProgram(connection);
    const parsed = await program.account.transferReceipt.fetch(transferReceiptId);
    return {
        parsed,
        pubkey: transferReceiptId,
    };
};
//# sourceMappingURL=accounts.js.map