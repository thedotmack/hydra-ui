"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionUrl = exports.tryPublicKey = exports.pubKeyUrl = exports.shortPubKey = void 0;
const web3_js_1 = require("@solana/web3.js");
const utils_1 = require("./utils");
function shortPubKey(pubkey, startChars = 4, endChars = startChars) {
    if (!pubkey)
        return "";
    return `${pubkey === null || pubkey === void 0 ? void 0 : pubkey.toString().substring(0, startChars)}..${pubkey === null || pubkey === void 0 ? void 0 : pubkey.toString().substring((pubkey === null || pubkey === void 0 ? void 0 : pubkey.toString().length) - endChars)}`;
}
exports.shortPubKey = shortPubKey;
function pubKeyUrl(pubkey, cluster) {
    if (!pubkey)
        return "https://explorer.solana.com";
    return `https://explorer.solana.com/address/${pubkey.toString()}/metadata${cluster === "devnet" ? "?cluster=devnet" : ""}`;
}
exports.pubKeyUrl = pubKeyUrl;
const tryPublicKey = (publicKeyString) => {
    if (!publicKeyString)
        return null;
    try {
        return new web3_js_1.PublicKey(publicKeyString);
    }
    catch (e) {
        return null;
    }
};
exports.tryPublicKey = tryPublicKey;
function transactionUrl(txid, cluster) {
    return (0, utils_1.withCluster)(`https://explorer.solana.com/tx/${txid}`, cluster);
}
exports.transactionUrl = transactionUrl;
//# sourceMappingURL=publicKeys.js.map