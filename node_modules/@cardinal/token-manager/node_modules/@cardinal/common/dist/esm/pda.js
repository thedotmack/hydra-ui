import { utils } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
export const METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
export const TOKEN_AUTH_RULES_ID = new PublicKey("auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg");
export const findMintMetadataId = (mintId) => {
    return PublicKey.findProgramAddressSync([
        utils.bytes.utf8.encode("metadata"),
        METADATA_PROGRAM_ID.toBuffer(),
        mintId.toBuffer(),
    ], METADATA_PROGRAM_ID)[0];
};
export const findMintEditionId = (mintId) => {
    return PublicKey.findProgramAddressSync([
        utils.bytes.utf8.encode("metadata"),
        METADATA_PROGRAM_ID.toBuffer(),
        mintId.toBuffer(),
        utils.bytes.utf8.encode("edition"),
    ], METADATA_PROGRAM_ID)[0];
};
export function findTokenRecordId(mint, token) {
    return PublicKey.findProgramAddressSync([
        Buffer.from("metadata"),
        METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from("token_record"),
        token.toBuffer(),
    ], METADATA_PROGRAM_ID)[0];
}
export const findRuleSetId = (authority, name) => {
    return PublicKey.findProgramAddressSync([Buffer.from("rule_set"), authority.toBuffer(), Buffer.from(name)], TOKEN_AUTH_RULES_ID)[0];
};
//# sourceMappingURL=pda.js.map