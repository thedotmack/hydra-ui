"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findReceiptMintManagerId = exports.findMintCounterId = exports.findMintManagerId = exports.findTransferReceiptId = exports.findClaimReceiptId = exports.findTokenManagerAddress = exports.tokenManagerAddressFromMint = exports.tryTokenManagerAddressFromMint = void 0;
const anchor_1 = require("@project-serum/anchor");
const web3_js_1 = require("@solana/web3.js");
const _1 = require(".");
const constants_1 = require("./constants");
/**
 * Finds the token manager address for a given mint
 * @returns
 */
const tryTokenManagerAddressFromMint = (mint) => {
    try {
        const tokenManagerId = (0, exports.tokenManagerAddressFromMint)(mint);
        return tokenManagerId;
    }
    catch (e) {
        return null;
    }
};
exports.tryTokenManagerAddressFromMint = tryTokenManagerAddressFromMint;
/**
 * Finds the token manager address for a given mint
 * @returns
 */
const tokenManagerAddressFromMint = (mint) => {
    const tokenManagerId = (0, exports.findTokenManagerAddress)(mint);
    return tokenManagerId;
};
exports.tokenManagerAddressFromMint = tokenManagerAddressFromMint;
/**
 * Finds the token manager address for a given mint and mint counter
 * @returns
 */
const findTokenManagerAddress = (mint) => {
    return web3_js_1.PublicKey.findProgramAddressSync([anchor_1.utils.bytes.utf8.encode(constants_1.TOKEN_MANAGER_SEED), mint.toBuffer()], constants_1.TOKEN_MANAGER_ADDRESS)[0];
};
exports.findTokenManagerAddress = findTokenManagerAddress;
/**
 * Finds the claim receipt id.
 * @returns
 */
const findClaimReceiptId = (tokenManagerId, recipientKey) => {
    return web3_js_1.PublicKey.findProgramAddressSync([
        anchor_1.utils.bytes.utf8.encode(constants_1.CLAIM_RECEIPT_SEED),
        tokenManagerId.toBuffer(),
        recipientKey.toBuffer(),
    ], constants_1.TOKEN_MANAGER_ADDRESS)[0];
};
exports.findClaimReceiptId = findClaimReceiptId;
/**
 * Finds the transfer receipt id.
 * @returns
 */
const findTransferReceiptId = (tokenManagerId) => {
    return web3_js_1.PublicKey.findProgramAddressSync([anchor_1.utils.bytes.utf8.encode(_1.TRANSFER_RECEIPT_SEED), tokenManagerId.toBuffer()], constants_1.TOKEN_MANAGER_ADDRESS)[0];
};
exports.findTransferReceiptId = findTransferReceiptId;
/**
 * Finds the mint manager id.
 * @returns
 */
const findMintManagerId = (mintId) => {
    return web3_js_1.PublicKey.findProgramAddressSync([anchor_1.utils.bytes.utf8.encode(_1.MINT_MANAGER_SEED), mintId.toBuffer()], constants_1.TOKEN_MANAGER_ADDRESS)[0];
};
exports.findMintManagerId = findMintManagerId;
/**
 * Finds the mint counter id.
 * @returns
 */
const findMintCounterId = (mintId) => {
    return web3_js_1.PublicKey.findProgramAddressSync([anchor_1.utils.bytes.utf8.encode(_1.MINT_COUNTER_SEED), mintId.toBuffer()], constants_1.TOKEN_MANAGER_ADDRESS)[0];
};
exports.findMintCounterId = findMintCounterId;
/**
 * Finds the receipt mint manager id.
 * @returns
 */
const findReceiptMintManagerId = () => {
    return web3_js_1.PublicKey.findProgramAddressSync([anchor_1.utils.bytes.utf8.encode(_1.RECEIPT_MINT_MANAGER_SEED)], constants_1.TOKEN_MANAGER_ADDRESS)[0];
};
exports.findReceiptMintManagerId = findReceiptMintManagerId;
//# sourceMappingURL=pda.js.map