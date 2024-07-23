"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findRuleSetId = exports.findTokenRecordId = exports.findMintEditionId = exports.findMintMetadataId = exports.TOKEN_AUTH_RULES_ID = exports.METADATA_PROGRAM_ID = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const web3_js_1 = require("@solana/web3.js");
exports.METADATA_PROGRAM_ID = new web3_js_1.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
exports.TOKEN_AUTH_RULES_ID = new web3_js_1.PublicKey("auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg");
const findMintMetadataId = (mintId) => {
    return web3_js_1.PublicKey.findProgramAddressSync([
        anchor_1.utils.bytes.utf8.encode("metadata"),
        exports.METADATA_PROGRAM_ID.toBuffer(),
        mintId.toBuffer(),
    ], exports.METADATA_PROGRAM_ID)[0];
};
exports.findMintMetadataId = findMintMetadataId;
const findMintEditionId = (mintId) => {
    return web3_js_1.PublicKey.findProgramAddressSync([
        anchor_1.utils.bytes.utf8.encode("metadata"),
        exports.METADATA_PROGRAM_ID.toBuffer(),
        mintId.toBuffer(),
        anchor_1.utils.bytes.utf8.encode("edition"),
    ], exports.METADATA_PROGRAM_ID)[0];
};
exports.findMintEditionId = findMintEditionId;
function findTokenRecordId(mint, token) {
    return web3_js_1.PublicKey.findProgramAddressSync([
        Buffer.from("metadata"),
        exports.METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from("token_record"),
        token.toBuffer(),
    ], exports.METADATA_PROGRAM_ID)[0];
}
exports.findTokenRecordId = findTokenRecordId;
const findRuleSetId = (authority, name) => {
    return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("rule_set"), authority.toBuffer(), Buffer.from(name)], exports.TOKEN_AUTH_RULES_ID)[0];
};
exports.findRuleSetId = findRuleSetId;
//# sourceMappingURL=pda.js.map