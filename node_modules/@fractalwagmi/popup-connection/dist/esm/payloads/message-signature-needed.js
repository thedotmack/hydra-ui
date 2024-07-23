import { isObject } from "../lib/guards.js";
export function assertPayloadIsMessageSignatureNeededPayload(payload) {
    if (!isObject(payload)) {
        return false;
    }
    if (!('decodedMessage' in payload)) {
        return false;
    }
    return typeof payload.decodedMessage === 'string';
}
//# sourceMappingURL=message-signature-needed.js.map