"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUseInvalidatorAddress = void 0;
const anchor_1 = require("@project-serum/anchor");
const web3_js_1 = require("@solana/web3.js");
const constants_1 = require("./constants");
/**
 * Finds the use invalidator for this token manager.
 * @returns
 */
const findUseInvalidatorAddress = (tokenManagerId) => {
    return web3_js_1.PublicKey.findProgramAddressSync([anchor_1.utils.bytes.utf8.encode(constants_1.USE_INVALIDATOR_SEED), tokenManagerId.toBuffer()], constants_1.USE_INVALIDATOR_ADDRESS)[0];
};
exports.findUseInvalidatorAddress = findUseInvalidatorAddress;
//# sourceMappingURL=pda.js.map