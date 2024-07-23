import { PublicKey } from "@solana/web3.js";
import { withCluster } from "./utils";
export function shortPubKey(pubkey, startChars = 4, endChars = startChars) {
    if (!pubkey)
        return "";
    return `${pubkey === null || pubkey === void 0 ? void 0 : pubkey.toString().substring(0, startChars)}..${pubkey === null || pubkey === void 0 ? void 0 : pubkey.toString().substring((pubkey === null || pubkey === void 0 ? void 0 : pubkey.toString().length) - endChars)}`;
}
export function pubKeyUrl(pubkey, cluster) {
    if (!pubkey)
        return "https://explorer.solana.com";
    return `https://explorer.solana.com/address/${pubkey.toString()}/metadata${cluster === "devnet" ? "?cluster=devnet" : ""}`;
}
export const tryPublicKey = (publicKeyString) => {
    if (!publicKeyString)
        return null;
    try {
        return new PublicKey(publicKeyString);
    }
    catch (e) {
        return null;
    }
};
export function transactionUrl(txid, cluster) {
    return withCluster(`https://explorer.solana.com/tx/${txid}`, cluster);
}
//# sourceMappingURL=publicKeys.js.map