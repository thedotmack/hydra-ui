"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertPayloadIsTransactionSignatureNeededResponsePayload = void 0;
const guards_1 = require("../lib/guards");
function assertPayloadIsTransactionSignatureNeededResponsePayload(payload) {
    if (!(0, guards_1.isObject)(payload)) {
        return false;
    }
    if (!('signedB58Transactions' in payload)) {
        return false;
    }
    if (!Array.isArray(payload.signedB58Transactions)) {
        return false;
    }
    return payload.signedB58Transactions.every(value => typeof value === 'string');
}
exports.assertPayloadIsTransactionSignatureNeededResponsePayload = assertPayloadIsTransactionSignatureNeededResponsePayload;
//# sourceMappingURL=transaction-signature-needed-response.js.map