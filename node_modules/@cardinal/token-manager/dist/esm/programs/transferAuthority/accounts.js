import { BorshAccountsCoder, utils } from "@project-serum/anchor";
import { TRANSFER_AUTHORITY_ADDRESS, TRANSFER_AUTHORITY_IDL, transferAuthorityProgram, } from "./constants";
import { findListingAddress, findMarketplaceAddress, findTransferAddress, findTransferAuthorityAddress, } from "./pda";
//////// TRANSFER AUTHORITY ////////
export const getTransferAuthority = async (connection, transferAuthorityId) => {
    const program = transferAuthorityProgram(connection);
    const parsed = await program.account.transferAuthority.fetch(transferAuthorityId);
    return {
        parsed,
        pubkey: transferAuthorityId,
    };
};
export const getTransferAuthorityByName = async (connection, name) => {
    const program = transferAuthorityProgram(connection);
    const transferAuthorityId = findTransferAuthorityAddress(name);
    const parsed = await program.account.transferAuthority.fetch(transferAuthorityId);
    return {
        parsed,
        pubkey: transferAuthorityId,
    };
};
export const getAllTransferAuthorities = async (connection) => getAllOfType(connection, "transferAuthority");
//////// MARKETPLACE ////////
export const getMarketplace = async (connection, marketplaceId) => {
    const program = transferAuthorityProgram(connection);
    const parsed = await program.account.marketplace.fetch(marketplaceId);
    return {
        parsed,
        pubkey: marketplaceId,
    };
};
export const getMarketplaceByName = async (connection, name) => {
    const program = transferAuthorityProgram(connection);
    const marketplaceId = findMarketplaceAddress(name);
    const parsed = await program.account.marketplace.fetch(marketplaceId);
    return {
        parsed,
        pubkey: marketplaceId,
    };
};
export const getAllMarketplaces = async (connection) => getAllOfType(connection, "marketplace");
//////// LISTING ////////
export const getListing = async (connection, mintId) => {
    const program = transferAuthorityProgram(connection);
    const listingId = findListingAddress(mintId);
    const parsed = await program.account.listing.fetch(listingId);
    return {
        parsed,
        pubkey: listingId,
    };
};
export const getListingsForMarketplace = async (connection, marketplaceId) => {
    const programAccounts = await connection.getProgramAccounts(TRANSFER_AUTHORITY_ADDRESS, {
        filters: [
            {
                memcmp: {
                    offset: 0,
                    bytes: utils.bytes.bs58.encode(BorshAccountsCoder.accountDiscriminator("listing")),
                },
            },
            { memcmp: { offset: 73, bytes: marketplaceId.toBase58() } },
        ],
    });
    const datas = [];
    const coder = new BorshAccountsCoder(TRANSFER_AUTHORITY_IDL);
    programAccounts.forEach((account) => {
        try {
            const data = coder.decode("listing", account.account.data);
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
export const getListingsForIssuer = async (connection, issuerId) => {
    const programAccounts = await connection.getProgramAccounts(TRANSFER_AUTHORITY_ADDRESS, {
        filters: [
            {
                memcmp: {
                    offset: 0,
                    bytes: utils.bytes.bs58.encode(BorshAccountsCoder.accountDiscriminator("listing")),
                },
            },
            { memcmp: { offset: 9, bytes: issuerId.toBase58() } },
        ],
    });
    const datas = [];
    const coder = new BorshAccountsCoder(TRANSFER_AUTHORITY_IDL);
    programAccounts.forEach((account) => {
        try {
            const data = coder.decode("listing", account.account.data);
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
export const getAllListings = async (connection) => getAllOfType(connection, "listing");
//////// Transfer ////////
export const getTransfer = async (connection, mintId) => {
    const program = transferAuthorityProgram(connection);
    const transferId = findTransferAddress(mintId);
    const parsed = await program.account.transfer.fetch(transferId);
    return {
        parsed,
        pubkey: transferId,
    };
};
export const getTransfersFromUser = async (connection, from) => {
    const programAccounts = await connection.getProgramAccounts(TRANSFER_AUTHORITY_ADDRESS, {
        filters: [
            {
                memcmp: {
                    offset: 0,
                    bytes: utils.bytes.bs58.encode(BorshAccountsCoder.accountDiscriminator("transfer")),
                },
            },
            { memcmp: { offset: 41, bytes: from.toBase58() } },
        ],
    });
    const datas = [];
    const coder = new BorshAccountsCoder(TRANSFER_AUTHORITY_IDL);
    programAccounts.forEach((account) => {
        try {
            const data = coder.decode("transfer", account.account.data);
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
export const getTransfersToUser = async (connection, to) => {
    const programAccounts = await connection.getProgramAccounts(TRANSFER_AUTHORITY_ADDRESS, {
        filters: [
            {
                memcmp: {
                    offset: 0,
                    bytes: utils.bytes.bs58.encode(BorshAccountsCoder.accountDiscriminator("transfer")),
                },
            },
            { memcmp: { offset: 73, bytes: to.toBase58() } },
        ],
    });
    const datas = [];
    const coder = new BorshAccountsCoder(TRANSFER_AUTHORITY_IDL);
    programAccounts.forEach((account) => {
        try {
            const data = coder.decode("transfer", account.account.data);
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
//////// utils ////////
export const getAllOfType = async (connection, key) => {
    const programAccounts = await connection.getProgramAccounts(TRANSFER_AUTHORITY_ADDRESS, {
        filters: [
            {
                memcmp: {
                    offset: 0,
                    bytes: utils.bytes.bs58.encode(BorshAccountsCoder.accountDiscriminator(key)),
                },
            },
        ],
    });
    const datas = [];
    const coder = new BorshAccountsCoder(TRANSFER_AUTHORITY_IDL);
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