import { isObject } from "../lib/guards.js";
export function assertPayloadIsTransactionSignatureNeededResponsePayload(payload) {
    if (!isObject(payload)) {
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
//# sourceMappingURL=transaction-signature-needed-response.js.map