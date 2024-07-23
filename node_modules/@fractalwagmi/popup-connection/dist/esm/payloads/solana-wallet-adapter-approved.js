import { isObject } from "../lib/guards.js";
export function assertPayloadIsSolanaWalletAdapterApproved(payload) {
    if (!isObject(payload)) {
        return false;
    }
    if (!('solanaPublicKey' in payload)) {
        return false;
    }
    if (typeof payload.solanaPublicKey !== 'string') {
        return false;
    }
    return true;
}
//# sourceMappingURL=solana-wallet-adapter-approved.js.map