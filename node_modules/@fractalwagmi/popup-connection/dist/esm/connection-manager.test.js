import { ConnectionManager } from "./connection-manager.js";
import { Connection } from "./core/connection.js";
import { FRACTAL_DOMAIN_HTTPS } from "./core/constants.js";
import { Platform, PopupEvent } from "./core/types.js";
import * as utils from "./core/utils.js";
const TEST_URL = 'https://fractal.is/approve/foobar';
const TEST_NONCE = 'test-nonce';
function triggerMessage(event, payload = {}, origin = FRACTAL_DOMAIN_HTTPS) {
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
        const manager = new ConnectionManager(Platform.UNKNOWN);
        manager.open({ url: TEST_URL });
        triggerMessage(PopupEvent.HANDSHAKE);
        expect(mockPopupPostMessage).toHaveBeenCalledTimes(1);
        expect(mockPopupPostMessage).toHaveBeenCalledWith(expect.objectContaining({
            event: PopupEvent.HANDSHAKE_ACK,
        }), FRACTAL_DOMAIN_HTTPS);
    });
    it('only sends back a HANDSHAKE_ACK if nonce matches', () => {
        const manager = new ConnectionManager(Platform.UNKNOWN);
        manager.open({ nonce: TEST_NONCE, url: TEST_URL });
        triggerMessage(PopupEvent.HANDSHAKE);
        expect(mockPopupPostMessage).toHaveBeenCalledTimes(0);
        triggerMessage(PopupEvent.HANDSHAKE, { nonce: 'Invalid Nonce' });
        expect(mockPopupPostMessage).toHaveBeenCalledTimes(0);
        triggerMessage(PopupEvent.HANDSHAKE, { nonce: TEST_NONCE });
        expect(mockPopupPostMessage).toHaveBeenCalledTimes(1);
        expect(mockPopupPostMessage).toHaveBeenCalledWith(expect.objectContaining({
            event: PopupEvent.HANDSHAKE_ACK,
        }), FRACTAL_DOMAIN_HTTPS);
    });
    it('sends the appropriate platform in the HANDSHAKE_ACK event', () => {
        const manager = new ConnectionManager(Platform.REACT_SDK);
        manager.open({ url: TEST_URL });
        triggerMessage(PopupEvent.HANDSHAKE);
        expect(mockPopupPostMessage).toHaveBeenCalledTimes(1);
        expect(mockPopupPostMessage).toHaveBeenCalledWith(expect.objectContaining({
            payload: {
                platform: Platform.REACT_SDK,
            },
        }), FRACTAL_DOMAIN_HTTPS);
    });
    it('initializes a connection when HANDSHAKE is heard', () => {
        const onConnectionUpdated = jest.fn();
        const manager = new ConnectionManager(Platform.REACT_SDK);
        manager.onConnectionUpdated(onConnectionUpdated);
        manager.open({ url: TEST_URL });
        triggerMessage(PopupEvent.HANDSHAKE);
        expect(onConnectionUpdated).toHaveBeenCalledTimes(1);
        expect(onConnectionUpdated).toHaveBeenCalledWith(expect.any(Connection));
    });
    it('removes a connection when torn down', () => {
        const onConnectionUpdated = jest.fn();
        const manager = new ConnectionManager(Platform.REACT_SDK);
        manager.onConnectionUpdated(onConnectionUpdated);
        manager.open({ url: TEST_URL });
        triggerMessage(PopupEvent.HANDSHAKE);
        expect(onConnectionUpdated).toHaveBeenCalledTimes(1);
        manager.tearDown();
        expect(onConnectionUpdated).toHaveBeenCalledTimes(2);
        expect(onConnectionUpdated).toHaveBeenLastCalledWith(null);
    });
    it('unregisteres listeners when torn down', () => {
        const onProjectApproved = jest.fn();
        const manager = new ConnectionManager(Platform.REACT_SDK);
        manager.onConnectionUpdated((connection) => {
            connection === null || connection === void 0 ? void 0 : connection.on(PopupEvent.PROJECT_APPROVED, onProjectApproved);
        });
        manager.open({ url: TEST_URL });
        triggerMessage(PopupEvent.HANDSHAKE);
        triggerMessage(PopupEvent.PROJECT_APPROVED);
        expect(onProjectApproved).toHaveBeenCalledTimes(1);
        manager.tearDown();
        triggerMessage(PopupEvent.PROJECT_APPROVED);
        expect(onProjectApproved).toHaveBeenCalledTimes(1);
    });
    describe('opening a popup', () => {
        it('is supported', () => {
            const manager = new ConnectionManager(Platform.UNKNOWN);
            expect(openPopupSpy).toHaveBeenCalledTimes(0);
            manager.open({ url: TEST_URL });
            expect(openPopupSpy).toHaveBeenCalledTimes(1);
        });
        it('supports being opened with a custom size', () => {
            const manager = new ConnectionManager(Platform.UNKNOWN);
            manager.open({ heightPx: 500, url: TEST_URL, widthPx: 250 });
            expect(openPopupSpy).toHaveBeenCalledWith(expect.objectContaining({
                height: 500,
                width: 250,
            }));
        });
        it('will only open one popup at a time', () => {
            const manager = new ConnectionManager(Platform.UNKNOWN);
            expect(openPopupSpy).toHaveBeenCalledTimes(0);
            manager.open({ url: TEST_URL });
            manager.open({ url: TEST_URL });
            manager.open({ url: TEST_URL });
            expect(openPopupSpy).toHaveBeenCalledTimes(1);
        });
    });
    describe('closing a popup', () => {
        it('is supported', () => {
            const manager = new ConnectionManager(Platform.UNKNOWN);
            manager.open({ url: TEST_URL });
            triggerMessage(PopupEvent.HANDSHAKE);
            expect(mockPopupClose).toHaveBeenCalledTimes(0);
            manager.close();
            expect(mockPopupClose).toHaveBeenCalledTimes(1);
        });
        it('resets the connection', () => {
            const onConnectionUpdated = jest.fn();
            const manager = new ConnectionManager(Platform.UNKNOWN);
            manager.onConnectionUpdated(onConnectionUpdated);
            manager.open({ url: TEST_URL });
            triggerMessage(PopupEvent.HANDSHAKE);
            manager.close();
            expect(onConnectionUpdated).toHaveBeenLastCalledWith(null);
        });
    });
    it('supports being notified repeatedly every time the connection is updated', () => {
        const onConnectionUpdated = jest.fn();
        const manager = new ConnectionManager(Platform.UNKNOWN);
        manager.onConnectionUpdated(onConnectionUpdated);
        manager.open({ url: TEST_URL });
        triggerMessage(PopupEvent.HANDSHAKE);
        expect(onConnectionUpdated).toHaveBeenLastCalledWith(expect.any(Connection));
        manager.close();
        expect(onConnectionUpdated).toHaveBeenLastCalledWith(null);
        manager.open({ url: TEST_URL });
        triggerMessage(PopupEvent.HANDSHAKE);
        expect(onConnectionUpdated).toHaveBeenLastCalledWith(expect.any(Connection));
    });
});
//# sourceMappingURL=connection-manager.test.js.map