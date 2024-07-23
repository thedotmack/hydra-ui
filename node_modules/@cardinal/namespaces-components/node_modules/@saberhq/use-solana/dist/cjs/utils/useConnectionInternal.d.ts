import type { Network, NetworkConfig } from "@saberhq/solana-contrib";
import type { Commitment } from "@solana/web3.js";
import { Connection } from "@solana/web3.js";
import type { StorageAdapter } from "../storage";
export declare type PartialNetworkConfigMap = {
    [N in Network]?: Partial<NetworkConfig>;
};
export interface ConnectionContext {
    connection: Connection;
    sendConnection: Connection;
    network: Network;
    setNetwork: (val: Network) => void | Promise<void>;
    endpoint: string;
    setEndpoints: (endpoints: Omit<NetworkConfig, "name">) => void | Promise<void>;
}
export interface ConnectionArgs {
    defaultNetwork?: Network;
    networkConfigs?: PartialNetworkConfigMap;
    commitment?: Commitment;
    storageAdapter: StorageAdapter;
}
/**
 * Handles the connection to the Solana nodes.
 * @returns
 */
export declare const useConnectionInternal: ({ defaultNetwork, networkConfigs, commitment, storageAdapter, }: ConnectionArgs) => ConnectionContext;
//# sourceMappingURL=useConnectionInternal.d.ts.map