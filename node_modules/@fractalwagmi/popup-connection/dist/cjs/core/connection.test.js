"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("./connection");
const constants_1 = require("./constants");
const types_1 = require("./types");
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
        const connection = new connection_1.Connection(constants_1.FRACTAL_DOMAIN_HTTPS, fakePopupWindowWithMockPostMessage);
        connection.on(types_1.PopupEvent.POPUP_CLOSED, onPopupClosed);
        connection.runHandlersForEvent(types_1.PopupEvent.POPUP_CLOSED, TEST_PAYLOAD);
        connection.runHandlersForEvent(types_1.PopupEvent.POPUP_CLOSED, TEST_PAYLOAD);
        expect(onPopupClosed).toHaveBeenCalledWith(TEST_PAYLOAD);
        expect(onPopupClosed).toHaveBeenCalledTimes(2);
    });
    it('only registers once for the same listener', () => {
        const onPopupClosed = jest.fn();
        const connection = new connection_1.Connection(constants_1.FRACTAL_DOMAIN_HTTPS, fakePopupWindowWithMockPostMessage);
        connection.on(types_1.PopupEvent.POPUP_CLOSED, onPopupClosed);
        connection.on(types_1.PopupEvent.POPUP_CLOSED, onPopupClosed);
        connection.on(types_1.PopupEvent.POPUP_CLOSED, onPopupClosed);
        connection.on(types_1.PopupEvent.POPUP_CLOSED, onPopupClosed);
        connection.runHandlersForEvent(types_1.PopupEvent.POPUP_CLOSED, TEST_PAYLOAD);
        expect(onPopupClosed).toHaveBeenCalledTimes(1);
    });
    it('supports unregistering a listener', () => {
        const onPopupClosed = jest.fn();
        const connection = new connection_1.Connection(constants_1.FRACTAL_DOMAIN_HTTPS, fakePopupWindowWithMockPostMessage);
        connection.on(types_1.PopupEvent.POPUP_CLOSED, onPopupClosed);
        connection.runHandlersForEvent(types_1.PopupEvent.POPUP_CLOSED, TEST_PAYLOAD);
        connection.off(types_1.PopupEvent.POPUP_CLOSED, onPopupClosed);
        connection.runHandlersForEvent(types_1.PopupEvent.POPUP_CLOSED, TEST_PAYLOAD);
        expect(onPopupClosed).toHaveBeenCalledTimes(1);
    });
    it('supports sending a message', () => {
        const connection = new connection_1.Connection(constants_1.FRACTAL_DOMAIN_HTTPS, fakePopupWindowWithMockPostMessage);
        connection.send({
            event: types_1.PopupEvent.HANDSHAKE,
            payload: TEST_PAYLOAD,
        });
        expect(mockPostMessage).toHaveBeenCalledWith({
            event: types_1.PopupEvent.HANDSHAKE,
            payload: TEST_PAYLOAD,
        }, constants_1.FRACTAL_DOMAIN_HTTPS);
    });
});
//# sourceMappingURL=connection.test.js.map