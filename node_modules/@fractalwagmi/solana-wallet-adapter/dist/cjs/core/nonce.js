"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNonce = void 0;
function createNonce() {
    return `${randomString()}${randomString()}${randomString()}`;
}
exports.createNonce = createNonce;
function randomString() {
    return (Math.random() + 1).toString(36).substring(7);
}
//# sourceMappingURL=nonce.js.map