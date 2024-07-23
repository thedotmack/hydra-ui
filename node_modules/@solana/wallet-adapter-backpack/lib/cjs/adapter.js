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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackpackWalletAdapter = exports.BackpackWalletName = void 0;
const wallet_adapter_base_1 = require("@solana/wallet-adapter-base");
const web3_js_1 = require("@solana/web3.js");
exports.BackpackWalletName = 'Backpack';
class BackpackWalletAdapter extends wallet_adapter_base_1.BaseMessageSignerWalletAdapter {
    constructor(config = {}) {
        super();
        this.name = exports.BackpackWalletName;
        this.url = 'https://backpack.app';
        this.icon = 'data:image/png;base64,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';
        this.supportedTransactionVersions = null;
        this._readyState = typeof window === 'undefined' || typeof document === 'undefined'
            ? wallet_adapter_base_1.WalletReadyState.Unsupported
            : wallet_adapter_base_1.WalletReadyState.NotDetected;
        this._disconnected = () => {
            const wallet = this._wallet;
            if (wallet) {
                wallet.off('disconnect', this._disconnected);
                this._wallet = null;
                this._publicKey = null;
                this.emit('error', new wallet_adapter_base_1.WalletDisconnectedError());
                this.emit('disconnect');
            }
        };
        this._connecting = false;
        this._wallet = null;
        this._publicKey = null;
        if (this._readyState !== wallet_adapter_base_1.WalletReadyState.Unsupported) {
            (0, wallet_adapter_base_1.scopePollingDetectionStrategy)(() => {
                var _a;
                if ((_a = window.backpack) === null || _a === void 0 ? void 0 : _a.isBackpack) {
                    this._readyState = wallet_adapter_base_1.WalletReadyState.Installed;
                    this.emit('readyStateChange', this._readyState);
                    return true;
                }
                return false;
            });
        }
    }
    get publicKey() {
        return this._publicKey;
    }
    get connecting() {
        return this._connecting;
    }
    get connected() {
        var _a;
        return !!((_a = this._wallet) === null || _a === void 0 ? void 0 : _a.isConnected);
    }
    get readyState() {
        return this._readyState;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.connected || this.connecting)
                    return;
                if (this._readyState !== wallet_adapter_base_1.WalletReadyState.Installed)
                    throw new wallet_adapter_base_1.WalletNotReadyError();
                this._connecting = true;
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const wallet = window.backpack;
                try {
                    yield wallet.connect();
                }
                catch (error) {
                    throw new wallet_adapter_base_1.WalletConnectionError(error === null || error === void 0 ? void 0 : error.message, error);
                }
                if (!wallet.publicKey)
                    throw new wallet_adapter_base_1.WalletAccountError();
                let publicKey;
                try {
                    publicKey = new web3_js_1.PublicKey(wallet.publicKey.toBytes());
                }
                catch (error) {
                    throw new wallet_adapter_base_1.WalletPublicKeyError(error === null || error === void 0 ? void 0 : error.message, error);
                }
                wallet.on('disconnect', this._disconnected);
                this._wallet = wallet;
                this._publicKey = publicKey;
                this.emit('connect', publicKey);
            }
            catch (error) {
                this.emit('error', error);
                throw error;
            }
            finally {
                this._connecting = false;
            }
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = this._wallet;
            if (wallet) {
                wallet.off('disconnect', this._disconnected);
                this._wallet = null;
                this._publicKey = null;
                try {
                    yield wallet.disconnect();
                }
                catch (error) {
                    this.emit('error', new wallet_adapter_base_1.WalletDisconnectionError(error === null || error === void 0 ? void 0 : error.message, error));
                }
            }
            this.emit('disconnect');
        });
    }
    sendTransaction(transaction, connection, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                if (!wallet)
                    throw new wallet_adapter_base_1.WalletNotConnectedError();
                const { signers } = options, sendOptions = __rest(options, ["signers"]);
                try {
                    return yield wallet.send(transaction, signers, sendOptions, connection, this.publicKey);
                }
                catch (error) {
                    throw new wallet_adapter_base_1.WalletSendTransactionError(error === null || error === void 0 ? void 0 : error.message, error);
                }
            }
            catch (error) {
                this.emit('error', error);
                throw error;
            }
        });
    }
    signTransaction(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                if (!wallet)
                    throw new wallet_adapter_base_1.WalletNotConnectedError();
                try {
                    return (yield wallet.signTransaction(transaction, this.publicKey));
                }
                catch (error) {
                    throw new wallet_adapter_base_1.WalletSignTransactionError(error === null || error === void 0 ? void 0 : error.message, error);
                }
            }
            catch (error) {
                this.emit('error', error);
                throw error;
            }
        });
    }
    signAllTransactions(transactions) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                if (!wallet)
                    throw new wallet_adapter_base_1.WalletNotConnectedError();
                try {
                    return (yield wallet.signAllTransactions(transactions, this.publicKey));
                }
                catch (error) {
                    throw new wallet_adapter_base_1.WalletSignTransactionError(error === null || error === void 0 ? void 0 : error.message, error);
                }
            }
            catch (error) {
                this.emit('error', error);
                throw error;
            }
        });
    }
    signMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                if (!wallet)
                    throw new wallet_adapter_base_1.WalletNotConnectedError();
                try {
                    return yield wallet.signMessage(message, this.publicKey);
                }
                catch (error) {
                    throw new wallet_adapter_base_1.WalletSignMessageError(error === null || error === void 0 ? void 0 : error.message, error);
                }
            }
            catch (error) {
                this.emit('error', error);
                throw error;
            }
        });
    }
}
exports.BackpackWalletAdapter = BackpackWalletAdapter;
//# sourceMappingURL=adapter.js.map