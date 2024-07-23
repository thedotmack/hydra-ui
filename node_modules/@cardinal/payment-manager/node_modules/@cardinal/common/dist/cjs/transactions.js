"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.executeTransactions = exports.executeTransaction = exports.withFindOrInitAssociatedTokenAccount = void 0;
const tslib_1 = require("tslib");
const splToken = tslib_1.__importStar(require("@solana/spl-token"));
const web3_js_1 = require("@solana/web3.js");
const utils_1 = require("./utils");
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
function withFindOrInitAssociatedTokenAccount(transaction, connection, mint, owner, payer, allowOwnerOffCurve) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const associatedAddress = yield splToken.getAssociatedTokenAddress(mint, owner, allowOwnerOffCurve);
        const account = yield connection.getAccountInfo(associatedAddress);
        if (!account) {
            transaction.add(splToken.createAssociatedTokenAccountInstruction(payer, associatedAddress, owner, mint));
        }
        return associatedAddress;
    });
}
exports.withFindOrInitAssociatedTokenAccount = withFindOrInitAssociatedTokenAccount;
function executeTransaction(connection, tx, wallet, config) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        tx.recentBlockhash = (yield connection.getLatestBlockhash()).blockhash;
        tx.feePayer = wallet.publicKey;
        yield wallet.signTransaction(tx);
        if (config === null || config === void 0 ? void 0 : config.signers) {
            tx.partialSign(...((_a = config === null || config === void 0 ? void 0 : config.signers) !== null && _a !== void 0 ? _a : []));
        }
        try {
            const txid = yield (0, web3_js_1.sendAndConfirmRawTransaction)(connection, tx.serialize());
            return txid;
        }
        catch (e) {
            if (!(config === null || config === void 0 ? void 0 : config.silent)) {
                (0, exports.handleError)(e);
            }
            throw e;
        }
    });
}
exports.executeTransaction = executeTransaction;
function executeTransactions(connection, txs, wallet, config) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const latestBlockhash = (yield connection.getLatestBlockhash()).blockhash;
        const signedTxs = yield wallet.signAllTransactions(txs.map((tx) => {
            var _a;
            tx.recentBlockhash = latestBlockhash;
            tx.feePayer = wallet.publicKey;
            if (config === null || config === void 0 ? void 0 : config.signers) {
                tx.partialSign(...((_a = config === null || config === void 0 ? void 0 : config.signers) !== null && _a !== void 0 ? _a : []));
            }
            return tx;
        }));
        const batchedTxs = (0, utils_1.chunkArray)(signedTxs, (_a = config === null || config === void 0 ? void 0 : config.batchSize) !== null && _a !== void 0 ? _a : signedTxs.length);
        const txids = [];
        for (let i = 0; i < batchedTxs.length; i++) {
            const batch = batchedTxs[i];
            if (batch) {
                const batchTxids = yield Promise.all(batch.map((tx) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    try {
                        const txid = yield (0, web3_js_1.sendAndConfirmRawTransaction)(connection, tx.serialize());
                        return txid;
                    }
                    catch (e) {
                        if (config === null || config === void 0 ? void 0 : config.errorHandler) {
                            return config === null || config === void 0 ? void 0 : config.errorHandler(e);
                        }
                        (0, exports.handleError)(e);
                        return null;
                    }
                })));
                txids.push(...batchTxids);
            }
        }
        return txids;
    });
}
exports.executeTransactions = executeTransactions;
const handleError = (e) => {
    var _a;
    const message = (_a = e.message) !== null && _a !== void 0 ? _a : "";
    const logs = e.logs;
    if (logs) {
        console.log(logs, message);
    }
    else {
        console.log(e, message);
    }
};
exports.handleError = handleError;
//# sourceMappingURL=transactions.js.map