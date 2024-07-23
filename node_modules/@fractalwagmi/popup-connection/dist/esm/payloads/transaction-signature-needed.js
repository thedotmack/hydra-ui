import { isObject } from "../lib/guards.js";
export function assertPayloadIsTransactionSignatureNeededPayload(payload) {
    if (!isObject(payload)) {
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
//# sourceMappingURL=transaction-signature-needed.js.map