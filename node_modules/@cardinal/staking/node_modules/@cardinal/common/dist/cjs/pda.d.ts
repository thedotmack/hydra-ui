import { PublicKey } from "@solana/web3.js";
export declare const METADATA_PROGRAM_ID: PublicKey;
export declare const TOKEN_AUTH_RULES_ID: PublicKey;
export declare const findMintMetadataId: (mintId: PublicKey) => PublicKey;
export declare const findMintEditionId: (mintId: PublicKey) => PublicKey;
export declare function findTokenRecordId(mint: PublicKey, token: PublicKey): PublicKey;
export declare const findRuleSetId: (authority: PublicKey, name: string) => PublicKey;
//# sourceMappingURL=pda.d.ts.map