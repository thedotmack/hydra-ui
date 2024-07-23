import { findMintMetadataId, tryGetAccount } from "@cardinal/common";
import type { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import type { Connection } from "@solana/web3.js";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import type BN from "bn.js";

import { getPaymentManager } from "./accounts";
import { paymentManagerProgram } from "./constants";
import { findPaymentManagerAddress } from "./pda";
import { withRemainingAccountsForHandlePaymentWithRoyalties } from "./utils";

export const withInit = async (
  transaction: Transaction,
  connection: Connection,
  wallet: Wallet,
  params: {
    paymentManagerName: string;
    feeCollectorId: PublicKey;
    makerFeeBasisPoints: number;
    takerFeeBasisPoints: number;
    includeSellerFeeBasisPoints: boolean;
    royaltyFeeShare?: BN;
    payer?: PublicKey;
    authority?: PublicKey;
  }
): Promise<[Transaction, PublicKey]> => {
  const paymentManagerId = findPaymentManagerAddress(params.paymentManagerName);
  transaction.add(
    await paymentManagerProgram(connection, wallet)
      .methods.init({
        name: params.paymentManagerName,
        feeCollector: params.feeCollectorId,
        makerFeeBasisPoints: params.makerFeeBasisPoints,
        takerFeeBasisPoints: params.takerFeeBasisPoints,
        includeSellerFeeBasisPoints: params.includeSellerFeeBasisPoints,
        royaltyFeeShare: params.royaltyFeeShare ?? null,
      })
      .accounts({
        paymentManager: findPaymentManagerAddress(params.paymentManagerName),
        authority: params.authority ?? wallet.publicKey,
        payer: params.payer ?? wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .instruction()
  );
  return [transaction, paymentManagerId];
};

export const withManagePayment = async (
  transaction: Transaction,
  connection: Connection,
  wallet: Wallet,
  params: {
    paymentManagerName: string;
    paymentAmount: BN;
    payerTokenAccountId: PublicKey;
    feeCollectorTokenAccountId: PublicKey;
    paymentTokenAccountId: PublicKey;
  }
): Promise<Transaction> => {
  return transaction.add(
    await paymentManagerProgram(connection, wallet)
      .methods.managePayment(params.paymentAmount)
      .accounts({
        paymentManager: findPaymentManagerAddress(params.paymentManagerName),
        payerTokenAccount: params.payerTokenAccountId,
        feeCollectorTokenAccount: params.feeCollectorTokenAccountId,
        paymentTokenAccount: params.paymentTokenAccountId,
        payer: wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .instruction()
  );
};

export const withHandlePaymentWithRoyalties = async (
  transaction: Transaction,
  connection: Connection,
  wallet: Wallet,
  params: {
    paymentManagerName: string;
    paymentAmount: BN;
    mintId: PublicKey;
    paymentMintId: PublicKey;
    payerTokenAccountId: PublicKey;
    feeCollectorTokenAccountId: PublicKey;
    paymentTokenAccountId: PublicKey;
    buySideTokenAccountId?: PublicKey;
    excludeCretors?: string[];
  }
): Promise<Transaction> => {
  const paymentManagerId = findPaymentManagerAddress(params.paymentManagerName);

  const remainingAccounts =
    await withRemainingAccountsForHandlePaymentWithRoyalties(
      new Transaction(),
      connection,
      wallet,
      params.mintId,
      params.paymentMintId,
      params.buySideTokenAccountId,
      params.excludeCretors ?? []
    );
  transaction.add(
    await paymentManagerProgram(connection, wallet)
      .methods.handlePaymentWithRoyalties(params.paymentAmount)
      .accounts({
        paymentManager: paymentManagerId,
        payerTokenAccount: params.payerTokenAccountId,
        feeCollectorTokenAccount: params.feeCollectorTokenAccountId,
        paymentTokenAccount: params.paymentTokenAccountId,
        paymentMint: params.paymentMintId,
        mint: params.mintId,
        mintMetadata: findMintMetadataId(params.mintId),
        payer: wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .remainingAccounts(remainingAccounts)
      .instruction()
  );
  return transaction;
};

export const withHandleNativePaymentWithRoyalties = async (
  transaction: Transaction,
  connection: Connection,
  wallet: Wallet,
  params: {
    paymentManagerName: string;
    paymentAmount: BN;
    mintId: PublicKey;
    feeCollectorId: PublicKey;
    paymentTargetId: PublicKey;
    buySideTokenAccountId?: PublicKey;
    excludeCretors?: string[];
  }
): Promise<Transaction> => {
  const paymentManagerId = findPaymentManagerAddress(params.paymentManagerName);

  const remainingAccounts =
    await withRemainingAccountsForHandlePaymentWithRoyalties(
      new Transaction(),
      connection,
      wallet,
      params.mintId,
      PublicKey.default,
      params.buySideTokenAccountId,
      params.excludeCretors ?? []
    );

  transaction.add(
    await paymentManagerProgram(connection, wallet)
      .methods.handleNativePaymentWithRoyalties(params.paymentAmount)
      .accounts({
        paymentManager: paymentManagerId,
        feeCollector: params.feeCollectorId,
        paymentTarget: params.paymentTargetId,
        payer: wallet.publicKey,
        mint: params.mintId,
        mintMetadata: findMintMetadataId(params.mintId),
        systemProgram: SystemProgram.programId,
      })
      .remainingAccounts(remainingAccounts)
      .instruction()
  );
  return transaction;
};

export const withClose = async (
  transaction: Transaction,
  connection: Connection,
  wallet: Wallet,
  params: {
    paymentManagerName: string;
    collectorId?: PublicKey;
  }
): Promise<Transaction> => {
  transaction.add(
    await paymentManagerProgram(connection, wallet)
      .methods.close()
      .accounts({
        paymentManager: findPaymentManagerAddress(params.paymentManagerName),
        collector: params.collectorId ?? wallet.publicKey,
        closer: wallet.publicKey,
      })
      .instruction()
  );
  return transaction;
};

export const withUpdate = async (
  transaction: Transaction,
  connection: Connection,
  wallet: Wallet,
  params: {
    paymentManagerName: string;
    authority?: PublicKey;
    feeCollectorId?: PublicKey;
    makerFeeBasisPoints?: number;
    takerFeeBasisPoints?: number;
    royaltyFeeShare?: BN;
  }
): Promise<Transaction> => {
  const paymentManagerId = findPaymentManagerAddress(params.paymentManagerName);
  const checkPaymentManager = await tryGetAccount(() =>
    getPaymentManager(connection, paymentManagerId)
  );
  if (!checkPaymentManager) {
    throw `No payment manager found with name ${params.paymentManagerName}`;
  }

  transaction.add(
    await paymentManagerProgram(connection, wallet)
      .methods.update({
        authority: params.authority ?? checkPaymentManager.parsed.authority,
        feeCollector:
          checkPaymentManager.parsed.feeCollector ?? params.feeCollectorId,
        makerFeeBasisPoints:
          checkPaymentManager.parsed.makerFeeBasisPoints ??
          params.makerFeeBasisPoints,
        takerFeeBasisPoints:
          checkPaymentManager.parsed.takerFeeBasisPoints ??
          params.takerFeeBasisPoints,
        royaltyFeeShare:
          checkPaymentManager.parsed.royaltyFeeShare ??
          params.royaltyFeeShare ??
          null,
      })
      .accounts({
        paymentManager: paymentManagerId,
        payer: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .instruction()
  );
  return transaction;
};
