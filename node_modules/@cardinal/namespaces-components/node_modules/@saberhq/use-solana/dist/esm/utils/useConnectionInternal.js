import { DEFAULT_NETWORK_CONFIG_MAP } from "@saberhq/solana-contrib";
import { Connection } from "@solana/web3.js";
import { useMemo } from "react";
import { usePersistedKVStore } from "./usePersistedKVStore";
const makeNetworkConfigMap = (partial) => Object.entries(DEFAULT_NETWORK_CONFIG_MAP).reduce((acc, [k, v]) => ({
    ...acc,
    [k]: {
        ...v,
        ...partial[k],
    },
}), DEFAULT_NETWORK_CONFIG_MAP);
/**
 * Handles the connection to the Solana nodes.
 * @returns
 */
export const useConnectionInternal = ({ 
// default to mainnet-beta
defaultNetwork = "mainnet-beta", networkConfigs = DEFAULT_NETWORK_CONFIG_MAP, commitment = "confirmed", storageAdapter, }) => {
    const [network, setNetwork] = usePersistedKVStore("use-solana/network", defaultNetwork, storageAdapter);
    const configMap = makeNetworkConfigMap(networkConfigs);
    const config = configMap[network];
    const [{ endpoint, endpointWs, ...connectionConfigArgs }, setEndpoints] = usePersistedKVStore(`use-solana/rpc-endpoint/${network}`, config, storageAdapter);
    const connection = useMemo(() => {
        var _a;
        return new Connection(endpoint, {
            ...connectionConfigArgs,
            commitment: (_a = connectionConfigArgs.commitment) !== null && _a !== void 0 ? _a : commitment,
            wsEndpoint: endpointWs,
        });
    }, [commitment, connectionConfigArgs, endpoint, endpointWs]);
    const sendConnection = useMemo(() => {
        var _a;
        return new Connection(endpoint, {
            ...connectionConfigArgs,
            commitment: (_a = connectionConfigArgs.commitment) !== null && _a !== void 0 ? _a : commitment,
            wsEndpoint: endpointWs,
        });
    }, [commitment, connectionConfigArgs, endpoint, endpointWs]);
    return {
        connection,
        sendConnection,
        network,
        setNetwork,
        endpoint,
        setEndpoints,
    };
};
//# sourceMappingURL=useConnectionInternal.js.map