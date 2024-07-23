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
exports.AlphaWalletAdapter = exports.AlphaWalletName = void 0;
const wallet_adapter_base_1 = require("@solana/wallet-adapter-base");
const web3_js_1 = require("@solana/web3.js");
exports.AlphaWalletName = 'Alpha';
class AlphaWalletAdapter extends wallet_adapter_base_1.BaseMessageSignerWalletAdapter {
    constructor(config = {}) {
        super();
        this.name = exports.AlphaWalletName;
        this.url = 'https://github.com/alphabatem/alpha-wallet';
        this.icon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZpZXdCb3g9IjAgMCAxMDgwIDEwODAiPjxkZWZzPjxzdHlsZT4ua3tmaWxsOiNmZmY7fS5se2ZpbGw6dXJsKCNjKTt9Lm17aXNvbGF0aW9uOmlzb2xhdGU7fS5ue2ZpbGw6dXJsKCNqKTtvcGFjaXR5Oi42Nzt9Lm4sLm97bWl4LWJsZW5kLW1vZGU6bXVsdGlwbHk7fS5ve2ZpbGw6dXJsKCNpKTtvcGFjaXR5Oi40MTt9LnB7ZmlsbDp1cmwoI2YpO30ucXtmaWxsOiMwMGNlN2M7fS5ye2ZpbGw6IzJhN2RlMTt9LnN7ZmlsbDp1cmwoI2cpO30udHtmaWxsOnVybCgjYik7fS51e2ZpbGw6dXJsKCNoKTt9LnZ7ZmlsbDp1cmwoI2QpO30ud3tmaWxsOnVybCgjZSk7fTwvc3R5bGU+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iNjYzLjIyIiB5MT0iMTAuNTIyIiB4Mj0iMzIzLjIwMiIgeTI9IjM1OS4zNzIiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSwgMCwgMCwgMSwgMCwgMCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMyNGNlN2IiLz48c3RvcCBvZmZzZXQ9Ii44MjgiIHN0b3AtY29sb3I9IiMyNTdjZTEiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iYyIgeDE9IjMzNi4zNjgiIHkxPSItOTguMjg5IiB4Mj0iODQzLjk1OSIgeTI9IjI4MC41OCIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxLCAwLCAwLCAxLCAwLCAwKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iLjQ3NiIgc3RvcC1jb2xvcj0iIzI0Y2U3YiIvPjxzdG9wIG9mZnNldD0iLjgyOCIgc3RvcC1jb2xvcj0iIzI1N2NlMSIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJkIiB4MT0iMTk2LjU2NCIgeTE9IjIzMS44OTQiIHgyPSI5MzIuODIyIiB5Mj0iMjMxLjg5NCIgeGxpbms6aHJlZj0iI2MiLz48bGluZWFyR3JhZGllbnQgaWQ9ImUiIHgxPSIyMTQuODczIiB5MT0iMjk5LjIwNyIgeDI9IjgwMy44OCIgeTI9IjI5OS4yMDciIHhsaW5rOmhyZWY9IiNjIi8+PGxpbmVhckdyYWRpZW50IGlkPSJmIiB4MT0iMjA2LjM4NiIgeTE9IjkzNi4yMDIiIHgyPSI3ODUuNjY0IiB5Mj0iNjMzLjA3IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEsIDAsIDAsIDEsIDAsIDApIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIuMzY3IiBzdG9wLWNvbG9yPSIjMjU3Y2UxIi8+PHN0b3Agb2Zmc2V0PSIuODUiIHN0b3AtY29sb3I9IiMyNGNlN2IiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjIwNC42MTEiIHkxPSI5NTcuMDQzIiB4Mj0iODEyLjQzNiIgeTI9IjYzOC45NzMiIHhsaW5rOmhyZWY9IiNjIi8+PGxpbmVhckdyYWRpZW50IGlkPSJoIiB4MT0iNTc0LjY4NCIgeTE9IjY3NS43MjMiIHgyPSI1NzkuMDU1IiB5Mj0iNjczLjQzNSIgeGxpbms6aHJlZj0iI2MiLz48bGluZWFyR3JhZGllbnQgaWQ9ImkiIHgxPSIxMDQyLjA3IiB5MT0iMTMwOC4zMyIgeDI9IjgzOC43NzciIHkyPSIxNzQ1LjYzIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKC01NDAuMTUxIC02MzEuNDg1KSByb3RhdGUoLjM5KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2ZmZiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwMCIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJqIiB4MT0iMjEzOTcuNjU1IiB5MT0iMTE2MC4zOTIiIHgyPSIyMTE5MS4xNjMiIHkyPSIxNjA0LjU3MyIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgyMTk3My43NjggLTYzMS40ODUpIHJvdGF0ZSgxNzkuNjEpIHNjYWxlKDEgLTEpIiB4bGluazpocmVmPSIjaSIvPjwvZGVmcz48ZyBjbGFzcz0ibSI+PGcgaWQ9ImEiPjxnPjxnPjxwYXRoIGNsYXNzPSJxIiBkPSJNNTY5LjYyMSw1NDAuMTMxYzQ3LjkzNiwxMDQuNTE0LDk1Ljg3MywyMDkuMDI4LDE0My44MDksMzEzLjU0M2wtMjAyLjcxOSwuMjU4YzE1LjExNCwzNC4xNzUsMzAuMjI5LDY4LjM1LDQ1LjM0MywxMDIuNTI0bDMxNS4zNzIsLjM5OWMtNjYuNDg4LTE0Ni40NTMtMTMyLjk3NS0yOTIuOTA2LTE5OS40NjMtNDM5LjM2LS4wMjEtNjUuOTI5LS4wNDMtMTMxLjg1Ny0uMDY0LTE5Ny43ODYtMzQuMTM2LDE0LjQ0NS02OC4yNzIsMjguODkxLTEwMi40MDgsNDMuMzM2LC4wNDMsNTkuMDI4LC4wODYsMTE4LjA1NywuMTI5LDE3Ny4wODVaIi8+PHBhdGggY2xhc3M9ImsiIGQ9Ik0zNTQuODc0LDg1My41NDVjNDIuMTMyLTEwNC44NTgsODQuMjY1LTIwOS43MTYsMTI2LjM5Ny0zMTQuNTc0LS4wODYtNTguNjQyLS4xNzItMTE3LjI4My0uMjU4LTE3NS45MjQtMzQuMTc5LTE0LjY4Mi02OC4zNTgtMjkuMzY0LTEwMi41MzctNDQuMDQ2LC40Myw2Ni4wNTgsLjg2LDEzMi4xMTUsMS4yOSwxOTguMTczbC0xNzkuNDA3LDQzOS42ODJjMTE4LjU3My0uMTI5LDIzNy4xNDUtLjI1OCwzNTUuNzE4LS4zODctMTUuMDQ3LTM0LjE3OS0zMC4wOTUtNjguMzU4LTQ1LjE0Mi0xMDIuNTM3LTUyLjAyMS0uMTI5LTEwNC4wNDEtLjI1OC0xNTYuMDYyLS4zODdaIi8+PGNpcmNsZSBjbGFzcz0idCIgY3g9IjUyMS40NTgiIGN5PSIxNTUuOTY2IiByPSIzOC43NzIiLz48Y2lyY2xlIGNsYXNzPSJsIiBjeD0iNjU1LjM2NCIgY3k9IjEzOS44MTEiIHI9IjYxLjkyNyIvPjxjaXJjbGUgY2xhc3M9InYiIGN4PSI1ODEuNTkiIGN5PSIyMzEuODk0IiByPSIyOS42MTciLz48Y2lyY2xlIGNsYXNzPSJ3IiBjeD0iNTIyLjg5NCIgY3k9IjI5OS4yMDciIHI9IjIzLjY5NCIvPjxwYXRoIGNsYXNzPSJwIiBkPSJNNTc2LjYxOSw3MzcuNzgxYy0uMzM2LS41OTktMy4zNTctNi4wOS04LjEyNy0xMy4yMTQtMS40MzEtMi4xMzctMy4wNDktNC40NDItNC45MjEtNi45NTItOC43OC0xMS43NjgtNDAuOTY4LTU0LjkxNC02OS45ODctNTEuMDA3LTIuNzY2LC4zNzItNC43MjksLjk3LTYuMzMzLDEuNDgxLTIzLjc1MSw3LjU3Mi0zNC4yNCwzNC41MTUtNDEuMDYsNTEuNTc0LTExLjg0MSwyOS42MTYtMjUuNTM5LDYxLjczMy00Mi4xMzYsMTAwLjMwNSw4NS4zMjcsLjIyOCwxNzAuNjUzLC40NTYsMjU1Ljk4LC42ODQtNTkuOTkzLTU1Ljk4MS04MC4xNTktNzcuMDY1LTgzLjQxNS04Mi44NzFaIi8+PHBhdGggY2xhc3M9InMiIGQ9Ik01MDUuNzc3LDcxNC4zNzljLTEzLjc0Nyw3Ljk5Mi0yNi44OTEsMTEuODU4LTMzLjcwMiwxMy42ODktMTIuNDM0LDMuMzQyLTIzLjIzNCw0LjQ5NC0zMS4wNDUsNC44ODRsLTM2Ljc5Niw4Ny4yNTJjODUuMjY2LC4wNjUsMTcwLjUzMiwuMTI5LDI1NS43OTksLjE5NC0xNC42Ni0zNS45ODQtMjkuMzIxLTcxLjk2OS00My45ODEtMTA3Ljk1NC0xMC41OTgtMjAuNzAyLTIwLjE4NC0zMi4zMTgtMjguNDg4LTM4LjU4NS02LjI4MS00Ljc0LTExLjgyOC02LjQyLTE2LjUyNi02LjY1Ni0uMzQ4LS4wMTgtLjY5Mi0uMDI3LTEuMDMtLjAzLTIwLjc4MS0uMTQ1LTI5LjUwNiwyNy4wMTgtNjQuMjMsNDcuMjA1WiIvPjxwYXRoIGNsYXNzPSJyIiBkPSJNNTM4LjkyNCw5NjguMTgxYzEuNDYzLDAsMS40NjUtMi4yNzMsMC0yLjI3M3MtMS40NjUsMi4yNzMsMCwyLjI3M2gwWiIvPjxsaW5lIGNsYXNzPSJ1IiB4MT0iNTc4LjAwNCIgeTE9IjY3NC42NTQiIHgyPSI1NzUuOTQxIiB5Mj0iNjc0LjM5NiIvPjwvZz48cGF0aCBjbGFzcz0ibyIgZD0iTTM3OS44MzEsNTE3LjEwOWMzMy44MzUsNy4yODcsNjcuNjcsMTQuNTc0LDEwMS41MDUsMjEuODYybC0xMjYuNDUsMzE0LjU2MiwxNTYuMDY2LC4zOTljMTUuMDQ2LDM0LjE3OSwzMC4wOTIsNjguMzU4LDQ1LjEzOCwxMDIuNTM3LTExOC41NzcsLjE1LTIzNy4xNTMsLjMwMS0zNTUuNzMsLjQ1MSw1OS44MjQtMTQ2LjYwNCwxMTkuNjQ4LTI5My4yMDcsMTc5LjQ3MS00MzkuODExWiIvPjxwYXRoIGNsYXNzPSJuIiBkPSJNNjcxLjkyOCw1MTcuNTMyYy0zNC4xMTQsNy41MjktNjguMjI5LDE1LjA1OC0xMDIuMzQzLDIyLjU4Nyw0Ny45NDcsMTA0LjUxNiw5NS44OTQsMjA5LjAzMSwxNDMuODQxLDMxMy41NDctNjcuNDk2LC4wODktMTM0Ljk5MSwuMTc3LTIwMi40ODcsLjI2NiwxNS4wNDksMzQuMTgzLDMwLjA5OSw2OC4zNjcsNDUuMTQ4LDEwMi41NSwxMDUuMTE1LC4xMjYsMjEwLjIzLC4yNTMsMzE1LjM0NSwuMzc5LTY2LjUwMi0xNDYuNDQzLTEzMy4wMDMtMjkyLjg4Ni0xOTkuNTA1LTQzOS4zMjlaIi8+PC9nPjwvZz48L2c+PC9zdmc+';
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
                if ((_a = window.alpha) === null || _a === void 0 ? void 0 : _a.isAlpha) {
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
                const wallet = window.alpha;
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
    sendTransaction(transaction, connection, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = this._wallet;
                if (!wallet)
                    throw new wallet_adapter_base_1.WalletNotConnectedError();
                try {
                    const { signers } = options, sendOptions = __rest(options, ["signers"]);
                    transaction = yield this.prepareTransaction(transaction, connection, sendOptions);
                    (signers === null || signers === void 0 ? void 0 : signers.length) && transaction.partialSign(...signers);
                    sendOptions.preflightCommitment = sendOptions.preflightCommitment || connection.commitment;
                    const { signature } = yield wallet.signAndSendTransaction(transaction, sendOptions);
                    return signature;
                }
                catch (error) {
                    if (error instanceof wallet_adapter_base_1.WalletError)
                        throw error;
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
exports.AlphaWalletAdapter = AlphaWalletAdapter;
//# sourceMappingURL=adapter.js.map