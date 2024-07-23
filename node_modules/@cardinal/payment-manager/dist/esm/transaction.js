import { findMintMetadataId, tryGetAccount } from "@cardinal/common";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { getPaymentManager } from "./accounts";
import { paymentManagerProgram } from "./constants";
import { findPaymentManagerAddress } from "./pda";
import { withRemainingAccountsForHandlePaymentWithRoyalties } from "./utils";
export const withInit = async (transaction, connection, wallet, params) => {
    var _a, _b, _c;
    const paymentManagerId = findPaymentManagerAddress(params.paymentManagerName);
    transaction.add(await paymentManagerProgram(connection, wallet)
        .methods.init({
        name: params.paymentManagerName,
        feeCollector: params.feeCollectorId,
        makerFeeBasisPoints: params.makerFeeBasisPoints,
        takerFeeBasisPoints: params.takerFeeBasisPoints,
        includeSellerFeeBasisPoints: params.includeSellerFeeBasisPoints,
        royaltyFeeShare: (_a = params.royaltyFeeShare) !== null && _a !== void 0 ? _a : null,
    })
        .accounts({
        paymentManager: findPaymentManagerAddress(params.paymentManagerName),
        authority: (_b = params.authority) !== null && _b !== void 0 ? _b : wallet.publicKey,
        payer: (_c = params.payer) !== null && _c !== void 0 ? _c : wallet.publicKey,
        systemProgram: SystemProgram.programId,
    })
        .instruction());
    return [transaction, paymentManagerId];
};
export const withManagePayment = async (transaction, connection, wallet, params) => {
    return transaction.add(await paymentManagerProgram(connection, wallet)
        .methods.managePayment(params.paymentAmount)
        .accounts({
        paymentManager: findPaymentManagerAddress(params.paymentManagerName),
        payerTokenAccount: params.payerTokenAccountId,
        feeCollectorTokenAccount: params.feeCollectorTokenAccountId,
        paymentTokenAccount: params.paymentTokenAccountId,
        payer: wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
    })
        .instruction());
};
export const withHandlePaymentWithRoyalties = async (transaction, connection, wallet, params) => {
    var _a;
    const paymentManagerId = findPaymentManagerAddress(params.paymentManagerName);
    const remainingAccounts = await withRemainingAccountsForHandlePaymentWithRoyalties(new Transaction(), connection, wallet, params.mintId, params.paymentMintId, params.buySideTokenAccountId, (_a = params.excludeCretors) !== null && _a !== void 0 ? _a : []);
    transaction.add(await paymentManagerProgram(connection, wallet)
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
        .instruction());
    return transaction;
};
export const withHandleNativePaymentWithRoyalties = async (transaction, connection, wallet, params) => {
    var _a;
    const paymentManagerId = findPaymentManagerAddress(params.paymentManagerName);
    const remainingAccounts = await withRemainingAccountsForHandlePaymentWithRoyalties(new Transaction(), connection, wallet, params.mintId, PublicKey.default, params.buySideTokenAccountId, (_a = params.excludeCretors) !== null && _a !== void 0 ? _a : []);
    transaction.add(await paymentManagerProgram(connection, wallet)
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
        .instruction());
    return transaction;
};
export const withClose = async (transaction, connection, wallet, params) => {
    var _a;
    transaction.add(await paymentManagerProgram(connection, wallet)
        .methods.close()
        .accounts({
        paymentManager: findPaymentManagerAddress(params.paymentManagerName),
        collector: (_a = params.collectorId) !== null && _a !== void 0 ? _a : wallet.publicKey,
        closer: wallet.publicKey,
    })
        .instruction());
    return transaction;
};
export const withUpdate = async (transaction, connection, wallet, params) => {
    var _a, _b, _c, _d, _e, _f;
    const paymentManagerId = findPaymentManagerAddress(params.paymentManagerName);
    const checkPaymentManager = await tryGetAccount(() => getPaymentManager(connection, paymentManagerId));
    if (!checkPaymentManager) {
        throw `No payment manager found with name ${params.paymentManagerName}`;
    }
    transaction.add(await paymentManagerProgram(connection, wallet)
        .methods.update({
        authority: (_a = params.authority) !== null && _a !== void 0 ? _a : checkPaymentManager.parsed.authority,
        feeCollector: (_b = checkPaymentManager.parsed.feeCollector) !== null && _b !== void 0 ? _b : params.feeCollectorId,
        makerFeeBasisPoints: (_c = checkPaymentManager.parsed.makerFeeBasisPoints) !== null && _c !== void 0 ? _c : params.makerFeeBasisPoints,
        takerFeeBasisPoints: (_d = checkPaymentManager.parsed.takerFeeBasisPoints) !== null && _d !== void 0 ? _d : params.takerFeeBasisPoints,
        royaltyFeeShare: (_f = (_e = checkPaymentManager.parsed.royaltyFeeShare) !== null && _e !== void 0 ? _e : params.royaltyFeeShare) !== null && _f !== void 0 ? _f : null,
    })
        .accounts({
        paymentManager: paymentManagerId,
        payer: wallet.publicKey,
        systemProgram: SystemProgram.programId,
    })
        .instruction());
    return transaction;
};
//# sourceMappingURL=transaction.js.map