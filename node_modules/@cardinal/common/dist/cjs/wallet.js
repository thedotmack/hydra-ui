"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emptyWallet = void 0;
const tslib_1 = require("tslib");
/**
 * A utility for creating a wallet interface given a publicKey. This can be used when a wallet parameter is required but it will not need to sign
 * @param publicKey
 * @returns A wallet interface with empty sign methods
 */
const emptyWallet = (publicKey) => ({
    signTransaction: (tx) => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return new Promise(() => tx); }),
    signAllTransactions: (txs) => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return new Promise(() => txs); }),
    publicKey: publicKey,
});
exports.emptyWallet = emptyWallet;
//# sourceMappingURL=wallet.js.map