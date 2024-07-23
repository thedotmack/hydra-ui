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
exports.FractalWalletAdapterImpl = void 0;
const popup_connection_1 = require("@fractalwagmi/popup-connection");
const wallet_adapter_base_1 = require("@solana/wallet-adapter-base");
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
const nonce_1 = require("./nonce");
const UNKNOWN_ERROR_MESSAGE = 'Unknown Error';
const FRACTAL_DOMAIN_HTTPS = 'https://fractal.is';
const APPROVE_PAGE_URL = `${FRACTAL_DOMAIN_HTTPS}/wallet-adapter/approve`;
const SIGN_PAGE_URL = `${FRACTAL_DOMAIN_HTTPS}/wallet-adapter/sign`;
const SIGN_MESSAGE_PAGE_URL = `${FRACTAL_DOMAIN_HTTPS}/wallet-adapter/sign/message`;
const MIN_POPUP_HEIGHT_PX = popup_connection_1.DEFAULT_POPUP_HEIGHT_PX;
const MAX_POPUP_WIDTH_PX = 850;
const LOCAL_STORAGE_KEY_FOR_PUBLIC_KEY = 'RdxqNYxF';
class FractalWalletAdapterImpl {
    constructor() {
        this.popupManager = new popup_connection_1.ConnectionManager(popup_connection_1.Platform.SOLANA_WALLET_ADAPTER);
        this.publicKey = null;
        this.connecting = false;
    }
    getPublicKey() {
        return this.publicKey;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            let resolve;
            let reject;
            const publicKeyInLocalStorage = window.localStorage.getItem(LOCAL_STORAGE_KEY_FOR_PUBLIC_KEY);
            if (publicKeyInLocalStorage) {
                this.publicKey = new web3_js_1.PublicKey(publicKeyInLocalStorage);
                return Promise.resolve();
            }
            const nonce = (0, nonce_1.createNonce)();
            this.popupManager.open({
                nonce,
                url: `${APPROVE_PAGE_URL}/${nonce}`,
            });
            const handleSolanaWalletAdapterApproved = (payload) => {
                if (!(0, popup_connection_1.assertPayloadIsSolanaWalletAdapterApproved)(payload)) {
                    reject(new wallet_adapter_base_1.WalletConnectionError('Malformed payload when setting up connection. ' +
                        'Expected { solanaPublicKey: string } but ' +
                        `received ${JSON.stringify(payload)}`));
                    this.popupManager.close();
                    return;
                }
                try {
                    this.publicKey = new web3_js_1.PublicKey(payload.solanaPublicKey);
                    window.localStorage.setItem(LOCAL_STORAGE_KEY_FOR_PUBLIC_KEY, payload.solanaPublicKey);
                    resolve();
                }
                catch (error) {
                    const publicKeyError = new wallet_adapter_base_1.WalletPublicKeyError(error instanceof Error ? error.message : UNKNOWN_ERROR_MESSAGE, error);
                    reject(publicKeyError);
                }
                this.popupManager.close();
            };
            const handleExplicitDenialByUser = () => {
                reject(new wallet_adapter_base_1.WalletConnectionError('The user denied the connection.'));
                this.popupManager.close();
            };
            const handleClosedByUser = () => {
                reject(new wallet_adapter_base_1.WalletConnectionError('The user denied the connection.'));
                this.popupManager.close();
            };
            this.popupManager.onConnectionUpdated(connection => {
                if (!connection) {
                    return;
                }
                connection.on(popup_connection_1.PopupEvent.SOLANA_WALLET_ADAPTER_APPROVED, handleSolanaWalletAdapterApproved);
                connection.on(popup_connection_1.PopupEvent.SOLANA_WALLET_ADAPTER_DENIED, handleExplicitDenialByUser);
                connection.on(popup_connection_1.PopupEvent.POPUP_CLOSED, handleClosedByUser);
            });
            return new Promise((promiseResolver, promiseRejector) => {
                resolve = promiseResolver;
                reject = promiseRejector;
            });
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.popupManager.tearDown();
            this.publicKey = null;
            window.localStorage.removeItem(LOCAL_STORAGE_KEY_FOR_PUBLIC_KEY);
        });
    }
    signTransaction(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.checkWalletReadiness();
                const result = yield this.signTransactions([transaction]);
                return result[0];
            }
            catch (error) {
                let errorToThrow = error;
                if (!(error instanceof wallet_adapter_base_1.WalletError)) {
                    errorToThrow = new wallet_adapter_base_1.WalletSignTransactionError(error instanceof Error ? error.message : UNKNOWN_ERROR_MESSAGE, error);
                }
                throw errorToThrow;
            }
        });
    }
    signAllTransactions(transactions) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.checkWalletReadiness();
                const result = yield this.signTransactions(transactions);
                return result;
            }
            catch (error) {
                let errorToThrow = error;
                if (!(error instanceof wallet_adapter_base_1.WalletError)) {
                    errorToThrow = new wallet_adapter_base_1.WalletSignTransactionError(error instanceof Error ? error.message : UNKNOWN_ERROR_MESSAGE, error);
                }
                throw errorToThrow;
            }
        });
    }
    signMessage(encodedMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedMessage = new TextDecoder().decode(encodedMessage);
            let resolve;
            let reject;
            const handleMessageSignatureNeededResponse = (payload) => {
                if (!(0, popup_connection_1.assertPayloadIsMessageSignatureNeededResponsePayload)(payload)) {
                    const error = new wallet_adapter_base_1.WalletSignMessageError('Malformed payload when signing message. ' +
                        'Expected { decodedSignature: string } ' +
                        `but received ${JSON.stringify(payload)}`);
                    reject(error);
                    this.popupManager.close();
                    return;
                }
                const encodedSignature = Uint8Array.from(payload.decodedSignature.split(',').map(n => Number(n)));
                resolve(encodedSignature);
                this.popupManager.close();
            };
            const handleClosedOrDeniedByUser = () => {
                reject(new wallet_adapter_base_1.WalletSignMessageError('The user did not approve the message'));
                this.popupManager.close();
            };
            const handleAuthLoaded = () => {
                var _a;
                const payload = {
                    decodedMessage,
                };
                (_a = this.popupManager.getConnection()) === null || _a === void 0 ? void 0 : _a.send({
                    event: popup_connection_1.PopupEvent.MESSAGE_SIGNATURE_NEEDED,
                    payload,
                });
            };
            const nonce = (0, nonce_1.createNonce)();
            this.popupManager.open({
                heightPx: Math.max(MIN_POPUP_HEIGHT_PX, Math.floor(window.innerHeight * 0.8)),
                nonce,
                url: `${SIGN_MESSAGE_PAGE_URL}/${nonce}`,
                widthPx: Math.min(MAX_POPUP_WIDTH_PX, Math.floor(window.innerWidth * 0.8)),
            });
            this.popupManager.onConnectionUpdated(connection => {
                if (!connection) {
                    return;
                }
                connection.on(popup_connection_1.PopupEvent.MESSAGE_SIGNATURE_NEEDED_RESPONSE, handleMessageSignatureNeededResponse);
                connection.on(popup_connection_1.PopupEvent.TRANSACTION_DENIED, handleClosedOrDeniedByUser);
                connection.on(popup_connection_1.PopupEvent.POPUP_CLOSED, handleClosedOrDeniedByUser);
                connection.on(popup_connection_1.PopupEvent.AUTH_LOADED, handleAuthLoaded);
            });
            return new Promise((promiseResolver, promiseRejector) => {
                resolve = promiseResolver;
                reject = promiseRejector;
            });
        });
    }
    signTransactions(transactions) {
        return __awaiter(this, void 0, void 0, function* () {
            let resolve;
            let reject;
            const handleTransactionSignatureNeededResponse = (payload) => {
                if (!(0, popup_connection_1.assertPayloadIsTransactionSignatureNeededResponsePayload)(payload)) {
                    const error = new wallet_adapter_base_1.WalletSignTransactionError('Malformed payload when signing transactions. ' +
                        'Expected { signedB58Transactions: string[] } ' +
                        `but received ${JSON.stringify(payload)}`);
                    reject(error);
                    this.popupManager.close();
                    return;
                }
                const signedTransactions = payload.signedB58Transactions.map(signedB58Transaction => {
                    return web3_js_1.Transaction.from(bs58_1.default.decode(signedB58Transaction));
                });
                resolve(signedTransactions);
                this.popupManager.close();
            };
            const handleClosedOrDeniedByUser = () => {
                reject(new wallet_adapter_base_1.WalletSignTransactionError('The user did not approve the transaction'));
                this.popupManager.close();
            };
            const handleAuthLoaded = () => {
                var _a;
                const payload = {
                    unsignedB58Transactions: transactions.map(t => bs58_1.default.encode(t.serializeMessage())),
                };
                (_a = this.popupManager.getConnection()) === null || _a === void 0 ? void 0 : _a.send({
                    event: popup_connection_1.PopupEvent.TRANSACTION_SIGNATURE_NEEDED,
                    payload,
                });
            };
            const nonce = (0, nonce_1.createNonce)();
            this.popupManager.open({
                heightPx: Math.max(MIN_POPUP_HEIGHT_PX, Math.floor(window.innerHeight * 0.8)),
                nonce,
                url: `${SIGN_PAGE_URL}/${nonce}`,
                widthPx: Math.min(MAX_POPUP_WIDTH_PX, Math.floor(window.innerWidth * 0.8)),
            });
            this.popupManager.onConnectionUpdated(connection => {
                if (!connection) {
                    return;
                }
                connection.on(popup_connection_1.PopupEvent.TRANSACTION_SIGNATURE_NEEDED_RESPONSE, handleTransactionSignatureNeededResponse);
                connection.on(popup_connection_1.PopupEvent.TRANSACTION_DENIED, handleClosedOrDeniedByUser);
                connection.on(popup_connection_1.PopupEvent.POPUP_CLOSED, handleClosedOrDeniedByUser);
                connection.on(popup_connection_1.PopupEvent.AUTH_LOADED, handleAuthLoaded);
            });
            return new Promise((promiseResolver, promiseRejector) => {
                resolve = promiseResolver;
                reject = promiseRejector;
            });
        });
    }
    checkWalletReadiness() {
        if (this.publicKey === null) {
            throw new wallet_adapter_base_1.WalletNotConnectedError('`publicKey` is null. Did you forget to call `.connect()`?');
        }
    }
}
exports.FractalWalletAdapterImpl = FractalWalletAdapterImpl;
//# sourceMappingURL=fractal-wallet-adapter-impl.js.map