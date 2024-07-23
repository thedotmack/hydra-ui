import type { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import {
  createAssociatedTokenAccountInstruction,
  createInitializeMint2Instruction,
  createMintToInstruction,
  getAssociatedTokenAddressSync,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import type {
  Connection,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";

import { executeTransaction } from "./transactions";

/**
 * Build and execute mint Tx
 * @param connection
 * @param wallet
 * @param config
 * @returns
 */
export const createMint = async (
  connection: Connection,
  wallet: Wallet,
  config?: MintConfig
): Promise<[PublicKey, PublicKey]> => {
  const mintKeypair = Keypair.generate();
  const mintId = mintKeypair.publicKey;
  const [tx, ata] = await createMintTx(
    connection,
    mintKeypair.publicKey,
    wallet.publicKey,
    config
  );
  await executeTransaction(connection, tx, wallet, { signers: [mintKeypair] });
  return [ata, mintId];
};

export type MintConfig = {
  target?: PublicKey;
  amount?: number;
  decimals?: number;
};

/**
 * Transaction for creating a mint
 * @param connection
 * @param mintId
 * @param authority
 * @param config
 * @returns
 */
export const createMintTx = async (
  connection: Connection,
  mintId: PublicKey,
  authority: PublicKey,
  config?: MintConfig
): Promise<[Transaction, PublicKey]> => {
  const [ixs, ata] = await createMintIxs(connection, mintId, authority, config);
  const tx = new Transaction().add(...ixs);
  return [tx, ata];
};

/**
 * Instructions for creating a mint
 * @param connection
 * @param mintId
 * @param authority
 * @param config
 * @returns
 */
export const createMintIxs = async (
  connection: Connection,
  mintId: PublicKey,
  authority: PublicKey,
  config?: MintConfig
): Promise<[TransactionInstruction[], PublicKey]> => {
  const target = config?.target ?? authority;
  const ata = getAssociatedTokenAddressSync(mintId, target, true);
  return [
    [
      SystemProgram.createAccount({
        fromPubkey: authority,
        newAccountPubkey: mintId,
        space: MINT_SIZE,
        lamports: await getMinimumBalanceForRentExemptMint(connection),
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMint2Instruction(
        mintId,
        config?.decimals ?? 0,
        authority,
        authority
      ),
      createAssociatedTokenAccountInstruction(authority, ata, target, mintId),
      createMintToInstruction(mintId, ata, authority, config?.amount ?? 1),
    ],
    ata,
  ];
};
