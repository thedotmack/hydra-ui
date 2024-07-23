"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useConnectionInternal = void 0;
const solana_contrib_1 = require("@saberhq/solana-contrib");
const web3_js_1 = require("@solana/web3.js");
const react_1 = require("react");
const usePersistedKVStore_1 = require("./usePersistedKVStore");
const makeNetworkConfigMap = (partial) => Object.entries(solana_contrib_1.DEFAULT_NETWORK_CONFIG_MAP).reduce((acc, [k, v]) => ({
    ...acc,
    [k]: {
        ...v,
        ...partial[k],
    },
}), solana_contrib_1.DEFAULT_NETWORK_CONFIG_MAP);
/**
 * Handles the connection to the Solana nodes.
 * @returns
 */
const useConnectionInternal = ({ 
// default to mainnet-beta
defaultNetwork = "mainnet-beta", networkConfigs = solana_contrib_1.DEFAULT_NETWORK_CONFIG_MAP, commitment = "confirmed", storageAdapter, }) => {
    const [network, setNetwork] = (0, usePersistedKVStore_1.usePersistedKVStore)("use-solana/network", defaultNetwork, storageAdapter);
    const configMap = makeNetworkConfigMap(networkConfigs);
    const config = configMap[network];
    const [{ endpoint, endpointWs, ...connectionConfigArgs }, setEndpoints] = (0, usePersistedKVStore_1.usePersistedKVStore)(`use-solana/rpc-endpoint/${network}`, config, storageAdapter);
    const connection = (0, react_1.useMemo)(() => {
        var _a;
        return new web3_js_1.Connection(endpoint, {
            ...connectionConfigArgs,
            commitment: (_a = connectionConfigArgs.commitment) !== null && _a !== void 0 ? _a : commitment,
            wsEndpoint: endpointWs,
        });
    }, [commitment, connectionConfigArgs, endpoint, endpointWs]);
    const sendConnection = (0, react_1.useMemo)(() => {
        var _a;
        return new web3_js_1.Connection(endpoint, {
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
exports.useConnectionInternal = useConnectionInternal;
//# sourceMappingURL=useConnectionInternal.js.map