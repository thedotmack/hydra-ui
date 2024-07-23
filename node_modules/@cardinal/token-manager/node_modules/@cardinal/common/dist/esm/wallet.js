import { __awaiter } from "tslib";
/**
 * A utility for creating a wallet interface given a publicKey. This can be used when a wallet parameter is required but it will not need to sign
 * @param publicKey
 * @returns A wallet interface with empty sign methods
 */
export const emptyWallet = (publicKey) => ({
    signTransaction: (tx) => __awaiter(void 0, void 0, void 0, function* () { return new Promise(() => tx); }),
    signAllTransactions: (txs) => __awaiter(void 0, void 0, void 0, function* () { return new Promise(() => txs); }),
    publicKey: publicKey,
});
//# sourceMappingURL=wallet.js.map