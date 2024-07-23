import { useSolana } from "./context";
/**
 * Gets the current Solana wallet.
 */
export function useWallet() {
    const context = useSolana();
    if (!context) {
        throw new Error("wallet not loaded");
    }
    return context;
}
/**
 * Gets the current Solana wallet, returning null if it is not connected.
 */
export const useConnectedWallet = () => {
    const { wallet, connected, walletActivating } = useWallet();
    if (!(wallet === null || wallet === void 0 ? void 0 : wallet.connected) ||
        !connected ||
        !wallet.publicKey ||
        walletActivating) {
        return null;
    }
    return wallet;
};
/**
 * Loads the connection context
 * @returns
 */
export function useConnectionContext() {
    const context = useSolana();
    if (!context) {
        throw new Error("Not in context");
    }
    return context;
}
/**
 * Gets the read connection
 * @returns
 */
export function useConnection() {
    return useConnectionContext().connection;
}
/**
 * Gets the send connection
 * @returns
 */
export function useSendConnection() {
    return useConnectionContext().sendConnection;
}
//# sourceMappingURL=hooks.js.map