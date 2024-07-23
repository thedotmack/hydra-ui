"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const popup_connection_1 = require("@fractalwagmi/popup-connection");
const wallet_adapter_base_1 = require("@solana/wallet-adapter-base");
const web3 = __importStar(require("@solana/web3.js"));
const bs58_1 = __importDefault(require("bs58"));
const fractal_wallet_adapter_impl_1 = require("./fractal-wallet-adapter-impl");
const nonce_1 = require("./nonce");
const jest_create_mock_instance_1 = __importDefault(require("jest-create-mock-instance"));
jest.mock('@fractalwagmi/popup-connection');
jest.mock('core/nonce');
const TEST_MESSAGE_STRING = 'arbitrary-message';
const TEST_MESSAGE_UINT8ARRAY = new TextEncoder().encode(TEST_MESSAGE_STRING);
const TEST_TRANSACTION = new web3.Transaction();
const TEST_SERIALIZED_MESSAGE_RETURN = 'foobar';
const TEST_RESOLVED_TRANSACTION = new web3.Transaction();
const TEST_PUBLIC_KEY_INPUT = 'test-public-key';
const TEST_PUBLIC_KEY = new web3.PublicKey([]);
const TEST_NONCE = 'test-nonce';
const FRACTAL_DOMAIN_HTTPS = 'https://fractal.is';
const APPROVE_PAGE_URL = `${FRACTAL_DOMAIN_HTTPS}/wallet-adapter/approve`;
const SIGN_PAGE_URL = `${FRACTAL_DOMAIN_HTTPS}/wallet-adapter/sign`;
const LOCAL_STORAGE_KEY_FOR_PUBLIC_KEY = 'RdxqNYxF';
let mockAssertPayloadIsSolanaWalletAdapterApproved;
let mockAssertPayloadIsTransactionSignatureNeededResponsePayload;
let mockAssertPayloadIsMessageSignatureNeededResponsePayload;
let mockCreateNonce;
let MockConnectionManagerClass;
let mockConnectionManager;
let mockConnection;
let transactionFromSpy;
beforeEach(() => {
    jest
        .spyOn(TEST_TRANSACTION, 'serializeMessage')
        .mockReturnValue(Buffer.from(TEST_SERIALIZED_MESSAGE_RETURN));
    mockAssertPayloadIsSolanaWalletAdapterApproved =
        popup_connection_1.assertPayloadIsSolanaWalletAdapterApproved;
    mockAssertPayloadIsSolanaWalletAdapterApproved.mockReturnValue(true);
    mockAssertPayloadIsTransactionSignatureNeededResponsePayload =
        popup_connection_1.assertPayloadIsTransactionSignatureNeededResponsePayload;
    mockAssertPayloadIsTransactionSignatureNeededResponsePayload.mockReturnValue(true);
    mockAssertPayloadIsMessageSignatureNeededResponsePayload =
        popup_connection_1.assertPayloadIsMessageSignatureNeededResponsePayload;
    mockAssertPayloadIsMessageSignatureNeededResponsePayload.mockReturnValue(true);
    transactionFromSpy = jest.spyOn(web3.Transaction, 'from');
    mockConnection = (0, jest_create_mock_instance_1.default)(popup_connection_1.Connection);
    mockConnectionManager = (0, jest_create_mock_instance_1.default)(popup_connection_1.ConnectionManager);
    mockConnectionManager.getConnection.mockReturnValue(mockConnection);
    MockConnectionManagerClass = popup_connection_1.ConnectionManager;
    MockConnectionManagerClass.mockClear();
    MockConnectionManagerClass.mockImplementation(() => mockConnectionManager);
    mockCreateNonce = nonce_1.createNonce;
    mockCreateNonce.mockReturnValue(TEST_NONCE);
    jest.spyOn(web3, 'PublicKey').mockImplementation(() => TEST_PUBLIC_KEY);
});
afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
});
describe('FractalWalletAdapterImpl', () => {
    let onConnectionUpdatedCallback = () => null;
    let onSolanaWalletAdapterApprovedCallback = () => { };
    let onSolanaWalletAdapterDeniedCallback = () => { };
    let onPopupClosed = () => { };
    let onSignTransactionDeniedCallback = () => { };
    beforeEach(() => {
        mockConnectionManager.onConnectionUpdated.mockImplementation(callback => {
            onConnectionUpdatedCallback = callback;
            return mockConnectionManager;
        });
        mockConnection.on.mockImplementation((event, callback) => {
            if (event === popup_connection_1.PopupEvent.SOLANA_WALLET_ADAPTER_APPROVED) {
                onSolanaWalletAdapterApprovedCallback = callback;
            }
            if (event === popup_connection_1.PopupEvent.SOLANA_WALLET_ADAPTER_DENIED) {
                onSolanaWalletAdapterDeniedCallback = callback;
            }
            if (event === popup_connection_1.PopupEvent.POPUP_CLOSED) {
                onPopupClosed = callback;
            }
            if (event === popup_connection_1.PopupEvent.TRANSACTION_DENIED) {
                onSignTransactionDeniedCallback = callback;
            }
        });
    });
    describe('connect', () => {
        it('should open the approval page when connecting', () => {
            const wallet = new fractal_wallet_adapter_impl_1.FractalWalletAdapterImpl();
            wallet.connect();
            expect(mockConnectionManager.open).toHaveBeenLastCalledWith({
                nonce: TEST_NONCE,
                url: `${APPROVE_PAGE_URL}/${TEST_NONCE}`,
            });
        });
        it('should listen for the SOLANA_WALLET_ADAPTER_APPROVED event', () => {
            const wallet = new fractal_wallet_adapter_impl_1.FractalWalletAdapterImpl();
            wallet.connect();
            onConnectionUpdatedCallback(mockConnection);
            expect(mockConnection.on).toHaveBeenCalledWith(popup_connection_1.PopupEvent.SOLANA_WALLET_ADAPTER_APPROVED, expect.any(Function));
        });
        it('handles user denial of popup', () => __awaiter(void 0, void 0, void 0, function* () {
            const wallet = new fractal_wallet_adapter_impl_1.FractalWalletAdapterImpl();
            const connectP = wallet.connect();
            onConnectionUpdatedCallback(mockConnection);
            onSolanaWalletAdapterDeniedCallback();
            try {
                yield connectP;
            }
            catch (_a) {
            }
            expect(mockConnectionManager.close).toHaveBeenCalled();
            expect(connectP).rejects.toEqual(expect.any(wallet_adapter_base_1.WalletConnectionError));
        }));
        it('handles explicit popup closing by user', () => __awaiter(void 0, void 0, void 0, function* () {
            const wallet = new fractal_wallet_adapter_impl_1.FractalWalletAdapterImpl();
            const connectP = wallet.connect();
            onConnectionUpdatedCallback(mockConnection);
            onPopupClosed();
            try {
                yield connectP;
            }
            catch (_b) {
            }
            expect(mockConnectionManager.close).toHaveBeenCalled();
            expect(connectP).rejects.toEqual(expect.any(wallet_adapter_base_1.WalletConnectionError));
        }));
        it('handles invalid payloads', () => {
            mockAssertPayloadIsSolanaWalletAdapterApproved.mockRestore();
            const wallet = new fractal_wallet_adapter_impl_1.FractalWalletAdapterImpl();
            const connectP = wallet.connect();
            onConnectionUpdatedCallback(mockConnection);
            onSolanaWalletAdapterApprovedCallback({
                someUnknownPayload: 'foobar',
            });
            expect(mockConnectionManager.close).toHaveBeenCalled();
            expect(connectP).rejects.toEqual(expect.any(wallet_adapter_base_1.WalletConnectionError));
        });
        it('handles any wallet public key errors', () => {
            jest.spyOn(web3, 'PublicKey').mockImplementationOnce(() => {
                throw new Error('Some public key error');
            });
            const wallet = new fractal_wallet_adapter_impl_1.FractalWalletAdapterImpl();
            const connectP = wallet.connect();
            onConnectionUpdatedCallback(mockConnection);
            mockAssertPayloadIsSolanaWalletAdapterApproved.mockReturnValue(true);
            onSolanaWalletAdapterApprovedCallback({
                solanaPublicKey: TEST_PUBLIC_KEY_INPUT,
            });
            expect(mockConnectionManager.close).toHaveBeenCalled();
            expect(connectP).rejects.toEqual(expect.any(wallet_adapter_base_1.WalletPublicKeyError));
        });
        it('resolves only after the public key is made available', () => __awaiter(void 0, void 0, void 0, function* () {
            const wallet = new fractal_wallet_adapter_impl_1.FractalWalletAdapterImpl();
            const connectP = wallet.connect();
            onConnectionUpdatedCallback(mockConnection);
            mockAssertPayloadIsSolanaWalletAdapterApproved.mockReturnValue(true);
            onSolanaWalletAdapterApprovedCallback({
                solanaPublicKey: TEST_PUBLIC_KEY_INPUT,
            });
            yield connectP;
            expect(web3.PublicKey).toHaveBeenLastCalledWith(TEST_PUBLIC_KEY_INPUT);
            expect(wallet.getPublicKey()).toBe(TEST_PUBLIC_KEY);
            expect(mockConnectionManager.close).toHaveBeenCalled();
        }));
        it('stores the public key in localStorage', () => __awaiter(void 0, void 0, void 0, function* () {
            const wallet = new fractal_wallet_adapter_impl_1.FractalWalletAdapterImpl();
            const connectP = wallet.connect();
            onConnectionUpdatedCallback(mockConnection);
            mockAssertPayloadIsSolanaWalletAdapterApproved.mockReturnValue(true);
            onSolanaWalletAdapterApprovedCallback({
                solanaPublicKey: TEST_PUBLIC_KEY_INPUT,
            });
            yield connectP;
            expect(localStorage.setItem).toHaveBeenLastCalledWith(LOCAL_STORAGE_KEY_FOR_PUBLIC_KEY, TEST_PUBLIC_KEY_INPUT);
        }));
        it('removes the public key from localStorage when disconnecting', () => __awaiter(void 0, void 0, void 0, function* () {
            const wallet = new fractal_wallet_adapter_impl_1.FractalWalletAdapterImpl();
            const connectP = wallet.connect();
            onConnectionUpdatedCallback(mockConnection);
            mockAssertPayloadIsSolanaWalletAdapterApproved.mockReturnValue(true);
            onSolanaWalletAdapterApprovedCallback({
                solanaPublicKey: TEST_PUBLIC_KEY_INPUT,
            });
            yield connectP;
            yield wallet.disconnect();
            expect(localStorage.getItem(LOCAL_STORAGE_KEY_FOR_PUBLIC_KEY)).toBeNull();
        }));
        it('auto-initializes connection from existing public key in localStorage', () => __awaiter(void 0, void 0, void 0, function* () {
            var _c;
            localStorage.setItem(LOCAL_STORAGE_KEY_FOR_PUBLIC_KEY, 'D3FXGeV4Vas5FFNaQyoTTWog2oUQai1CH6QTvqoytpvf');
            web3.PublicKey.mockRestore();
            const wallet = new fractal_wallet_adapter_impl_1.FractalWalletAdapterImpl();
            yield wallet.connect();
            expect((_c = wallet.getPublicKey()) === null || _c === void 0 ? void 0 : _c.toString()).toEqual('D3FXGeV4Vas5FFNaQyoTTWog2oUQai1CH6QTvqoytpvf');
        }));
    });
    describe('messages', () => {
        let wallet;
        let onMessageSignatureNeededResponseCallback = () => { };
        let onAuthLoadedCallback = () => { };
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            wallet = new fractal_wallet_adapter_impl_1.FractalWalletAdapterImpl();
            const connectP = wallet.connect();
            onConnectionUpdatedCallback(mockConnection);
            onSolanaWalletAdapterApprovedCallback({
                solanaPublicKey: TEST_PUBLIC_KEY_INPUT,
            });
            return connectP;
        }));
        it('sends a MESSAGE_SIGNATURE_NEEDED event when the popup is ready', () => {
            mockConnectionManager.onConnectionUpdated.mockImplementation(callback => {
                onConnectionUpdatedCallback = callback;
                return mockConnectionManager;
            });
            wallet.signMessage(TEST_MESSAGE_UINT8ARRAY);
            mockConnection.on.mockImplementation((event, callback) => {
                if (event === popup_connection_1.PopupEvent.AUTH_LOADED) {
                    onAuthLoadedCallback = callback;
                }
            });
            onConnectionUpdatedCallback(mockConnection);
            expect(mockConnection.send).not.toHaveBeenCalledWith({
                event: popup_connection_1.PopupEvent.MESSAGE_SIGNATURE_NEEDED,
                payload: expect.objectContaining({
                    decodedMessage: TEST_MESSAGE_STRING,
                }),
            });
            onAuthLoadedCallback();
            expect(mockConnection.send).toHaveBeenLastCalledWith({
                event: popup_connection_1.PopupEvent.MESSAGE_SIGNATURE_NEEDED,
                payload: expect.objectContaining({
                    decodedMessage: TEST_MESSAGE_STRING,
                }),
            });
        });
        it('handles invalid payloads', () => {
            mockAssertPayloadIsMessageSignatureNeededResponsePayload.mockRestore();
            mockConnectionManager.onConnectionUpdated.mockImplementation(callback => {
                onConnectionUpdatedCallback = callback;
                return mockConnectionManager;
            });
            mockConnection.on.mockImplementation((event, callback) => {
                if (event === popup_connection_1.PopupEvent.MESSAGE_SIGNATURE_NEEDED_RESPONSE) {
                    onMessageSignatureNeededResponseCallback = callback;
                }
            });
            const signMessageP = wallet.signMessage(TEST_MESSAGE_UINT8ARRAY);
            onConnectionUpdatedCallback(mockConnection);
            onMessageSignatureNeededResponseCallback({
                someUnsupportedPayload: 'foobar',
            });
            expect(signMessageP).rejects.toEqual(expect.any(wallet_adapter_base_1.WalletSignMessageError));
            expect(mockConnectionManager.close).toHaveBeenCalled();
        });
        it('rejects when the user closes the popup', () => __awaiter(void 0, void 0, void 0, function* () {
            mockConnectionManager.onConnectionUpdated.mockImplementation(callback => {
                onConnectionUpdatedCallback = callback;
                return mockConnectionManager;
            });
            const signMessageP = wallet.signMessage(TEST_MESSAGE_UINT8ARRAY);
            onConnectionUpdatedCallback(mockConnection);
            onPopupClosed();
            try {
                yield signMessageP;
            }
            catch (_a) {
            }
            expect(signMessageP).rejects.toEqual(expect.any(wallet_adapter_base_1.WalletSignMessageError));
            expect(mockConnectionManager.close).toHaveBeenCalled();
        }));
        it('rejects when the user denies the transaction', () => __awaiter(void 0, void 0, void 0, function* () {
            mockConnectionManager.onConnectionUpdated.mockImplementation(callback => {
                onConnectionUpdatedCallback = callback;
                return mockConnectionManager;
            });
            const signMessageP = wallet.signMessage(TEST_MESSAGE_UINT8ARRAY);
            onConnectionUpdatedCallback(mockConnection);
            onSignTransactionDeniedCallback();
            try {
                yield signMessageP;
            }
            catch (_b) {
            }
            expect(signMessageP).rejects.toEqual(expect.any(wallet_adapter_base_1.WalletSignMessageError));
            expect(mockConnectionManager.close).toHaveBeenCalled();
        }));
        it('resolves with the signed signature sent back from the popup', () => __awaiter(void 0, void 0, void 0, function* () {
            mockConnectionManager.close = jest.fn();
            mockConnectionManager.onConnectionUpdated.mockImplementation(callback => {
                onConnectionUpdatedCallback = callback;
                return mockConnectionManager;
            });
            const signMessageP = wallet.signMessage(TEST_MESSAGE_UINT8ARRAY);
            mockConnection.on.mockImplementation((event, callback) => {
                if (event === popup_connection_1.PopupEvent.MESSAGE_SIGNATURE_NEEDED_RESPONSE) {
                    onMessageSignatureNeededResponseCallback = callback;
                }
            });
            onConnectionUpdatedCallback(mockConnection);
            expect(mockConnectionManager.close).not.toHaveBeenCalled();
            onMessageSignatureNeededResponseCallback({
                decodedSignature: '97,98,99',
            });
            const result = yield signMessageP;
            expect(result).toEqual(Uint8Array.from([97, 98, 99]));
            expect(mockConnectionManager.close).toHaveBeenCalled();
        }));
    });
    describe('transactions', () => {
        let wallet;
        let onTransactionSignatureNeededResponseCallback = () => { };
        let onAuthLoadedCallback = () => { };
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            wallet = new fractal_wallet_adapter_impl_1.FractalWalletAdapterImpl();
            const connectP = wallet.connect();
            onConnectionUpdatedCallback(mockConnection);
            onSolanaWalletAdapterApprovedCallback({
                solanaPublicKey: TEST_PUBLIC_KEY_INPUT,
            });
            return connectP;
        }));
        it('checks for wallet readiness', () => {
            wallet = new fractal_wallet_adapter_impl_1.FractalWalletAdapterImpl();
            expect(wallet.signTransaction(TEST_TRANSACTION)).rejects.toEqual(expect.any(wallet_adapter_base_1.WalletNotConnectedError));
        });
        it('opens a popup with a nonce', () => {
            wallet.signTransaction(TEST_TRANSACTION);
            expect(mockConnectionManager.open).toHaveBeenCalledWith(expect.objectContaining({
                nonce: TEST_NONCE,
                url: `${SIGN_PAGE_URL}/${TEST_NONCE}`,
            }));
        });
        it('sends a TRANSACTION_SIGNATURE_NEEDED event when the popup is ready', () => {
            jest
                .spyOn(TEST_TRANSACTION, 'serializeMessage')
                .mockReturnValue(Buffer.from('test-serialized-transaction'));
            mockConnectionManager.onConnectionUpdated.mockImplementation(callback => {
                onConnectionUpdatedCallback = callback;
                return mockConnectionManager;
            });
            wallet.signTransaction(TEST_TRANSACTION);
            mockConnection.on.mockImplementation((event, callback) => {
                if (event === popup_connection_1.PopupEvent.AUTH_LOADED) {
                    onAuthLoadedCallback = callback;
                }
            });
            onConnectionUpdatedCallback(mockConnection);
            expect(mockConnection.send).not.toHaveBeenCalledWith({
                event: popup_connection_1.PopupEvent.TRANSACTION_SIGNATURE_NEEDED,
                payload: expect.objectContaining({
                    unsignedB58Transactions: [expect.any(String)],
                }),
            });
            onAuthLoadedCallback();
            expect(mockConnection.send).toHaveBeenLastCalledWith({
                event: popup_connection_1.PopupEvent.TRANSACTION_SIGNATURE_NEEDED,
                payload: expect.objectContaining({
                    unsignedB58Transactions: [expect.any(String)],
                }),
            });
        });
        it('handles invalid payloads', () => {
            mockAssertPayloadIsTransactionSignatureNeededResponsePayload.mockRestore();
            jest
                .spyOn(TEST_TRANSACTION, 'serializeMessage')
                .mockReturnValue(Buffer.from('test-serialized-transaction'));
            mockConnectionManager.onConnectionUpdated.mockImplementation(callback => {
                onConnectionUpdatedCallback = callback;
                return mockConnectionManager;
            });
            const signTransactionP = wallet.signTransaction(TEST_TRANSACTION);
            onConnectionUpdatedCallback(mockConnection);
            onTransactionSignatureNeededResponseCallback({
                someUnsupportedPayload: 'foobar',
            });
            expect(signTransactionP).rejects.toEqual(expect.any(wallet_adapter_base_1.WalletSignTransactionError));
            expect(mockConnectionManager.close).toHaveBeenCalled();
        });
        it('rejects when the user closes the popup', () => __awaiter(void 0, void 0, void 0, function* () {
            mockConnectionManager.onConnectionUpdated.mockImplementation(callback => {
                onConnectionUpdatedCallback = callback;
                return mockConnectionManager;
            });
            const signTransactionP = wallet.signTransaction(TEST_TRANSACTION);
            onConnectionUpdatedCallback(mockConnection);
            onPopupClosed();
            try {
                yield signTransactionP;
            }
            catch (_a) {
            }
            expect(signTransactionP).rejects.toEqual(expect.any(wallet_adapter_base_1.WalletSignTransactionError));
            expect(mockConnectionManager.close).toHaveBeenCalled();
        }));
        it('rejects when the user denies the transaction', () => __awaiter(void 0, void 0, void 0, function* () {
            mockConnectionManager.onConnectionUpdated.mockImplementation(callback => {
                onConnectionUpdatedCallback = callback;
                return mockConnectionManager;
            });
            const signTransactionP = wallet.signTransaction(TEST_TRANSACTION);
            onConnectionUpdatedCallback(mockConnection);
            onSignTransactionDeniedCallback();
            try {
                yield signTransactionP;
            }
            catch (_b) {
            }
            expect(signTransactionP).rejects.toEqual(expect.any(wallet_adapter_base_1.WalletSignTransactionError));
            expect(mockConnectionManager.close).toHaveBeenCalled();
        }));
        it('resolves with the signed transactions sent back from the popup', () => __awaiter(void 0, void 0, void 0, function* () {
            mockConnectionManager.onConnectionUpdated.mockImplementation(callback => {
                onConnectionUpdatedCallback = callback;
                return mockConnectionManager;
            });
            const signTransactionP = wallet.signTransaction(TEST_TRANSACTION);
            transactionFromSpy.mockReturnValue(TEST_RESOLVED_TRANSACTION);
            mockConnection.on.mockImplementation((event, callback) => {
                if (event === popup_connection_1.PopupEvent.TRANSACTION_SIGNATURE_NEEDED_RESPONSE) {
                    onTransactionSignatureNeededResponseCallback = callback;
                }
            });
            onConnectionUpdatedCallback(mockConnection);
            onTransactionSignatureNeededResponseCallback({
                signedB58Transactions: [
                    bs58_1.default.encode(Buffer.from('test-signed-transaction')),
                ],
            });
            const result = yield signTransactionP;
            expect(result).toBe(TEST_RESOLVED_TRANSACTION);
            expect(mockConnectionManager.close).toHaveBeenCalled();
        }));
    });
});
//# sourceMappingURL=fractal-wallet-adapter-impl.test.js.map