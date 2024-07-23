"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestProvider = exports.newAccountWithLamports = exports.getTestConnection = void 0;
const tslib_1 = require("tslib");
const anchor_1 = require("@project-serum/anchor");
const web3_js_1 = require("@solana/web3.js");
function getTestConnection() {
    const url = "http://127.0.0.1:8899";
    return new web3_js_1.Connection(url, "confirmed");
}
exports.getTestConnection = getTestConnection;
function newAccountWithLamports(connection, lamports = web3_js_1.LAMPORTS_PER_SOL * 10, keypair = web3_js_1.Keypair.generate()) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const account = keypair;
        const signature = yield connection.requestAirdrop(account.publicKey, lamports);
        yield connection.confirmTransaction(signature, "confirmed");
        return account;
    });
}
exports.newAccountWithLamports = newAccountWithLamports;
function getTestProvider() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const connection = getTestConnection();
        const keypair = yield newAccountWithLamports(connection);
        const wallet = new anchor_1.Wallet(keypair);
        return {
            connection,
            wallet,
        };
    });
}
exports.getTestProvider = getTestProvider;
//# sourceMappingURL=workspace.js.map