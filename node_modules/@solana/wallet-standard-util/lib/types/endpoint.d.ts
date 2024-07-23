import type { SolanaChain } from '@solana/wallet-standard-chains';
export declare const MAINNET_ENDPOINT = "https://api.mainnet-beta.solana.com";
export declare const DEVNET_ENDPOINT = "https://api.devnet.solana.com";
export declare const TESTNET_ENDPOINT = "https://api.testnet.solana.com";
export declare const LOCALNET_ENDPOINT = "http://localhost:8899";
export declare function getChainForEndpoint(endpoint: string): SolanaChain;
export declare function getEndpointForChain(chain: SolanaChain, endpoint?: string): string;
//# sourceMappingURL=endpoint.d.ts.map