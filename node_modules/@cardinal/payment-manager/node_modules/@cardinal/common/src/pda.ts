import { utils } from "@project-serum/anchor";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { PublicKey } from "@solana/web3.js";

export const METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

export const findMintMetadataId = (mintId: PublicKey): PublicKey => {
  return findProgramAddressSync(
    [
      utils.bytes.utf8.encode("metadata"),
      METADATA_PROGRAM_ID.toBuffer(),
      mintId.toBuffer(),
    ],
    METADATA_PROGRAM_ID
  )[0];
};

export const findMintEditionId = (mintId: PublicKey): PublicKey => {
  return findProgramAddressSync(
    [
      utils.bytes.utf8.encode("metadata"),
      METADATA_PROGRAM_ID.toBuffer(),
      mintId.toBuffer(),
      utils.bytes.utf8.encode("edition"),
    ],
    METADATA_PROGRAM_ID
  )[0];
};
