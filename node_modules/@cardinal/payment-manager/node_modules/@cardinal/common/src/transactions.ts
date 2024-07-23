import type { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import * as splToken from "@solana/spl-token";
import type {
  Connection,
  PublicKey,
  SendTransactionError,
  Signer,
  Transaction,
} from "@solana/web3.js";
import { sendAndConfirmRawTransaction } from "@solana/web3.js";

import { chunkArray } from "./utils";

/**
 * Utility function for adding a find or init associated token account instruction to a transaction
 * Useful when using associated token accounts so you can be sure they are created before hand
 * @param transaction
 * @param connection
 * @param mint
 * @param owner
 * @param payer
 * @param allowOwnerOffCurve
 * @returns The associated token account ID that was found or will be created. This also adds the relevent instruction to create it to the transaction if not found
 */
export async function withFindOrInitAssociatedTokenAccount(
  transaction: Transaction,
  connection: Connection,
  mint: PublicKey,
  owner: PublicKey,
  payer: PublicKey,
  allowOwnerOffCurve?: boolean
): Promise<PublicKey> {
  const associatedAddress = await splToken.getAssociatedTokenAddress(
    mint,
    owner,
    allowOwnerOffCurve
  );
  const account = await connection.getAccountInfo(associatedAddress);
  if (!account) {
    transaction.add(
      splToken.createAssociatedTokenAccountInstruction(
        payer,
        associatedAddress,
        owner,
        mint
      )
    );
  }
  return associatedAddress;
}

export async function executeTransaction(
  connection: Connection,
  tx: Transaction,
  wallet: Wallet,
  config?: { signers?: Signer[]; silent?: boolean }
): Promise<string> {
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  tx.feePayer = wallet.publicKey;
  await wallet.signTransaction(tx);
  if (config?.signers) {
    tx.partialSign(...(config?.signers ?? []));
  }
  try {
    const txid = await sendAndConfirmRawTransaction(connection, tx.serialize());
    return txid;
  } catch (e) {
    if (!config?.silent) {
      handleError(e);
    }
    throw e;
  }
}

export async function executeTransactions<T = null>(
  connection: Connection,
  txs: Transaction[],
  wallet: Wallet,
  config?: {
    signers?: Signer[];
    batchSize?: number;
    errorHandler?: (e: unknown) => T;
  }
): Promise<(string | null | T)[]> {
  const latestBlockhash = (await connection.getLatestBlockhash()).blockhash;
  const signedTxs = await wallet.signAllTransactions(
    txs.map((tx) => {
      tx.recentBlockhash = latestBlockhash;
      tx.feePayer = wallet.publicKey;
      if (config?.signers) {
        tx.partialSign(...(config?.signers ?? []));
      }
      return tx;
    })
  );
  const batchedTxs = chunkArray(
    signedTxs,
    config?.batchSize ?? signedTxs.length
  );

  const txids: (string | T | null)[] = [];
  for (let i = 0; i < batchedTxs.length; i++) {
    const batch = batchedTxs[i];
    if (batch) {
      const batchTxids = await Promise.all(
        batch.map(async (tx) => {
          try {
            const txid = await sendAndConfirmRawTransaction(
              connection,
              tx.serialize()
            );
            return txid;
          } catch (e) {
            if (config?.errorHandler) {
              return config?.errorHandler(e);
            }
            handleError(e);
            return null;
          }
        })
      );
      txids.push(...batchTxids);
    }
  }
  return txids;
}

export const handleError = (e: unknown) => {
  const message = (e as SendTransactionError).message ?? "";
  const logs = (e as SendTransactionError).logs;
  if (logs) {
    console.log(logs, message);
  } else {
    console.log(e, message);
  }
};
