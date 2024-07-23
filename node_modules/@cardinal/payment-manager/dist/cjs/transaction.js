"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withUpdate = exports.withClose = exports.withHandleNativePaymentWithRoyalties = exports.withHandlePaymentWithRoyalties = exports.withManagePayment = exports.withInit = void 0;
const common_1 = require("@cardinal/common");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const accounts_1 = require("./accounts");
const constants_1 = require("./constants");
const pda_1 = require("./pda");
const utils_1 = require("./utils");
const withInit = async (transaction, connection, wallet, params) => {
    var _a, _b, _c;
    const paymentManagerId = (0, pda_1.findPaymentManagerAddress)(params.paymentManagerName);
    transaction.add(await (0, constants_1.paymentManagerProgram)(connection, wallet)
        .methods.init({
        name: params.paymentManagerName,
        feeCollector: params.feeCollectorId,
        makerFeeBasisPoints: params.makerFeeBasisPoints,
        takerFeeBasisPoints: params.takerFeeBasisPoints,
        includeSellerFeeBasisPoints: params.includeSellerFeeBasisPoints,
        royaltyFeeShare: (_a = params.royaltyFeeShare) !== null && _a !== void 0 ? _a : null,
    })
        .accounts({
        paymentManager: (0, pda_1.findPaymentManagerAddress)(params.paymentManagerName),
        authority: (_b = params.authority) !== null && _b !== void 0 ? _b : wallet.publicKey,
        payer: (_c = params.payer) !== null && _c !== void 0 ? _c : wallet.publicKey,
        systemProgram: web3_js_1.SystemProgram.programId,
    })
        .instruction());
    return [transaction, paymentManagerId];
};
exports.withInit = withInit;
const withManagePayment = async (transaction, connection, wallet, params) => {
    return transaction.add(await (0, constants_1.paymentManagerProgram)(connection, wallet)
        .methods.managePayment(params.paymentAmount)
        .accounts({
        paymentManager: (0, pda_1.findPaymentManagerAddress)(params.paymentManagerName),
        payerTokenAccount: params.payerTokenAccountId,
        feeCollectorTokenAccount: params.feeCollectorTokenAccountId,
        paymentTokenAccount: params.paymentTokenAccountId,
        payer: wallet.publicKey,
        tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
    })
        .instruction());
};
exports.withManagePayment = withManagePayment;
const withHandlePaymentWithRoyalties = async (transaction, connection, wallet, params) => {
    var _a;
    const paymentManagerId = (0, pda_1.findPaymentManagerAddress)(params.paymentManagerName);
    const remainingAccounts = await (0, utils_1.withRemainingAccountsForHandlePaymentWithRoyalties)(new web3_js_1.Transaction(), connection, wallet, params.mintId, params.paymentMintId, params.buySideTokenAccountId, (_a = params.excludeCretors) !== null && _a !== void 0 ? _a : []);
    transaction.add(await (0, constants_1.paymentManagerProgram)(connection, wallet)
        .methods.handlePaymentWithRoyalties(params.paymentAmount)
        .accounts({
        paymentManager: paymentManagerId,
        payerTokenAccount: params.payerTokenAccountId,
        feeCollectorTokenAccount: params.feeCollectorTokenAccountId,
        paymentTokenAccount: params.paymentTokenAccountId,
        paymentMint: params.paymentMintId,
        mint: params.mintId,
        mintMetadata: (0, common_1.findMintMetadataId)(params.mintId),
        payer: wallet.publicKey,
        tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
    })
        .remainingAccounts(remainingAccounts)
        .instruction());
    return transaction;
};
exports.withHandlePaymentWithRoyalties = withHandlePaymentWithRoyalties;
const withHandleNativePaymentWithRoyalties = async (transaction, connection, wallet, params) => {
    var _a;
    const paymentManagerId = (0, pda_1.findPaymentManagerAddress)(params.paymentManagerName);
    const remainingAccounts = await (0, utils_1.withRemainingAccountsForHandlePaymentWithRoyalties)(new web3_js_1.Transaction(), connection, wallet, params.mintId, web3_js_1.PublicKey.default, params.buySideTokenAccountId, (_a = params.excludeCretors) !== null && _a !== void 0 ? _a : []);
    transaction.add(await (0, constants_1.paymentManagerProgram)(connection, wallet)
        .methods.handleNativePaymentWithRoyalties(params.paymentAmount)
        .accounts({
        paymentManager: paymentManagerId,
        feeCollector: params.feeCollectorId,
        paymentTarget: params.paymentTargetId,
        payer: wallet.publicKey,
        mint: params.mintId,
        mintMetadata: (0, common_1.findMintMetadataId)(params.mintId),
        systemProgram: web3_js_1.SystemProgram.programId,
    })
        .remainingAccounts(remainingAccounts)
        .instruction());
    return transaction;
};
exports.withHandleNativePaymentWithRoyalties = withHandleNativePaymentWithRoyalties;
const withClose = async (transaction, connection, wallet, params) => {
    var _a;
    transaction.add(await (0, constants_1.paymentManagerProgram)(connection, wallet)
        .methods.close()
        .accounts({
        paymentManager: (0, pda_1.findPaymentManagerAddress)(params.paymentManagerName),
        collector: (_a = params.collectorId) !== null && _a !== void 0 ? _a : wallet.publicKey,
        closer: wallet.publicKey,
    })
        .instruction());
    return transaction;
};
exports.withClose = withClose;
const withUpdate = async (transaction, connection, wallet, params) => {
    var _a, _b, _c, _d, _e, _f;
    const paymentManagerId = (0, pda_1.findPaymentManagerAddress)(params.paymentManagerName);
    const checkPaymentManager = await (0, common_1.tryGetAccount)(() => (0, accounts_1.getPaymentManager)(connection, paymentManagerId));
    if (!checkPaymentManager) {
        throw `No payment manager found with name ${params.paymentManagerName}`;
    }
    transaction.add(await (0, constants_1.paymentManagerProgram)(connection, wallet)
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
        systemProgram: web3_js_1.SystemProgram.programId,
    })
        .instruction());
    return transaction;
};
exports.withUpdate = withUpdate;
//# sourceMappingURL=transaction.js.map