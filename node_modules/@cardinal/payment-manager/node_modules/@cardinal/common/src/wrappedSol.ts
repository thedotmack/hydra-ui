import type { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import * as BufferLayout from "@solana/buffer-layout";
import * as splToken from "@solana/spl-token";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import * as web3 from "@solana/web3.js";

import { withFindOrInitAssociatedTokenAccount } from "./transactions";

export async function withWrapSol(
  transaction: web3.Transaction,
  connection: web3.Connection,
  wallet: Wallet,
  lamports: number,
  skipInitTokenAccount = false
): Promise<web3.Transaction> {
  const nativeAssociatedTokenAccountId = skipInitTokenAccount
    ? getAssociatedTokenAddressSync(
        splToken.NATIVE_MINT,
        wallet.publicKey,
        true
      )
    : await withFindOrInitAssociatedTokenAccount(
        transaction,
        connection,
        splToken.NATIVE_MINT,
        wallet.publicKey,
        wallet.publicKey
      );
  transaction.add(
    web3.SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: nativeAssociatedTokenAccountId,
      lamports,
    })
  );
  transaction.add(createSyncNativeInstruction(nativeAssociatedTokenAccountId));
  return transaction;
}

export function createSyncNativeInstruction(
  nativeAccount: web3.PublicKey
): web3.TransactionInstruction {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const dataLayout = BufferLayout.struct([BufferLayout.u8("instruction")]);
  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 17, // SyncNative instruction
    },
    data
  );

  const keys = [{ pubkey: nativeAccount, isSigner: false, isWritable: true }];
  return new web3.TransactionInstruction({
    keys,
    programId: splToken.TOKEN_PROGRAM_ID,
    data,
  });
}
