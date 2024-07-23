import { isObject } from "../lib/guards.js";
export function assertPayloadIsMessageSignatureNeededResponsePayload(payload) {
    if (!isObject(payload)) {
        return false;
    }
    if (!('decodedSignature' in payload)) {
        return false;
    }
    return typeof payload.decodedSignature === 'string';
}
//# sourceMappingURL=message-signature-needed-response.js.map