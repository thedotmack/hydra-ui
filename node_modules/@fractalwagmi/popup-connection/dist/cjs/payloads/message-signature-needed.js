"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertPayloadIsMessageSignatureNeededPayload = void 0;
const guards_1 = require("../lib/guards");
function assertPayloadIsMessageSignatureNeededPayload(payload) {
    if (!(0, guards_1.isObject)(payload)) {
        return false;
    }
    if (!('decodedMessage' in payload)) {
        return false;
    }
    return typeof payload.decodedMessage === 'string';
}
exports.assertPayloadIsMessageSignatureNeededPayload = assertPayloadIsMessageSignatureNeededPayload;
//# sourceMappingURL=message-signature-needed.js.map