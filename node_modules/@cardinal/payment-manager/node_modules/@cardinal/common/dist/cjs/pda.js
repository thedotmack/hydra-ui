"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMintEditionId = exports.findMintMetadataId = exports.METADATA_PROGRAM_ID = void 0;
const anchor_1 = require("@project-serum/anchor");
const pubkey_1 = require("@project-serum/anchor/dist/cjs/utils/pubkey");
const web3_js_1 = require("@solana/web3.js");
exports.METADATA_PROGRAM_ID = new web3_js_1.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
const findMintMetadataId = (mintId) => {
    return (0, pubkey_1.findProgramAddressSync)([
        anchor_1.utils.bytes.utf8.encode("metadata"),
        exports.METADATA_PROGRAM_ID.toBuffer(),
        mintId.toBuffer(),
    ], exports.METADATA_PROGRAM_ID)[0];
};
exports.findMintMetadataId = findMintMetadataId;
const findMintEditionId = (mintId) => {
    return (0, pubkey_1.findProgramAddressSync)([
        anchor_1.utils.bytes.utf8.encode("metadata"),
        exports.METADATA_PROGRAM_ID.toBuffer(),
        mintId.toBuffer(),
        anchor_1.utils.bytes.utf8.encode("edition"),
    ], exports.METADATA_PROGRAM_ID)[0];
};
exports.findMintEditionId = findMintEditionId;
//# sourceMappingURL=pda.js.map