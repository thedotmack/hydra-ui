"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTransferAddress = exports.findListingAddress = exports.findMarketplaceAddress = exports.findTransferAuthorityAddress = void 0;
const anchor_1 = require("@project-serum/anchor");
const web3_js_1 = require("@solana/web3.js");
const pda_1 = require("../tokenManager/pda");
const constants_1 = require("./constants");
/**
 * Finds the address of the transfer authority.
 * @returns
 */
const findTransferAuthorityAddress = (name) => {
    return web3_js_1.PublicKey.findProgramAddressSync([
        anchor_1.utils.bytes.utf8.encode(constants_1.TRANSFER_AUTHORITY_SEED),
        anchor_1.utils.bytes.utf8.encode(name),
    ], constants_1.TRANSFER_AUTHORITY_ADDRESS)[0];
};
exports.findTransferAuthorityAddress = findTransferAuthorityAddress;
/**
 * Finds the address of the marketplace.
 * @returns
 */
const findMarketplaceAddress = (name) => {
    return web3_js_1.PublicKey.findProgramAddressSync([anchor_1.utils.bytes.utf8.encode(constants_1.MARKETPLACE_SEED), anchor_1.utils.bytes.utf8.encode(name)], constants_1.TRANSFER_AUTHORITY_ADDRESS)[0];
};
exports.findMarketplaceAddress = findMarketplaceAddress;
/**
 * Finds the address of the listing.
 * @returns
 */
const findListingAddress = (mintId) => {
    const tokenManagerId = (0, pda_1.findTokenManagerAddress)(mintId);
    return web3_js_1.PublicKey.findProgramAddressSync([anchor_1.utils.bytes.utf8.encode(constants_1.LISTING_SEED), tokenManagerId.toBytes()], constants_1.TRANSFER_AUTHORITY_ADDRESS)[0];
};
exports.findListingAddress = findListingAddress;
/**
 * Finds the address of the transfer.
 * @returns
 */
const findTransferAddress = (mintId) => {
    const tokenManagerId = (0, pda_1.findTokenManagerAddress)(mintId);
    return web3_js_1.PublicKey.findProgramAddressSync([anchor_1.utils.bytes.utf8.encode(constants_1.TRANSFER_SEED), tokenManagerId.toBytes()], constants_1.TRANSFER_AUTHORITY_ADDRESS)[0];
};
exports.findTransferAddress = findTransferAddress;
//# sourceMappingURL=pda.js.map