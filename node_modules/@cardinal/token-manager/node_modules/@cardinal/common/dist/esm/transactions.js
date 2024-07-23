import { __awaiter } from "tslib";
import * as splToken from "@solana/spl-token";
import { sendAndConfirmRawTransaction, TransactionMessage, VersionedTransaction, } from "@solana/web3.js";
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
export function withFindOrInitAssociatedTokenAccount(transaction, connection, mint, owner, payer, allowOwnerOffCurve) {
    return __awaiter(this, void 0, void 0, function* () {
        const associatedAddress = yield splToken.getAssociatedTokenAddress(mint, owner, allowOwnerOffCurve);
        const account = yield connection.getAccountInfo(associatedAddress);
        if (!account) {
            transaction.add(splToken.createAssociatedTokenAccountInstruction(payer, associatedAddress, owner, mint));
        }
        return associatedAddress;
    });
}
export function executeTransaction(connection, tx, wallet, config) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const blockhash = (yield connection.getLatestBlockhash()).blockhash;
        const lookupTableAccounts = (config === null || config === void 0 ? void 0 : config.lookupTableIds)
            ? (yield Promise.all((_b = (_a = config === null || config === void 0 ? void 0 : config.lookupTableIds) === null || _a === void 0 ? void 0 : _a.map((lookupTableId) => connection.getAddressLookupTable(lookupTableId))) !== null && _b !== void 0 ? _b : []))
                .map((lut) => lut.value)
                .filter((x) => x !== null)
            : [];
        const messageV0 = new TransactionMessage({
            payerKey: wallet.publicKey,
            recentBlockhash: blockhash,
            instructions: tx.instructions,
        }).compileToV0Message(lookupTableAccounts);
        let transactionV0 = new VersionedTransaction(messageV0);
        transactionV0 = yield wallet.signTransaction(transactionV0);
        if (config === null || config === void 0 ? void 0 : config.signers) {
            transactionV0.sign((_c = config === null || config === void 0 ? void 0 : config.signers) !== null && _c !== void 0 ? _c : []);
        }
        try {
            const txid = yield sendAndConfirmRawTransaction(connection, Buffer.from(transactionV0.serialize()), config === null || config === void 0 ? void 0 : config.confirmOptions);
            return txid;
        }
        catch (e) {
            if (!(config === null || config === void 0 ? void 0 : config.silent)) {
                logError(e);
            }
            throw e;
        }
    });
}
export function executeTransactions(connection, txs, wallet, config) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
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
        const batchedTxs = chunkArray(signedTxs, (_a = config === null || config === void 0 ? void 0 : config.batchSize) !== null && _a !== void 0 ? _a : signedTxs.length);
        const txids = [];
        for (let i = 0; i < batchedTxs.length; i++) {
            const batch = batchedTxs[i];
            if (batch) {
                const batchTxids = yield Promise.all(batch.map((tx) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const txid = yield sendAndConfirmRawTransaction(connection, tx.serialize(), config === null || config === void 0 ? void 0 : config.confirmOptions);
                        return txid;
                    }
                    catch (e) {
                        if (config === null || config === void 0 ? void 0 : config.errorHandler) {
                            return config === null || config === void 0 ? void 0 : config.errorHandler(e);
                        }
                        logError(e);
                        return null;
                    }
                })));
                txids.push(...batchTxids);
            }
        }
        return txids;
    });
}
export function executeTransactionSequence(connection, txs, wallet, config) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const latestBlockhash = (yield connection.getLatestBlockhash()).blockhash;
        const signedTxs = yield wallet.signAllTransactions(txs.flat().map(({ tx, signers }) => {
            tx.recentBlockhash = latestBlockhash;
            tx.feePayer = wallet.publicKey;
            if (signers) {
                tx.partialSign(...signers);
            }
            return tx;
        }));
        const txids = [[]];
        let count = 0;
        for (let i = 0; i < txs.length; i++) {
            const txChunk = txs[i];
            if (!txChunk)
                continue;
            const signedTxBatch = signedTxs.slice(count, count + txChunk.length);
            count += txChunk.length;
            const batchedTxs = chunkArray(signedTxBatch, (_a = config === null || config === void 0 ? void 0 : config.batchSize) !== null && _a !== void 0 ? _a : signedTxBatch.length);
            const allBatchTxids = [];
            for (let j = 0; j < batchedTxs.length; j++) {
                const batch = batchedTxs[j];
                if (batch) {
                    const batchTxids = yield Promise.all(batch.map((tx, k) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            const txid = yield sendAndConfirmRawTransaction(connection, tx.serialize(), config === null || config === void 0 ? void 0 : config.confirmOptions);
                            if (config === null || config === void 0 ? void 0 : config.successHandler) {
                                config === null || config === void 0 ? void 0 : config.successHandler({
                                    count: count + (j + 1) * k,
                                    sequence: i,
                                    sequenceCount: (j + 1) * k,
                                });
                            }
                            return txid;
                        }
                        catch (e) {
                            if (config === null || config === void 0 ? void 0 : config.errorHandler) {
                                return config === null || config === void 0 ? void 0 : config.errorHandler(e, {
                                    count: count + (j + 1) * k,
                                    sequence: i,
                                    sequenceCount: (j + 1) * k,
                                });
                            }
                            logError(e);
                            return null;
                        }
                    })));
                    allBatchTxids.push(...batchTxids);
                }
            }
            txids.push(allBatchTxids);
        }
        return txids;
    });
}
export const logError = (e) => {
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
//# sourceMappingURL=transactions.js.map