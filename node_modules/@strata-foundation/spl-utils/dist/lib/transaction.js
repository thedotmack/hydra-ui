"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAndConfirmWithRetry = exports.awaitTransactionSignatureConfirmation = exports.sendMultipleInstructions = exports.sendInstructions = void 0;
const web3_js_1 = require("@solana/web3.js");
const _1 = require(".");
const anchorError_1 = require("./anchorError");
function promiseAllInOrder(it) {
    return __awaiter(this, void 0, void 0, function* () {
        let ret = [];
        for (const i of it) {
            ret.push(yield i());
        }
        return ret;
    });
}
function sendInstructions(idlErrors, provider, instructions, signers, payer = provider.wallet.publicKey, commitment = "confirmed") {
    return __awaiter(this, void 0, void 0, function* () {
        let tx = new web3_js_1.Transaction();
        tx.recentBlockhash = (yield provider.connection.getRecentBlockhash()).blockhash;
        tx.feePayer = payer || provider.wallet.publicKey;
        tx.add(...instructions);
        if (signers.length > 0) {
            tx.partialSign(...signers);
        }
        tx = yield provider.wallet.signTransaction(tx);
        try {
            const { txid } = yield sendAndConfirmWithRetry(provider.connection, tx.serialize(), {
                skipPreflight: true,
            }, commitment);
            return txid;
        }
        catch (e) {
            console.error(e);
            const wrappedE = anchorError_1.ProgramError.parse(e, idlErrors);
            throw wrappedE == null ? e : wrappedE;
        }
    });
}
exports.sendInstructions = sendInstructions;
function truthy(value) {
    return !!value;
}
function sendMultipleInstructions(idlErrors, provider, instructionGroups, signerGroups, payer, finality = "confirmed") {
    return __awaiter(this, void 0, void 0, function* () {
        const recentBlockhash = (yield provider.connection.getRecentBlockhash("confirmed")).blockhash;
        const txns = instructionGroups
            .map((instructions, index) => {
            const signers = signerGroups[index];
            if (instructions.length > 0) {
                console.log(provider.wallet.publicKey.toBase58(), payer === null || payer === void 0 ? void 0 : payer.toBase58());
                const tx = new web3_js_1.Transaction({
                    feePayer: payer || provider.wallet.publicKey,
                    recentBlockhash,
                });
                tx.add(...instructions);
                if (signers.length > 0) {
                    tx.partialSign(...signers);
                }
                return tx;
            }
        })
            .filter(truthy);
        const txnsSigned = (yield provider.wallet.signAllTransactions(txns)).map((tx) => tx.serialize());
        console.log("Sending multiple transactions...");
        try {
            return yield promiseAllInOrder(txnsSigned.map((txn) => () => __awaiter(this, void 0, void 0, function* () {
                const { txid } = yield sendAndConfirmWithRetry(provider.connection, txn, {
                    skipPreflight: true,
                }, finality);
                return txid;
            })));
        }
        catch (e) {
            console.error(e);
            const wrappedE = anchorError_1.ProgramError.parse(e, idlErrors);
            throw wrappedE == null ? e : wrappedE;
        }
    });
}
exports.sendMultipleInstructions = sendMultipleInstructions;
function getUnixTime() {
    return new Date().valueOf() / 1000;
}
const awaitTransactionSignatureConfirmation = (txid, timeout, connection, commitment = "recent", queryStatus = false) => __awaiter(void 0, void 0, void 0, function* () {
    let done = false;
    let status = {
        slot: 0,
        confirmations: 0,
        err: null,
    };
    let subId = 0;
    status = yield new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        setTimeout(() => {
            if (done) {
                return;
            }
            done = true;
            console.log("Rejecting for timeout...");
            reject({ timeout: true });
        }, timeout);
        try {
            console.log("COMMIMENT", commitment);
            subId = connection.onSignature(txid, (result, context) => {
                done = true;
                status = {
                    err: result.err,
                    slot: context.slot,
                    confirmations: 0,
                };
                if (result.err) {
                    console.log("Rejected via websocket", result.err);
                    reject(status);
                }
                else {
                    console.log("Resolved via websocket", result);
                    resolve(status);
                }
            }, commitment);
        }
        catch (e) {
            done = true;
            console.error("WS error in setup", txid, e);
        }
        while (!done && queryStatus) {
            // eslint-disable-next-line no-loop-func
            (() => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const signatureStatuses = yield connection.getSignatureStatuses([
                        txid,
                    ]);
                    status = signatureStatuses && signatureStatuses.value[0];
                    if (!done) {
                        if (!status) {
                            console.log("REST null result for", txid, status);
                        }
                        else if (status.err) {
                            console.log("REST error for", txid, status);
                            done = true;
                            reject(status.err);
                        }
                        else if (!status.confirmations && !status.confirmationStatus) {
                            console.log("REST no confirmations for", txid, status);
                        }
                        else {
                            console.log("REST confirmation for", txid, status);
                            if (!status.confirmationStatus || status.confirmationStatus ==
                                commitment) {
                                done = true;
                                resolve(status);
                            }
                        }
                    }
                }
                catch (e) {
                    if (!done) {
                        console.log("REST connection error: txid", txid, e);
                    }
                }
            }))();
            yield (0, _1.sleep)(2000);
        }
    }));
    //@ts-ignore
    if (connection._signatureSubscriptions && connection._signatureSubscriptions[subId]) {
        connection.removeSignatureListener(subId);
    }
    done = true;
    console.log("Returning status ", status);
    return status;
});
exports.awaitTransactionSignatureConfirmation = awaitTransactionSignatureConfirmation;
function simulateTransaction(connection, transaction, commitment) {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore
        transaction.recentBlockhash = yield connection._recentBlockhash(
        // @ts-ignore
        connection._disableBlockhashCaching);
        const signData = transaction.serializeMessage();
        // @ts-ignore
        const wireTransaction = transaction._serialize(signData);
        const encodedTransaction = wireTransaction.toString("base64");
        const config = { encoding: "base64", commitment };
        const args = [encodedTransaction, config];
        // @ts-ignore
        const res = yield connection._rpcRequest("simulateTransaction", args);
        if (res.error) {
            throw new Error("failed to simulate transaction: " + res.error.message);
        }
        return res.result;
    });
}
const DEFAULT_TIMEOUT = 3 * 60 * 1000; // 3 minutes
/*
  A validator has up to 120s to accept the transaction and send it into a block.
  If it doesn’t happen within that timeframe, your transaction is dropped and you’ll need
  to send the transaction again. You can get the transaction signature and periodically
  Ping the network for that transaction signature. If you never get anything back,
  that means it’s definitely been dropped. If you do get a response back, you can keep pinging
  until it’s gone to a confirmed status to move on.
*/
function sendAndConfirmWithRetry(connection, txn, sendOptions, commitment, timeout = DEFAULT_TIMEOUT) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let done = false;
        let slot = 0;
        const txid = yield connection.sendRawTransaction(txn, sendOptions);
        const startTime = getUnixTime();
        (() => __awaiter(this, void 0, void 0, function* () {
            while (!done && getUnixTime() - startTime < timeout) {
                yield connection.sendRawTransaction(txn, sendOptions);
                yield (0, _1.sleep)(500);
            }
        }))();
        try {
            const confirmation = yield (0, exports.awaitTransactionSignatureConfirmation)(txid, timeout, connection, commitment, true);
            if (!confirmation)
                throw new Error("Timed out awaiting confirmation on transaction");
            if (confirmation.err) {
                const tx = yield connection.getTransaction(txid);
                console.error((_b = (_a = tx === null || tx === void 0 ? void 0 : tx.meta) === null || _a === void 0 ? void 0 : _a.logMessages) === null || _b === void 0 ? void 0 : _b.join("\n"));
                console.error(confirmation.err);
                throw new Error("Transaction failed: Custom instruction error");
            }
            slot = (confirmation === null || confirmation === void 0 ? void 0 : confirmation.slot) || 0;
        }
        catch (err) {
            console.error("Timeout Error caught", err);
            if (err.timeout) {
                throw new Error("Timed out awaiting confirmation on transaction");
            }
            let simulateResult = null;
            try {
                simulateResult = (yield simulateTransaction(connection, web3_js_1.Transaction.from(txn), "single")).value;
            }
            catch (e) { }
            if (simulateResult && simulateResult.err) {
                if (simulateResult.logs) {
                    console.error(simulateResult.logs.join("\n"));
                }
            }
            if (err.err) {
                throw err.err;
            }
            throw err;
        }
        finally {
            done = true;
        }
        console.log("Latency", txid, getUnixTime() - startTime);
        return { txid };
    });
}
exports.sendAndConfirmWithRetry = sendAndConfirmWithRetry;
//# sourceMappingURL=transaction.js.map