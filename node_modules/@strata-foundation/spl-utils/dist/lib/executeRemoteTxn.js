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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAndSignRemoteTxns = exports.executeTxnsInOrder = exports.signOnlyNeeded = exports.executeRemoteTxn = void 0;
const web3_js_1 = require("@solana/web3.js");
const anchorError_1 = require("./anchorError");
const axios_1 = __importDefault(require("axios"));
const transaction_1 = require("./transaction");
function promiseAllInOrder(it) {
    return __awaiter(this, void 0, void 0, function* () {
        let ret = [];
        for (const i of it) {
            ret.push(yield i());
        }
        return ret;
    });
}
/**
 * Execute transactions from a remote server (either single or multiple transactions)
 * @param provider
 * @param url
 * @param body
 * @param errors
 * @returns
 */
function executeRemoteTxn(provider, url, body, errors = new Map()) {
    return __awaiter(this, void 0, void 0, function* () {
        const txnsToExec = yield getAndSignRemoteTxns(provider, url, body);
        return executeTxnsInOrder(provider, txnsToExec, errors);
    });
}
exports.executeRemoteTxn = executeRemoteTxn;
function signOnlyNeeded(provider, rawTxns) {
    return __awaiter(this, void 0, void 0, function* () {
        const txns = rawTxns.map((t) => web3_js_1.Transaction.from(t));
        const needToSign = txns.filter((tx) => tx.signatures.some((sig) => sig.publicKey.equals(provider.wallet.publicKey)));
        const signedTxns = yield provider.wallet.signAllTransactions(needToSign);
        const txnsToExec = txns.map((txn, idx) => {
            const index = needToSign.indexOf(txn);
            if (index >= 0) {
                return signedTxns[index].serialize({
                    requireAllSignatures: false,
                    verifySignatures: false,
                });
            }
            return Buffer.from(rawTxns[idx]);
        });
        return txnsToExec;
    });
}
exports.signOnlyNeeded = signOnlyNeeded;
function executeTxnsInOrder(provider, txns, errors = new Map()) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return [
                ...(yield promiseAllInOrder(txns.map((txn) => () => __awaiter(this, void 0, void 0, function* () {
                    const { txid } = yield (0, transaction_1.sendAndConfirmWithRetry)(provider.connection, txn, {
                        skipPreflight: true,
                    }, "confirmed");
                    return txid;
                })))),
            ];
        }
        catch (e) {
            const wrappedE = anchorError_1.ProgramError.parse(e, errors);
            throw wrappedE == null ? e : wrappedE;
        }
    });
}
exports.executeTxnsInOrder = executeTxnsInOrder;
/**
 * Get and sign transactions from a remote server (either single or multiple transactions)
 * @param provider
 * @param url
 * @param body
 * @param errors
 * @returns
 */
function getAndSignRemoteTxns(provider, url, body) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resp = yield axios_1.default.post(url, body, {
                responseType: "json",
            });
            const rawTxns = Array.isArray(resp.data) ? resp.data : [resp.data];
            return yield signOnlyNeeded(provider, rawTxns.map((t) => t.data));
        }
        catch (e) {
            if ((_b = (_a = e.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) {
                throw new Error(e.response.data.message);
            }
            throw e;
        }
    });
}
exports.getAndSignRemoteTxns = getAndSignRemoteTxns;
//# sourceMappingURL=executeRemoteTxn.js.map