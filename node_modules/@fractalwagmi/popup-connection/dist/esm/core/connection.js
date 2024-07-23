export class Connection {
    constructor(validatedOrigin, targetWindow) {
        this.validatedOrigin = validatedOrigin;
        this.targetWindow = targetWindow;
        this.handlers = new Map();
    }
    off(event, callback) {
        const eventCallbacks = this.handlers.get(event);
        eventCallbacks === null || eventCallbacks === void 0 ? void 0 : eventCallbacks.delete(callback);
    }
    on(event, callback) {
        var _a;
        const eventCallbacks = (_a = this.handlers.get(event)) !== null && _a !== void 0 ? _a : new Set();
        eventCallbacks.add(callback);
        this.handlers.set(event, eventCallbacks);
    }
    send({ event, payload }) {
        this.targetWindow.postMessage({
            event,
            payload,
        }, this.validatedOrigin);
    }
    runHandlersForEvent(event, payload) {
        const eventCallbacks = this.handlers.get(event);
        if (!eventCallbacks) {
            return;
        }
        for (const callback of eventCallbacks) {
            callback(payload);
        }
    }
    resetHandlers() {
        this.handlers.clear();
    }
    export() {
        return {
            off: this.off.bind(this),
            on: this.on.bind(this),
            send: this.send.bind(this),
            validatedOrigin: this.validatedOrigin,
        };
    }
}
//# sourceMappingURL=connection.js.map