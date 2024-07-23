"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertPayloadIsTransactionSignatureNeededPayload = void 0;
const guards_1 = require("../lib/guards");
function assertPayloadIsTransactionSignatureNeededPayload(payload) {
    if (!(0, guards_1.isObject)(payload)) {
        return false;
    }
    if (!('unsignedB58Transactions' in payload)) {
        return false;
    }
    if (!Array.isArray(payload.unsignedB58Transactions)) {
        return false;
    }
    return payload.unsignedB58Transactions.every(value => typeof value === 'string');
}
exports.assertPayloadIsTransactionSignatureNeededPayload = assertPayloadIsTransactionSignatureNeededPayload;
//# sourceMappingURL=transaction-signature-needed.js.map