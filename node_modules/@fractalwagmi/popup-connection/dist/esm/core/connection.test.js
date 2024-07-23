import { Connection } from "./connection.js";
import { FRACTAL_DOMAIN_HTTPS } from "./constants.js";
import { PopupEvent } from "./types.js";
const TEST_PAYLOAD = {
    foo: 'bar',
};
describe('Connection class', () => {
    let fakePopupWindowWithMockPostMessage;
    let mockPostMessage;
    beforeEach(() => {
        mockPostMessage = jest.fn();
        fakePopupWindowWithMockPostMessage = {
            postMessage: mockPostMessage,
        };
    });
    it('supports registering a listener', () => {
        const onPopupClosed = jest.fn();
        const connection = new Connection(FRACTAL_DOMAIN_HTTPS, fakePopupWindowWithMockPostMessage);
        connection.on(PopupEvent.POPUP_CLOSED, onPopupClosed);
        connection.runHandlersForEvent(PopupEvent.POPUP_CLOSED, TEST_PAYLOAD);
        connection.runHandlersForEvent(PopupEvent.POPUP_CLOSED, TEST_PAYLOAD);
        expect(onPopupClosed).toHaveBeenCalledWith(TEST_PAYLOAD);
        expect(onPopupClosed).toHaveBeenCalledTimes(2);
    });
    it('only registers once for the same listener', () => {
        const onPopupClosed = jest.fn();
        const connection = new Connection(FRACTAL_DOMAIN_HTTPS, fakePopupWindowWithMockPostMessage);
        connection.on(PopupEvent.POPUP_CLOSED, onPopupClosed);
        connection.on(PopupEvent.POPUP_CLOSED, onPopupClosed);
        connection.on(PopupEvent.POPUP_CLOSED, onPopupClosed);
        connection.on(PopupEvent.POPUP_CLOSED, onPopupClosed);
        connection.runHandlersForEvent(PopupEvent.POPUP_CLOSED, TEST_PAYLOAD);
        expect(onPopupClosed).toHaveBeenCalledTimes(1);
    });
    it('supports unregistering a listener', () => {
        const onPopupClosed = jest.fn();
        const connection = new Connection(FRACTAL_DOMAIN_HTTPS, fakePopupWindowWithMockPostMessage);
        connection.on(PopupEvent.POPUP_CLOSED, onPopupClosed);
        connection.runHandlersForEvent(PopupEvent.POPUP_CLOSED, TEST_PAYLOAD);
        connection.off(PopupEvent.POPUP_CLOSED, onPopupClosed);
        connection.runHandlersForEvent(PopupEvent.POPUP_CLOSED, TEST_PAYLOAD);
        expect(onPopupClosed).toHaveBeenCalledTimes(1);
    });
    it('supports sending a message', () => {
        const connection = new Connection(FRACTAL_DOMAIN_HTTPS, fakePopupWindowWithMockPostMessage);
        connection.send({
            event: PopupEvent.HANDSHAKE,
            payload: TEST_PAYLOAD,
        });
        expect(mockPostMessage).toHaveBeenCalledWith({
            event: PopupEvent.HANDSHAKE,
            payload: TEST_PAYLOAD,
        }, FRACTAL_DOMAIN_HTTPS);
    });
});
//# sourceMappingURL=connection.test.js.map