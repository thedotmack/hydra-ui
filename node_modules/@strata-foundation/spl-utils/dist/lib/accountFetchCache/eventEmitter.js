"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEmitter = exports.CacheDeleteEvent = exports.CacheUpdateEvent = void 0;
const eventemitter3_1 = require("eventemitter3");
class CacheUpdateEvent {
    constructor(id, isNew, parser) {
        this.id = id;
        this.parser = parser;
        this.isNew = isNew;
    }
}
exports.CacheUpdateEvent = CacheUpdateEvent;
CacheUpdateEvent.type = "CacheUpdate";
class CacheDeleteEvent {
    constructor(id) {
        this.id = id;
    }
}
exports.CacheDeleteEvent = CacheDeleteEvent;
CacheDeleteEvent.type = "CacheDelete";
class EventEmitter {
    constructor() {
        this.emitter = new eventemitter3_1.EventEmitter();
    }
    onCache(callback) {
        this.emitter.on(CacheUpdateEvent.type, callback);
        return () => this.emitter.removeListener(CacheUpdateEvent.type, callback);
    }
    raiseCacheUpdated(id, isNew, parser) {
        this.emitter.emit(CacheUpdateEvent.type, new CacheUpdateEvent(id, isNew, parser));
    }
    raiseCacheDeleted(id) {
        this.emitter.emit(CacheDeleteEvent.type, new CacheDeleteEvent(id));
    }
}
exports.EventEmitter = EventEmitter;
//# sourceMappingURL=eventEmitter.js.map