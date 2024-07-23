import { __awaiter } from "tslib";
import { web3 } from "@project-serum/anchor";
export const signAndSendTransaction = (connection, wallet, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!wallet)
        throw new Error("Wallet not connected");
    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (yield connection.getRecentBlockhash("max")).blockhash;
    yield wallet.signTransaction(transaction);
    let txid = null;
    txid = yield web3.sendAndConfirmRawTransaction(connection, transaction.serialize());
    return txid;
});
export const withSleep = (fn, sleep = 2000) => __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise((r) => setTimeout(r, sleep));
    yield fn();
});
//# sourceMappingURL=transactions.js.map