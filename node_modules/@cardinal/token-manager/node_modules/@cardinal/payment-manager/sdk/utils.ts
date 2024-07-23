import {
  findAta,
  findMintMetadataId,
  tryNull,
  withFindOrInitAssociatedTokenAccount,
} from "@cardinal/common";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import type { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import { getAccount } from "@solana/spl-token";
import type { AccountMeta, Connection, Transaction } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";

import { getPaymentManager } from "./accounts";

export const withRemainingAccountsForPayment = async (
  transaction: Transaction,
  connection: Connection,
  wallet: Wallet,
  mint: PublicKey,
  paymentMint: PublicKey,
  issuerId: PublicKey,
  paymentManagerId: PublicKey,
  buySideTokenAccountId?: PublicKey,
  options?: {
    payer?: PublicKey;
    receiptMint?: PublicKey | null;
  }
): Promise<[PublicKey, PublicKey, AccountMeta[]]> => {
  const payer = options?.payer ?? wallet.publicKey;
  const royaltiesRemainingAccounts =
    await withRemainingAccountsForHandlePaymentWithRoyalties(
      transaction,
      connection,
      wallet,
      mint,
      paymentMint,
      buySideTokenAccountId,
      [issuerId.toString()]
    );
  const mintMetadataId = findMintMetadataId(mint);
  const paymentRemainingAccounts = [
    {
      pubkey: paymentMint,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: mint,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: mintMetadataId,
      isSigner: false,
      isWritable: true,
    },
  ];

  if (options?.receiptMint) {
    const receiptMintLargestAccount = await connection.getTokenLargestAccounts(
      options.receiptMint
    );
    // get holder of receipt mint
    const receiptTokenAccountId = receiptMintLargestAccount.value[0]?.address;
    if (!receiptTokenAccountId) throw new Error("No token accounts found");
    const receiptTokenAccount = await getAccount(
      connection,
      receiptTokenAccountId
    );

    // get ATA for this mint of receipt mint holder
    const returnTokenAccountId = receiptTokenAccount.owner.equals(
      wallet.publicKey
    )
      ? await findAta(paymentMint, receiptTokenAccount.owner, true)
      : await withFindOrInitAssociatedTokenAccount(
          transaction,
          connection,
          paymentMint,
          receiptTokenAccount.owner,
          payer,
          true
        );

    const paymentManager = await tryNull(
      getPaymentManager(connection, paymentManagerId)
    );
    const feeCollectorTokenAccountId =
      await withFindOrInitAssociatedTokenAccount(
        transaction,
        connection,
        paymentMint,
        paymentManager ? paymentManager.parsed.feeCollector : paymentManagerId,
        payer,
        true
      );
    return [
      returnTokenAccountId,
      feeCollectorTokenAccountId,
      [
        {
          pubkey: receiptTokenAccountId,
          isSigner: false,
          isWritable: true,
        },
        ...paymentRemainingAccounts,
        ...royaltiesRemainingAccounts,
      ],
    ];
  } else {
    const issuerTokenAccountId = issuerId.equals(wallet.publicKey)
      ? await findAta(paymentMint, issuerId, true)
      : await withFindOrInitAssociatedTokenAccount(
          transaction,
          connection,
          paymentMint,
          issuerId,
          payer,
          true
        );
    const paymentManager = await tryNull(
      getPaymentManager(connection, paymentManagerId)
    );
    const feeCollectorTokenAccountId =
      await withFindOrInitAssociatedTokenAccount(
        transaction,
        connection,
        paymentMint,
        paymentManager ? paymentManager.parsed.feeCollector : paymentManagerId,
        payer,
        true
      );
    return [
      issuerTokenAccountId,
      feeCollectorTokenAccountId,
      [...paymentRemainingAccounts, ...royaltiesRemainingAccounts],
    ];
  }
};

export const withRemainingAccountsForHandlePaymentWithRoyalties = async (
  transaction: Transaction,
  connection: Connection,
  wallet: Wallet,
  mint: PublicKey,
  paymentMint: PublicKey,
  buySideTokenAccountId?: PublicKey,
  excludeCreators?: string[]
): Promise<AccountMeta[]> => {
  const remainingAccounts: AccountMeta[] = [];
  let metaplexMintData: Metadata | undefined;
  try {
    const mintMetadataId = findMintMetadataId(mint);
    metaplexMintData = await Metadata.fromAccountAddress(
      connection,
      mintMetadataId
    );
  } catch (e) {
    // pass
  }
  if (metaplexMintData && metaplexMintData.data.creators) {
    for (const creator of metaplexMintData.data.creators) {
      if (creator.share !== 0) {
        const creatorAddress = new PublicKey(creator.address);
        if (paymentMint.toString() === PublicKey.default.toString()) {
          remainingAccounts.push({
            pubkey: new PublicKey(creator.address),
            isSigner: false,
            isWritable: true,
          });
        } else {
          const creatorMintTokenAccount = excludeCreators?.includes(
            creator.address.toString()
          )
            ? await findAta(paymentMint, creatorAddress, true)
            : await withFindOrInitAssociatedTokenAccount(
                transaction,
                connection,
                paymentMint,
                creatorAddress,
                wallet.publicKey,
                true
              );
          remainingAccounts.push({
            pubkey: creatorMintTokenAccount,
            isSigner: false,
            isWritable: true,
          });
        }
      }
    }
  }

  return [
    ...remainingAccounts,
    ...(buySideTokenAccountId
      ? [
          {
            pubkey: buySideTokenAccountId,
            isSigner: false,
            isWritable: true,
          },
        ]
      : []),
  ];
};
