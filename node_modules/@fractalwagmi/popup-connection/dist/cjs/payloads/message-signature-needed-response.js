"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertPayloadIsMessageSignatureNeededResponsePayload = void 0;
const guards_1 = require("../lib/guards");
function assertPayloadIsMessageSignatureNeededResponsePayload(payload) {
    if (!(0, guards_1.isObject)(payload)) {
        return false;
    }
    if (!('decodedSignature' in payload)) {
        return false;
    }
    return typeof payload.decodedSignature === 'string';
}
exports.assertPayloadIsMessageSignatureNeededResponsePayload = assertPayloadIsMessageSignatureNeededResponsePayload;
//# sourceMappingURL=message-signature-needed-response.js.map