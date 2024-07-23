import { BaseMessageSignerWalletAdapter, scopePollingDetectionStrategy, WalletAccountError, WalletAdapterNetwork, WalletConfigError, WalletConnectionError, WalletDisconnectedError, WalletDisconnectionError, WalletLoadError, WalletNotConnectedError, WalletNotReadyError, WalletPublicKeyError, WalletReadyState, WalletSignMessageError, WalletSignTransactionError, } from '@solana/wallet-adapter-base';
import { PublicKey } from '@solana/web3.js';
export const SalmonWalletName = 'Salmon';
export class SalmonWalletAdapter extends BaseMessageSignerWalletAdapter {
    constructor({ network = WalletAdapterNetwork.Mainnet } = {}) {
        super();
        this.name = SalmonWalletName;
        this.url = 'https://salmonwallet.io';
        this.icon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHZpZXdCb3g9IjAgMCA4OCA4OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijg4IiBoZWlnaHQ9Ijg4IiByeD0iMzAiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl84NTVfNTgwKSIvPgo8cGF0aCBkPSJNNTkuODA1NSAyNy42M0M1Ni43OTU1IDI1LjgyMzkgNTMuNjIyMiAyNC41Mzg4IDUwLjM1OTcgMjMuODE0NEw0Ni45MDQyIDE2LjEyODdDNDYuNDkzMyAxNC44NTg1IDQ1LjMwMDIgMTQuMDAwMSA0My45NTM3IDE0LjAwMDFINDMuODE1QzQyLjQ2ODUgMTQuMDAwMSA0MS4yNzU0IDE0Ljg2MzUgNDAuODY0NSAxNi4xMjg3TDM3LjQwOSAyMy44MDk1QzM0LjE0MTYgMjQuNTM4OCAzMC45NTgzIDI1LjgyODkgMjcuOTQzNCAyNy42MzQ5QzIxLjk1MzIgMzkuMjYwMyAyMC4zMjk0IDUwLjU5MjggMjEuMTQxMyA2MS43NjY2QzI0LjY1MTMgNjUuMTY1NCAzMi40MzM2IDY5LjM2OCAzNi42MDcgNzEuMDMwMkMzOS4wNTI2IDcyLjAwMjcgMzkuODAwMSA3Mi40OTM5IDQyLjI1MDYgNzIuOTAwN0M0NC40Mjg5IDczLjUxNiA0NS4wODczIDczLjI3NzggNDYuNzU1NyA3My4xMDQyQzQ5LjMyNTEgNzIuNDE5NSA1MC4zOTQ0IDcxLjcyNDggNTEuNDM0IDcxLjE2NDFDNTUuODQ5OSA2OC44NzY4IDYzLjExNzQgNjUuMTcwNCA2Ni42Mjc0IDYxLjc3MTZDNjcuNTc3OSA0OC44MTE2IDY0Ljk5ODYgMzcuNTgzMiA1OS44MDU1IDI3LjYyNVYyNy42M1pNMzcuNTI3OCA1MS4xNDg1QzM1LjY0MTYgNTEuMTQ4NSAzNC4wODIyIDQ4LjkwMDkgMzQuMDgyMiA0Ni4xMzIyQzM0LjA4MjIgNDMuMzYzNiAzNS41ODcxIDQxLjA5NjEgMzcuNTE3OSA0MS4wOTYxQzM5LjQ0ODYgNDEuMDk2MSA0MC45OTgxIDQzLjM2MzYgNDAuOTYzNSA0Ni4xMzIyQzQwLjkyODggNDguOTAwOSAzOS40NDM3IDUxLjE0ODUgMzcuNTIyOCA1MS4xNDg1SDM3LjUyNzhaTTUwLjIzMSA1MS4xNDg1QzQ4LjMzOTkgNTEuMTQ4NSA0Ni43OTAzIDQ4LjkwMDkgNDYuNzkwMyA0Ni4xMzIyQzQ2Ljc5MDMgNDMuMzYzNiA0OC4yOTUzIDQxLjA5NjEgNTAuMjMxIDQxLjA5NjFDNTIuMTY2NyA0MS4wOTYxIDUzLjcwMTQgNDMuMzYzNiA1My42NjY3IDQ2LjEzMjJDNTMuNjMyMSA0OC45MDA5IDUyLjE1MTggNTEuMTQ4NSA1MC4yMzEgNTEuMTQ4NVoiIGZpbGw9IiNGQ0ZDRkMiLz4KPHBhdGggZD0iTTc1LjQwNTEgNTYuMTIwM0w3MC45NzkzIDQyLjE3MjlDNzAuNDM0NyA0MC40NjYxIDY4Ljg1NTUgMzkuMzA1MSA2Ny4wNjMzIDM5LjMwNTFDNjYuNTI4NyAzOS4zMDUxIDY2LjAwODkgMzkuNDA5MiA2NS41Mjg3IDM5LjYwMjhDNjcuNTQ4NSA0Ni4zMjU5IDY4LjM2MDQgNTMuNTc5OSA2Ny43MjY3IDYxLjQ4NEg3MS40ODQyQzc0LjI2NjUgNjEuNDg0IDc2LjI0MTcgNTguNzc0OSA3NS40MDAxIDU2LjEyMDNINzUuNDA1MVoiIGZpbGw9IiNGQ0ZDRkMiLz4KPHBhdGggZD0iTTEyLjE5MDggNTYuMzgzNUwxNi42MTY2IDQyLjQzNjFDMTcuMTYxMiA0MC43MjkyIDE4Ljc0MDUgMzkuNTY4MiAyMC41MzI2IDM5LjU2ODJDMjEuMDY3MiAzOS41NjgyIDIxLjU4NyAzOS42NzI0IDIyLjA2NzMgMzkuODY1OUMyMC4wNDc0IDQ2LjU4OSAxOS4yMzU1IDUzLjg0MzEgMTkuODY5MiA2MS43NDcxSDE2LjExMTdDMTMuMzI5NSA2MS43NDcxIDExLjM1NDIgNTkuMDM4IDEyLjE5NTggNTYuMzgzNUgxMi4xOTA4WiIgZmlsbD0iI0ZDRkNGQyIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzg1NV81ODAiIHgxPSI0NCIgeTE9IjAiIHgyPSI0NCIgeTI9Ijg4IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiNGRjgxNzAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY1QzQ1Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+';
        this.supportedTransactionVersions = null;
        this._readyState = typeof window === 'undefined' || typeof document === 'undefined'
            ? WalletReadyState.Unsupported
            : WalletReadyState.Loadable;
        this._disconnected = () => {
            const wallet = this._wallet;
            if (wallet) {
                wallet.off('disconnect', this._disconnected);
                this._wallet = null;
                this._publicKey = null;
                this.emit('error', new WalletDisconnectedError());
                this.emit('disconnect');
            }
        };
        this._network = network;
        this._connecting = false;
        this._wallet = null;
        this._publicKey = null;
        if (this._readyState !== WalletReadyState.Unsupported) {
            scopePollingDetectionStrategy(() => {
                if (window.salmon) {
                    this._readyState = WalletReadyState.Installed;
                    this.emit('readyStateChange', this._readyState);
                    return true;
                }
                return false;
            });
        }
    }
    get publicKey() {
        return this._publicKey;
    }
    get connecting() {
        return this._connecting;
    }
    get connected() {
        return !!this._wallet?.connected;
    }
    get readyState() {
        return this._readyState;
    }
    async connect() {
        try {
            if (this.connected || this.connecting)
                return;
            if (this._readyState !== WalletReadyState.Loadable && this._readyState !== WalletReadyState.Installed)
                throw new WalletNotReadyError();
            this._connecting = true;
            let SalmonClass;
            try {
                SalmonClass = (await import('salmon-adapter-sdk')).default;
            }
            catch (error) {
                throw new WalletLoadError(error?.message, error);
            }
            let wallet;
            try {
                wallet = new SalmonClass({ network: this._network });
            }
            catch (error) {
                throw new WalletConfigError(error?.message, error);
            }
            if (!wallet.connected) {
                try {
                    await wallet.connect();
                }
                catch (error) {
                    throw new WalletConnectionError(error?.message, error);
                }
            }
            if (!wallet.publicKey)
                throw new WalletAccountError();
            let publicKey;
            try {
                publicKey = new PublicKey(wallet.publicKey.toBytes());
            }
            catch (error) {
                throw new WalletPublicKeyError(error?.message, error);
            }
            wallet.on('disconnect', this._disconnected);
            this._wallet = wallet;
            this._publicKey = publicKey;
            this.emit('connect', publicKey);
        }
        catch (error) {
            this.emit('error', error);
            throw error;
        }
        finally {
            this._connecting = false;
        }
    }
    async disconnect() {
        const wallet = this._wallet;
        if (wallet) {
            wallet.off('disconnect', this._disconnected);
            this._wallet = null;
            this._publicKey = null;
            try {
                await wallet.disconnect();
            }
            catch (error) {
                this.emit('error', new WalletDisconnectionError(error?.message, error));
            }
        }
        this.emit('disconnect');
    }
    async signTransaction(transaction) {
        try {
            const wallet = this._wallet;
            if (!wallet)
                throw new WalletNotConnectedError();
            try {
                return (await wallet.signTransaction(transaction)) || transaction;
            }
            catch (error) {
                throw new WalletSignTransactionError(error?.message, error);
            }
        }
        catch (error) {
            this.emit('error', error);
            throw error;
        }
    }
    async signAllTransactions(transactions) {
        try {
            const wallet = this._wallet;
            if (!wallet)
                throw new WalletNotConnectedError();
            try {
                return (await wallet.signAllTransactions(transactions)) || transactions;
            }
            catch (error) {
                throw new WalletSignTransactionError(error?.message, error);
            }
        }
        catch (error) {
            this.emit('error', error);
            throw error;
        }
    }
    async signMessage(message) {
        try {
            const wallet = this._wallet;
            if (!wallet)
                throw new WalletNotConnectedError();
            try {
                return await wallet.signMessage(message, 'utf8');
            }
            catch (error) {
                throw new WalletSignMessageError(error?.message, error);
            }
        }
        catch (error) {
            this.emit('error', error);
            throw error;
        }
    }
}
//# sourceMappingURL=adapter.js.map