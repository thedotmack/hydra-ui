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
Object.defineProperty(exports, "__esModule", { value: true });
const connection_manager_1 = require("./connection-manager");
const connection_1 = require("./core/connection");
const constants_1 = require("./core/constants");
const types_1 = require("./core/types");
const utils = __importStar(require("./core/utils"));
const TEST_URL = 'https://fractal.is/approve/foobar';
const TEST_NONCE = 'test-nonce';
function triggerMessage(event, payload = {}, origin = constants_1.FRACTAL_DOMAIN_HTTPS) {
    window.dispatchEvent(new MessageEvent('message', {
        data: {
            event,
            payload,
        },
        origin,
    }));
}
describe('ConnectionManager', () => {
    let fakePopupWindow;
    let openPopupSpy;
    let mockPopupPostMessage;
    let mockPopupClose;
    beforeEach(() => {
        mockPopupPostMessage = jest.fn();
        mockPopupClose = jest.fn();
        fakePopupWindow = {
            close: mockPopupClose,
            postMessage: mockPopupPostMessage,
        };
        openPopupSpy = jest.spyOn(utils, 'openPopup');
        openPopupSpy.mockImplementation(() => fakePopupWindow);
    });
    afterEach(() => {
        openPopupSpy.mockClear();
    });
    it('sends back a HANDSHAKE_ACK upon hearing HANDSHAKE when initialized', () => {
        const manager = new connection_manager_1.ConnectionManager(types_1.Platform.UNKNOWN);
        manager.open({ url: TEST_URL });
        triggerMessage(types_1.PopupEvent.HANDSHAKE);
        expect(mockPopupPostMessage).toHaveBeenCalledTimes(1);
        expect(mockPopupPostMessage).toHaveBeenCalledWith(expect.objectContaining({
            event: types_1.PopupEvent.HANDSHAKE_ACK,
        }), constants_1.FRACTAL_DOMAIN_HTTPS);
    });
    it('only sends back a HANDSHAKE_ACK if nonce matches', () => {
        const manager = new connection_manager_1.ConnectionManager(types_1.Platform.UNKNOWN);
        manager.open({ nonce: TEST_NONCE, url: TEST_URL });
        triggerMessage(types_1.PopupEvent.HANDSHAKE);
        expect(mockPopupPostMessage).toHaveBeenCalledTimes(0);
        triggerMessage(types_1.PopupEvent.HANDSHAKE, { nonce: 'Invalid Nonce' });
        expect(mockPopupPostMessage).toHaveBeenCalledTimes(0);
        triggerMessage(types_1.PopupEvent.HANDSHAKE, { nonce: TEST_NONCE });
        expect(mockPopupPostMessage).toHaveBeenCalledTimes(1);
        expect(mockPopupPostMessage).toHaveBeenCalledWith(expect.objectContaining({
            event: types_1.PopupEvent.HANDSHAKE_ACK,
        }), constants_1.FRACTAL_DOMAIN_HTTPS);
    });
    it('sends the appropriate platform in the HANDSHAKE_ACK event', () => {
        const manager = new connection_manager_1.ConnectionManager(types_1.Platform.REACT_SDK);
        manager.open({ url: TEST_URL });
        triggerMessage(types_1.PopupEvent.HANDSHAKE);
        expect(mockPopupPostMessage).toHaveBeenCalledTimes(1);
        expect(mockPopupPostMessage).toHaveBeenCalledWith(expect.objectContaining({
            payload: {
                platform: types_1.Platform.REACT_SDK,
            },
        }), constants_1.FRACTAL_DOMAIN_HTTPS);
    });
    it('initializes a connection when HANDSHAKE is heard', () => {
        const onConnectionUpdated = jest.fn();
        const manager = new connection_manager_1.ConnectionManager(types_1.Platform.REACT_SDK);
        manager.onConnectionUpdated(onConnectionUpdated);
        manager.open({ url: TEST_URL });
        triggerMessage(types_1.PopupEvent.HANDSHAKE);
        expect(onConnectionUpdated).toHaveBeenCalledTimes(1);
        expect(onConnectionUpdated).toHaveBeenCalledWith(expect.any(connection_1.Connection));
    });
    it('removes a connection when torn down', () => {
        const onConnectionUpdated = jest.fn();
        const manager = new connection_manager_1.ConnectionManager(types_1.Platform.REACT_SDK);
        manager.onConnectionUpdated(onConnectionUpdated);
        manager.open({ url: TEST_URL });
        triggerMessage(types_1.PopupEvent.HANDSHAKE);
        expect(onConnectionUpdated).toHaveBeenCalledTimes(1);
        manager.tearDown();
        expect(onConnectionUpdated).toHaveBeenCalledTimes(2);
        expect(onConnectionUpdated).toHaveBeenLastCalledWith(null);
    });
    it('unregisteres listeners when torn down', () => {
        const onProjectApproved = jest.fn();
        const manager = new connection_manager_1.ConnectionManager(types_1.Platform.REACT_SDK);
        manager.onConnectionUpdated((connection) => {
            connection === null || connection === void 0 ? void 0 : connection.on(types_1.PopupEvent.PROJECT_APPROVED, onProjectApproved);
        });
        manager.open({ url: TEST_URL });
        triggerMessage(types_1.PopupEvent.HANDSHAKE);
        triggerMessage(types_1.PopupEvent.PROJECT_APPROVED);
        expect(onProjectApproved).toHaveBeenCalledTimes(1);
        manager.tearDown();
        triggerMessage(types_1.PopupEvent.PROJECT_APPROVED);
        expect(onProjectApproved).toHaveBeenCalledTimes(1);
    });
    describe('opening a popup', () => {
        it('is supported', () => {
            const manager = new connection_manager_1.ConnectionManager(types_1.Platform.UNKNOWN);
            expect(openPopupSpy).toHaveBeenCalledTimes(0);
            manager.open({ url: TEST_URL });
            expect(openPopupSpy).toHaveBeenCalledTimes(1);
        });
        it('supports being opened with a custom size', () => {
            const manager = new connection_manager_1.ConnectionManager(types_1.Platform.UNKNOWN);
            manager.open({ heightPx: 500, url: TEST_URL, widthPx: 250 });
            expect(openPopupSpy).toHaveBeenCalledWith(expect.objectContaining({
                height: 500,
                width: 250,
            }));
        });
        it('will only open one popup at a time', () => {
            const manager = new connection_manager_1.ConnectionManager(types_1.Platform.UNKNOWN);
            expect(openPopupSpy).toHaveBeenCalledTimes(0);
            manager.open({ url: TEST_URL });
            manager.open({ url: TEST_URL });
            manager.open({ url: TEST_URL });
            expect(openPopupSpy).toHaveBeenCalledTimes(1);
        });
    });
    describe('closing a popup', () => {
        it('is supported', () => {
            const manager = new connection_manager_1.ConnectionManager(types_1.Platform.UNKNOWN);
            manager.open({ url: TEST_URL });
            triggerMessage(types_1.PopupEvent.HANDSHAKE);
            expect(mockPopupClose).toHaveBeenCalledTimes(0);
            manager.close();
            expect(mockPopupClose).toHaveBeenCalledTimes(1);
        });
        it('resets the connection', () => {
            const onConnectionUpdated = jest.fn();
            const manager = new connection_manager_1.ConnectionManager(types_1.Platform.UNKNOWN);
            manager.onConnectionUpdated(onConnectionUpdated);
            manager.open({ url: TEST_URL });
            triggerMessage(types_1.PopupEvent.HANDSHAKE);
            manager.close();
            expect(onConnectionUpdated).toHaveBeenLastCalledWith(null);
        });
    });
    it('supports being notified repeatedly every time the connection is updated', () => {
        const onConnectionUpdated = jest.fn();
        const manager = new connection_manager_1.ConnectionManager(types_1.Platform.UNKNOWN);
        manager.onConnectionUpdated(onConnectionUpdated);
        manager.open({ url: TEST_URL });
        triggerMessage(types_1.PopupEvent.HANDSHAKE);
        expect(onConnectionUpdated).toHaveBeenLastCalledWith(expect.any(connection_1.Connection));
        manager.close();
        expect(onConnectionUpdated).toHaveBeenLastCalledWith(null);
        manager.open({ url: TEST_URL });
        triggerMessage(types_1.PopupEvent.HANDSHAKE);
        expect(onConnectionUpdated).toHaveBeenLastCalledWith(expect.any(connection_1.Connection));
    });
});
//# sourceMappingURL=connection-manager.test.js.map