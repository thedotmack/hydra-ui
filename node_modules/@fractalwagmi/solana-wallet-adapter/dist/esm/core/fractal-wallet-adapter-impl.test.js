import { assertPayloadIsMessageSignatureNeededResponsePayload, assertPayloadIsSolanaWalletAdapterApproved, assertPayloadIsTransactionSignatureNeededResponsePayload, Connection, ConnectionManager, PopupEvent, } from '@fractalwagmi/popup-connection';
import { WalletConnectionError, WalletNotConnectedError, WalletPublicKeyError, WalletSignMessageError, WalletSignTransactionError, } from '@solana/wallet-adapter-base';
import * as web3 from '@solana/web3.js';
import base58 from 'bs58';
import { FractalWalletAdapterImpl } from "./fractal-wallet-adapter-impl.js";
import { createNonce } from "./nonce.js";
import createMockInstance from 'jest-create-mock-instance';
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
        assertPayloadIsSolanaWalletAdapterApproved;
    mockAssertPayloadIsSolanaWalletAdapterApproved.mockReturnValue(true);
    mockAssertPayloadIsTransactionSignatureNeededResponsePayload =
        assertPayloadIsTransactionSignatureNeededResponsePayload;
    mockAssertPayloadIsTransactionSignatureNeededResponsePayload.mockReturnValue(true);
    mockAssertPayloadIsMessageSignatureNeededResponsePayload =
        assertPayloadIsMessageSignatureNeededResponsePayload;
    mockAssertPayloadIsMessageSignatureNeededResponsePayload.mockReturnValue(true);
    transactionFromSpy = jest.spyOn(web3.Transaction, 'from');
    mockConnection = createMockInstance(Connection);
    mockConnectionManager = createMockInstance(ConnectionManager);
    mockConnectionManager.getConnection.mockReturnValue(mockConnection);
    MockConnectionManagerClass = ConnectionManager;
    MockConnectionManagerClass.mockClear();
    MockConnectionManagerClass.mockImplementation(() => mockConnectionManager);
    mockCreateNonce = createNonce;
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
            if (event === PopupEvent.SOLANA_WALLET_ADAPTER_APPROVED) {
                onSolanaWalletAdapterApprovedCallback = callback;
            }
            if (event === PopupEvent.SOLANA_WALLET_ADAPTER_DENIED) {
                onSolanaWalletAdapterDeniedCallback = callback;
            }
            if (event === PopupEvent.POPUP_CLOSED) {
                onPopupClosed = callback;
            }
            if (event === PopupEvent.TRANSACTION_DENIED) {
                onSignTransactionDeniedCallback = callback;
            }
        });
    });
    describe('connect', () => {
        it('should open the approval page when connecting', () => {
            const wallet = new FractalWalletAdapterImpl();
            wallet.connect();
            expect(mockConnectionManager.open).toHaveBeenLastCalledWith({
                nonce: TEST_NONCE,
                url: `${APPROVE_PAGE_URL}/${TEST_NONCE}`,
            });
        });
        it('should listen for the SOLANA_WALLET_ADAPTER_APPROVED event', () => {
            const wallet = new FractalWalletAdapterImpl();
            wallet.connect();
            onConnectionUpdatedCallback(mockConnection);
            expect(mockConnection.on).toHaveBeenCalledWith(PopupEvent.SOLANA_WALLET_ADAPTER_APPROVED, expect.any(Function));
        });
        it('handles user denial of popup', async () => {
            const wallet = new FractalWalletAdapterImpl();
            const connectP = wallet.connect();
            onConnectionUpdatedCallback(mockConnection);
            onSolanaWalletAdapterDeniedCallback();
            try {
                await connectP;
            }
            catch {
            }
            expect(mockConnectionManager.close).toHaveBeenCalled();
            expect(connectP).rejects.toEqual(expect.any(WalletConnectionError));
        });
        it('handles explicit popup closing by user', async () => {
            const wallet = new FractalWalletAdapterImpl();
            const connectP = wallet.connect();
            onConnectionUpdatedCallback(mockConnection);
            onPopupClosed();
            try {
                await connectP;
            }
            catch {
            }
            expect(mockConnectionManager.close).toHaveBeenCalled();
            expect(connectP).rejects.toEqual(expect.any(WalletConnectionError));
        });
        it('handles invalid payloads', () => {
            mockAssertPayloadIsSolanaWalletAdapterApproved.mockRestore();
            const wallet = new FractalWalletAdapterImpl();
            const connectP = wallet.connect();
            onConnectionUpdatedCallback(mockConnection);
            onSolanaWalletAdapterApprovedCallback({
                someUnknownPayload: 'foobar',
            });
            expect(mockConnectionManager.close).toHaveBeenCalled();
            expect(connectP).rejects.toEqual(expect.any(WalletConnectionError));
        });
        it('handles any wallet public key errors', () => {
            jest.spyOn(web3, 'PublicKey').mockImplementationOnce(() => {
                throw new Error('Some public key error');
            });
            const wallet = new FractalWalletAdapterImpl();
            const connectP = wallet.connect();
            onConnectionUpdatedCallback(mockConnection);
            mockAssertPayloadIsSolanaWalletAdapterApproved.mockReturnValue(true);
            onSolanaWalletAdapterApprovedCallback({
                solanaPublicKey: TEST_PUBLIC_KEY_INPUT,
            });
            expect(mockConnectionManager.close).toHaveBeenCalled();
            expect(connectP).rejects.toEqual(expect.any(WalletPublicKeyError));
        });
        it('resolves only after the public key is made available', async () => {
            const wallet = new FractalWalletAdapterImpl();
            const connectP = wallet.connect();
            onConnectionUpdatedCallback(mockConnection);
            mockAssertPayloadIsSolanaWalletAdapterApproved.mockReturnValue(true);
            onSolanaWalletAdapterApprovedCallback({
                solanaPublicKey: TEST_PUBLIC_KEY_INPUT,
            });
            await connectP;
            expect(web3.PublicKey).toHaveBeenLastCalledWith(TEST_PUBLIC_KEY_INPUT);
            expect(wallet.getPublicKey()).toBe(TEST_PUBLIC_KEY);
            expect(mockConnectionManager.close).toHaveBeenCalled();
        });
        it('stores the public key in localStorage', async () => {
            const wallet = new FractalWalletAdapterImpl();
            const connectP = wallet.connect();
            onConnectionUpdatedCallback(mockConnection);
            mockAssertPayloadIsSolanaWalletAdapterApproved.mockReturnValue(true);
            onSolanaWalletAdapterApprovedCallback({
                solanaPublicKey: TEST_PUBLIC_KEY_INPUT,
            });
            await connectP;
            expect(localStorage.setItem).toHaveBeenLastCalledWith(LOCAL_STORAGE_KEY_FOR_PUBLIC_KEY, TEST_PUBLIC_KEY_INPUT);
        });
        it('removes the public key from localStorage when disconnecting', async () => {
            const wallet = new FractalWalletAdapterImpl();
            const connectP = wallet.connect();
            onConnectionUpdatedCallback(mockConnection);
            mockAssertPayloadIsSolanaWalletAdapterApproved.mockReturnValue(true);
            onSolanaWalletAdapterApprovedCallback({
                solanaPublicKey: TEST_PUBLIC_KEY_INPUT,
            });
            await connectP;
            await wallet.disconnect();
            expect(localStorage.getItem(LOCAL_STORAGE_KEY_FOR_PUBLIC_KEY)).toBeNull();
        });
        it('auto-initializes connection from existing public key in localStorage', async () => {
            var _a;
            localStorage.setItem(LOCAL_STORAGE_KEY_FOR_PUBLIC_KEY, 'D3FXGeV4Vas5FFNaQyoTTWog2oUQai1CH6QTvqoytpvf');
            web3.PublicKey.mockRestore();
            const wallet = new FractalWalletAdapterImpl();
            await wallet.connect();
            expect((_a = wallet.getPublicKey()) === null || _a === void 0 ? void 0 : _a.toString()).toEqual('D3FXGeV4Vas5FFNaQyoTTWog2oUQai1CH6QTvqoytpvf');
        });
    });
    describe('messages', () => {
        let wallet;
        let onMessageSignatureNeededResponseCallback = () => { };
        let onAuthLoadedCallback = () => { };
        beforeEach(async () => {
            wallet = new FractalWalletAdapterImpl();
            const connectP = wallet.connect();
            onConnectionUpdatedCallback(mockConnection);
            onSolanaWalletAdapterApprovedCallback({
                solanaPublicKey: TEST_PUBLIC_KEY_INPUT,
            });
            return connectP;
        });
        it('sends a MESSAGE_SIGNATURE_NEEDED event when the popup is ready', () => {
            mockConnectionManager.onConnectionUpdated.mockImplementation(callback => {
                onConnectionUpdatedCallback = callback;
                return mockConnectionManager;
            });
            wallet.signMessage(TEST_MESSAGE_UINT8ARRAY);
            mockConnection.on.mockImplementation((event, callback) => {
                if (event === PopupEvent.AUTH_LOADED) {
                    onAuthLoadedCallback = callback;
                }
            });
            onConnectionUpdatedCallback(mockConnection);
            expect(mockConnection.send).not.toHaveBeenCalledWith({
                event: PopupEvent.MESSAGE_SIGNATURE_NEEDED,
                payload: expect.objectContaining({
                    decodedMessage: TEST_MESSAGE_STRING,
                }),
            });
            onAuthLoadedCallback();
            expect(mockConnection.send).toHaveBeenLastCalledWith({
                event: PopupEvent.MESSAGE_SIGNATURE_NEEDED,
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
                if (event === PopupEvent.MESSAGE_SIGNATURE_NEEDED_RESPONSE) {
                    onMessageSignatureNeededResponseCallback = callback;
                }
            });
            const signMessageP = wallet.signMessage(TEST_MESSAGE_UINT8ARRAY);
            onConnectionUpdatedCallback(mockConnection);
            onMessageSignatureNeededResponseCallback({
                someUnsupportedPayload: 'foobar',
            });
            expect(signMessageP).rejects.toEqual(expect.any(WalletSignMessageError));
            expect(mockConnectionManager.close).toHaveBeenCalled();
        });
        it('rejects when the user closes the popup', async () => {
            mockConnectionManager.onConnectionUpdated.mockImplementation(callback => {
                onConnectionUpdatedCallback = callback;
                return mockConnectionManager;
            });
            const signMessageP = wallet.signMessage(TEST_MESSAGE_UINT8ARRAY);
            onConnectionUpdatedCallback(mockConnection);
            onPopupClosed();
            try {
                await signMessageP;
            }
            catch {
            }
            expect(signMessageP).rejects.toEqual(expect.any(WalletSignMessageError));
            expect(mockConnectionManager.close).toHaveBeenCalled();
        });
        it('rejects when the user denies the transaction', async () => {
            mockConnectionManager.onConnectionUpdated.mockImplementation(callback => {
                onConnectionUpdatedCallback = callback;
                return mockConnectionManager;
            });
            const signMessageP = wallet.signMessage(TEST_MESSAGE_UINT8ARRAY);
            onConnectionUpdatedCallback(mockConnection);
            onSignTransactionDeniedCallback();
            try {
                await signMessageP;
            }
            catch {
            }
            expect(signMessageP).rejects.toEqual(expect.any(WalletSignMessageError));
            expect(mockConnectionManager.close).toHaveBeenCalled();
        });
        it('resolves with the signed signature sent back from the popup', async () => {
            mockConnectionManager.close = jest.fn();
            mockConnectionManager.onConnectionUpdated.mockImplementation(callback => {
                onConnectionUpdatedCallback = callback;
                return mockConnectionManager;
            });
            const signMessageP = wallet.signMessage(TEST_MESSAGE_UINT8ARRAY);
            mockConnection.on.mockImplementation((event, callback) => {
                if (event === PopupEvent.MESSAGE_SIGNATURE_NEEDED_RESPONSE) {
                    onMessageSignatureNeededResponseCallback = callback;
                }
            });
            onConnectionUpdatedCallback(mockConnection);
            expect(mockConnectionManager.close).not.toHaveBeenCalled();
            onMessageSignatureNeededResponseCallback({
                decodedSignature: '97,98,99',
            });
            const result = await signMessageP;
            expect(result).toEqual(Uint8Array.from([97, 98, 99]));
            expect(mockConnectionManager.close).toHaveBeenCalled();
        });
    });
    describe('transactions', () => {
        let wallet;
        let onTransactionSignatureNeededResponseCallback = () => { };
        let onAuthLoadedCallback = () => { };
        beforeEach(async () => {
            wallet = new FractalWalletAdapterImpl();
            const connectP = wallet.connect();
            onConnectionUpdatedCallback(mockConnection);
            onSolanaWalletAdapterApprovedCallback({
                solanaPublicKey: TEST_PUBLIC_KEY_INPUT,
            });
            return connectP;
        });
        it('checks for wallet readiness', () => {
            wallet = new FractalWalletAdapterImpl();
            expect(wallet.signTransaction(TEST_TRANSACTION)).rejects.toEqual(expect.any(WalletNotConnectedError));
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
                if (event === PopupEvent.AUTH_LOADED) {
                    onAuthLoadedCallback = callback;
                }
            });
            onConnectionUpdatedCallback(mockConnection);
            expect(mockConnection.send).not.toHaveBeenCalledWith({
                event: PopupEvent.TRANSACTION_SIGNATURE_NEEDED,
                payload: expect.objectContaining({
                    unsignedB58Transactions: [expect.any(String)],
                }),
            });
            onAuthLoadedCallback();
            expect(mockConnection.send).toHaveBeenLastCalledWith({
                event: PopupEvent.TRANSACTION_SIGNATURE_NEEDED,
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
            expect(signTransactionP).rejects.toEqual(expect.any(WalletSignTransactionError));
            expect(mockConnectionManager.close).toHaveBeenCalled();
        });
        it('rejects when the user closes the popup', async () => {
            mockConnectionManager.onConnectionUpdated.mockImplementation(callback => {
                onConnectionUpdatedCallback = callback;
                return mockConnectionManager;
            });
            const signTransactionP = wallet.signTransaction(TEST_TRANSACTION);
            onConnectionUpdatedCallback(mockConnection);
            onPopupClosed();
            try {
                await signTransactionP;
            }
            catch {
            }
            expect(signTransactionP).rejects.toEqual(expect.any(WalletSignTransactionError));
            expect(mockConnectionManager.close).toHaveBeenCalled();
        });
        it('rejects when the user denies the transaction', async () => {
            mockConnectionManager.onConnectionUpdated.mockImplementation(callback => {
                onConnectionUpdatedCallback = callback;
                return mockConnectionManager;
            });
            const signTransactionP = wallet.signTransaction(TEST_TRANSACTION);
            onConnectionUpdatedCallback(mockConnection);
            onSignTransactionDeniedCallback();
            try {
                await signTransactionP;
            }
            catch {
            }
            expect(signTransactionP).rejects.toEqual(expect.any(WalletSignTransactionError));
            expect(mockConnectionManager.close).toHaveBeenCalled();
        });
        it('resolves with the signed transactions sent back from the popup', async () => {
            mockConnectionManager.onConnectionUpdated.mockImplementation(callback => {
                onConnectionUpdatedCallback = callback;
                return mockConnectionManager;
            });
            const signTransactionP = wallet.signTransaction(TEST_TRANSACTION);
            transactionFromSpy.mockReturnValue(TEST_RESOLVED_TRANSACTION);
            mockConnection.on.mockImplementation((event, callback) => {
                if (event === PopupEvent.TRANSACTION_SIGNATURE_NEEDED_RESPONSE) {
                    onTransactionSignatureNeededResponseCallback = callback;
                }
            });
            onConnectionUpdatedCallback(mockConnection);
            onTransactionSignatureNeededResponseCallback({
                signedB58Transactions: [
                    base58.encode(Buffer.from('test-signed-transaction')),
                ],
            });
            const result = await signTransactionP;
            expect(result).toBe(TEST_RESOLVED_TRANSACTION);
            expect(mockConnectionManager.close).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=fractal-wallet-adapter-impl.test.js.map