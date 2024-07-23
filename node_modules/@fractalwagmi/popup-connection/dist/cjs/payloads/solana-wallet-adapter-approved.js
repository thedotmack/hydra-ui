"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertPayloadIsSolanaWalletAdapterApproved = void 0;
const guards_1 = require("../lib/guards");
function assertPayloadIsSolanaWalletAdapterApproved(payload) {
    if (!(0, guards_1.isObject)(payload)) {
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
exports.assertPayloadIsSolanaWalletAdapterApproved = assertPayloadIsSolanaWalletAdapterApproved;
//# sourceMappingURL=solana-wallet-adapter-approved.js.map