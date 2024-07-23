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
exports.XDEFIWalletAdapter = exports.XDEFIWalletName = void 0;
const wallet_adapter_base_1 = require("@solana/wallet-adapter-base");
const web3_js_1 = require("@solana/web3.js");
exports.XDEFIWalletName = 'XDEFI';
class XDEFIWalletAdapter extends wallet_adapter_base_1.BaseMessageSignerWalletAdapter {
    constructor(config = {}) {
        super();
        this.name = exports.XDEFIWalletName;
        this.url = 'https://xdefi.io';
        this.icon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE0LjI2MjggMTMuNDAxM0MxMi40MjI4IDE0LjUzMDcgOS45NTk5NyAxNS4xMTI0IDcuNDY1NjkgMTQuOTg4MUM1LjM2ODU1IDE0Ljg4NjUgMy42NDg1NSAxNC4xNDExIDIuNjA4NTUgMTIuOTE1N0MxLjY5NDI2IDExLjgyMDEgMS4zMzk5OCAxMC4zNzQ1IDEuNTc5OTggOC43MTE0M0MxLjY2MTMyIDguMTU4NzQgMS44MjgwMiA3LjYyMTY2IDIuMDc0MjYgNy4xMTg5NkwyLjEwODU1IDcuMDQ4MzdDMi45NzE4IDUuNDA1OTUgNC4yNTI5MyA0LjAxMzk3IDUuODI1ODQgMy4wMDk0MkM3LjM5ODc1IDIuMDA0ODYgOS4yMDkyNCAxLjQyMjM2IDExLjA3OTEgMS4zMTkyNEMxMi45NDkgMS4yMTYxMSAxNC44MTM4IDEuNTk1OTIgMTYuNDkwMSAyLjQyMTI4QzE4LjE2NjMgMy4yNDY2NSAxOS41OTYyIDQuNDg5MTIgMjAuNjM5IDYuMDI2NDFDMjEuNjgxOSA3LjU2MzcxIDIyLjMwMTcgOS4zNDI4NSAyMi40Mzc0IDExLjE4ODdDMjIuNTczMiAxMy4wMzQ2IDIyLjIyMDMgMTQuODgzNiAyMS40MTM0IDE2LjU1MzhDMjAuNjA2NSAxOC4yMjQgMTkuMzczNSAxOS42NTc3IDE3LjgzNTYgMjAuNzE0QzE2LjI5NzggMjEuNzcwMiAxNC41MDgxIDIyLjQxMjYgMTIuNjQyOCAyMi41Nzc4TDEyLjc1NzEgMjMuODczOEMxNC44NTE0IDIzLjY4OTQgMTYuODYxIDIyLjk2OTEgMTguNTg3OCAyMS43ODM3QzIwLjMxNDcgMjAuNTk4NCAyMS42OTkzIDE4Ljk4ODkgMjIuNjA1MiAxNy4xMTM4QzIzLjUxMTEgMTUuMjM4NyAyMy45MDcxIDEzLjE2MjcgMjMuNzU0MiAxMS4wOTA0QzIzLjYwMTIgOS4wMTgwOCAyMi45MDQ2IDcuMDIwODggMjEuNzMyOSA1LjI5NTU1QzIwLjU2MTMgMy41NzAyMiAxOC45NTUgMi4xNzYzIDE3LjA3MjQgMS4yNTExMUMxNS4xODk4IDAuMzI1OTA5IDEzLjA5NTcgLTAuMDk4NjQxMSAxMC45OTY1IDAuMDE5Mjc4N0M4Ljg5NzMzIDAuMTM3MTk4IDYuODY1NDQgMC43OTM1MiA1LjEwMTAyIDEuOTIzNTlDMy4zMzY2IDMuMDUzNjUgMS45MDA1MyA0LjYxODQ4IDAuOTM0MjY0IDYuNDYzOUwwLjg4ODU0OCA2LjU1NzA3QzAuNTgzMDgzIDcuMTgwOSAwLjM3Njg0NyA3Ljg0NzU2IDAuMjc3MTIgOC41MzM1NEMtMC4wMDg1OTQ1IDEwLjU2MDggMC40MzQyNiAxMi4zNjUxIDEuNTkxNCAxMy43NTQyQzIuODU3MTIgMTUuMjczMyA0LjkxNzEyIDE2LjE3NjggNy4zODg1NSAxNi4yOTU0QzEwLjM5NzEgMTYuNDQ1MSAxMy4zODg1IDE1LjYzNDcgMTUuNTExNCAxNC4xNDM5TDE0LjI2MjggMTMuNDAxM1oiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xNi43OCAxNC44NzUxQzE1LjU4MjkgMTUuOTAyOSAxMi44IDE3Ljc2NjQgOC4xODI4NiAxOC4wMjA1QzMuMDE0MjkgMTguMzAyOSAwLjg2MDAwMSAxNi42NDI3IDAuODQwMDAxIDE2LjYyNTdMMC40MjI4NTYgMTcuMTMzOUwwLjg0Mjg1NiAxNi42MzQyTDAgMTcuNjMzN0MwLjA5MTQyODYgMTcuNzA5OSAyLjE1NzE0IDE5LjM1ODkgNy4wMDg1NyAxOS4zNTg5QzcuNDA1NzEgMTkuMzU4OSA3LjgyMjg2IDE5LjM1ODkgOC4yNTcxNCAxOS4zMjVDMTMuODM3MSAxOS4wMTcyIDE2LjkwMjkgMTYuNjExNiAxNy45NzE0IDE1LjU4MzhMMTYuNzggMTQuODc1MVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xOS4wMiAxNi4yMTkyQzE4LjMxMjEgMTcuMTM4NyAxNy40NDA4IDE3LjkyMzMgMTYuNDQ4NiAxOC41MzQ1QzEyLjk1MTUgMjAuNzY1IDguNTAyODkgMjEuMDUzIDUuMzg4NiAyMC44OTc4TDUuMzIyODkgMjIuMTk5NEM1Ljg0NTc1IDIyLjIyNDggNi4zNDg2MSAyMi4yMzYxIDYuODM3MTggMjIuMjM2MUMxNS42MiAyMi4yMzYxIDE5LjE2ODYgMTguMjgzMiAyMC4xNiAxNi44NzE0TDE5LjAxNzIgMTYuMjA3OSIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTE4LjY4NTcgMTEuMjkyMkMxOS4yNjggMTEuMjkyMiAxOS43NCAxMC44MjU3IDE5Ljc0IDEwLjI1MDNDMTkuNzQgOS42NzQ4OSAxOS4yNjggOS4yMDg0MiAxOC42ODU3IDkuMjA4NDJDMTguMTAzNCA5LjIwODQyIDE3LjYzMTQgOS42NzQ4OSAxNy42MzE0IDEwLjI1MDNDMTcuNjMxNCAxMC44MjU3IDE4LjEwMzQgMTEuMjkyMiAxOC42ODU3IDExLjI5MjJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K';
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
                var _a, _b;
                if ((_b = (_a = window.xfi) === null || _a === void 0 ? void 0 : _a.solana) === null || _b === void 0 ? void 0 : _b.isXDEFI) {
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
                const wallet = window.xfi.solana;
                if (!wallet.isConnected) {
                    try {
                        yield wallet.connect();
                    }
                    catch (error) {
                        throw new wallet_adapter_base_1.WalletConnectionError(error === null || error === void 0 ? void 0 : error.message, error);
                    }
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
    signTransaction(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                if (!wallet)
                    throw new wallet_adapter_base_1.WalletNotConnectedError();
                try {
                    return (yield wallet.signTransaction(transaction)) || transaction;
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
                    return (yield wallet.signAllTransactions(transactions)) || transactions;
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
                    const { signature } = yield wallet.signMessage(message);
                    return signature;
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
exports.XDEFIWalletAdapter = XDEFIWalletAdapter;
//# sourceMappingURL=adapter.js.map