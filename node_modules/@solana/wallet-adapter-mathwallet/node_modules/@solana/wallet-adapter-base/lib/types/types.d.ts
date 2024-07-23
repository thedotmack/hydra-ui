import type { WalletAdapter } from './adapter.js';
import type { MessageSignerWalletAdapter, SignerWalletAdapter } from './signer.js';
import type { StandardWalletAdapter } from './standard.js';
export declare type Adapter = WalletAdapter | SignerWalletAdapter | MessageSignerWalletAdapter | StandardWalletAdapter;
export declare enum WalletAdapterNetwork {
    Mainnet = "mainnet-beta",
    Testnet = "testnet",
    Devnet = "devnet"
}
//# sourceMappingURL=types.d.ts.map