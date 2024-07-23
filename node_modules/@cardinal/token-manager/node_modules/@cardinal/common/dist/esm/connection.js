var _a, _b;
import { Connection } from "@solana/web3.js";
const networkURLs = {
    ["mainnet-beta"]: (_a = process.env.MAINNET_PRIMARY_URL) !== null && _a !== void 0 ? _a : "https://solana-api.projectserum.com",
    mainnet: (_b = process.env.MAINNET_PRIMARY_URL) !== null && _b !== void 0 ? _b : "https://solana-api.projectserum.com",
    devnet: "https://api.devnet.solana.com/",
    testnet: "https://api.testnet.solana.com/",
    localnet: "http://localhost:8899/",
};
export const connectionFor = (cluster, defaultCluster = "mainnet") => {
    return new Connection(process.env.RPC_URL || networkURLs[cluster || defaultCluster], "recent");
};
//# sourceMappingURL=connection.js.map