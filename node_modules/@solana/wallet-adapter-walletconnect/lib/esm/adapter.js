import { BaseSignerWalletAdapter, WalletAdapterNetwork, WalletConnectionError, WalletDisconnectedError, WalletDisconnectionError, WalletLoadError, WalletNotConnectedError, WalletNotReadyError, WalletReadyState, WalletSignMessageError, WalletSignTransactionError, WalletWindowClosedError, } from '@solana/wallet-adapter-base';
export const WalletConnectWalletName = 'WalletConnect';
export class WalletConnectWalletAdapter extends BaseSignerWalletAdapter {
    constructor(config) {
        super();
        this.name = WalletConnectWalletName;
        this.url = 'https://walletconnect.org';
        this.icon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtNjEuNDM4NTQsOTQuMDAzOGM0OC45MTEyMywtNDcuODg4MTcgMTI4LjIxMTk5LC00Ny44ODgxNyAxNzcuMTIzMjEsMGw1Ljg4NjU1LDUuNzYzNDJjMi40NDU1NiwyLjM5NDQxIDIuNDQ1NTYsNi4yNzY1MSAwLDguNjcwOTJsLTIwLjEzNjcsMTkuNzE1NWMtMS4yMjI3OCwxLjE5NzIxIC0zLjIwNTMsMS4xOTcyMSAtNC40MjgwOCwwbC04LjEwMDU4LC03LjkzMTE1Yy0zNC4xMjE2OSwtMzMuNDA3OTggLTg5LjQ0Mzg5LC0zMy40MDc5OCAtMTIzLjU2NTU4LDBsLTguNjc1MDYsOC40OTM2MWMtMS4yMjI3OCwxLjE5NzIgLTMuMjA1MywxLjE5NzIgLTQuNDI4MDgsMGwtMjAuMTM2NjksLTE5LjcxNTVjLTIuNDQ1NTYsLTIuMzk0NDEgLTIuNDQ1NTYsLTYuMjc2NTIgMCwtOC42NzA5Mmw2LjQ2MTAxLC02LjMyNTg4em0yMTguNzY3OCw0MC43NzM3NWwxNy45MjE3LDE3LjU0Njg5YzIuNDQ1NTQsMi4zOTQ0IDIuNDQ1NTYsNi4yNzY0OCAwLjAwMDAzLDguNjcwODlsLTgwLjgxMDE3LDc5LjEyMTE0Yy0yLjQ0NTU1LDIuMzk0NDIgLTYuNDEwNTksMi4zOTQ0NSAtOC44NTYxNiwwLjAwMDA2Yy0wLjAwMDAxLC0wLjAwMDAxIC0wLjAwMDAzLC0wLjAwMDAyIC0wLjAwMDA0LC0wLjAwMDAzbC01Ny4zNTQxNCwtNTYuMTU0NThjLTAuNjExMzksLTAuNTk4NiAtMS42MDI2NSwtMC41OTg2IC0yLjIxNDA0LDBjMCwwLjAwMDAxIC0wLjAwMDAxLDAuMDAwMDEgLTAuMDAwMDEsMC4wMDAwMmwtNTcuMzUyOTIsNTYuMTU0NTNjLTIuNDQ1NTQsMi4zOTQ0MyAtNi40MTA1OCwyLjM5NDQ3IC04Ljg1NjE2LDAuMDAwMDhjLTAuMDAwMDIsLTAuMDAwMDEgLTAuMDAwMDMsLTAuMDAwMDIgLTAuMDAwMDUsLTAuMDAwMDRsLTgwLjgxMjQyLC03OS4xMjIxOWMtMi40NDU1NiwtMi4zOTQ0IC0yLjQ0NTU2LC02LjI3NjUxIDAsLTguNjcwOTFsMTcuOTIxNzMsLTE3LjU0Njg3YzIuNDQ1NTYsLTIuMzk0NDEgNi40MTA2LC0yLjM5NDQxIDguODU2MTYsMGw1Ny4zNTQ5OCw1Ni4xNTUzNWMwLjYxMTM5LDAuNTk4NjEgMS42MDI2NSwwLjU5ODYxIDIuMjE0MDQsMGMwLjAwMDAxLDAgMC4wMDAwMiwtMC4wMDAwMSAwLjAwMDAzLC0wLjAwMDAybDU3LjM1MjEsLTU2LjE1NTMzYzIuNDQ1NSwtMi4zOTQ0NyA2LjQxMDU0LC0yLjM5NDU2IDguODU2MTYsLTAuMDAwMmMwLjAwMDAzLDAuMDAwMDMgMC4wMDAwNywwLjAwMDA3IDAuMDAwMSwwLjAwMDFsNTcuMzU0OSw1Ni4xNTU0M2MwLjYxMTM5LDAuNTk4NiAxLjYwMjY1LDAuNTk4NiAyLjIxNDA0LDBsNTcuMzUzOTgsLTU2LjE1NDMyYzIuNDQ1NTYsLTIuMzk0NDEgNi40MTA2LC0yLjM5NDQxIDguODU2MTYsMHoiIGZpbGw9IiMzYjk5ZmMiIGlkPSJzdmdfMSIvPjwvc3ZnPg==';
        this.supportedTransactionVersions = null;
        this._readyState = typeof window === 'undefined' ? WalletReadyState.Unsupported : WalletReadyState.Loadable;
        this._disconnected = () => {
            const wallet = this._wallet;
            if (wallet) {
                wallet.client.off('session_delete', this._disconnected);
                this._wallet = null;
                this._publicKey = null;
                this.emit('error', new WalletDisconnectedError());
                this.emit('disconnect');
            }
        };
        this._publicKey = null;
        this._connecting = false;
        this._wallet = null;
        this._config = config;
    }
    get publicKey() {
        return this._publicKey;
    }
    get connecting() {
        return this._connecting;
    }
    get readyState() {
        return this._readyState;
    }
    async connect() {
        try {
            if (this.connected || this.connecting)
                return;
            if (this._readyState !== WalletReadyState.Loadable)
                throw new WalletNotReadyError();
            this._connecting = true;
            let WalletConnectClass;
            let WCChainID;
            try {
                ({ WalletConnectWallet: WalletConnectClass, WalletConnectChainID: WCChainID } = await import('@jnwng/walletconnect-solana'));
            }
            catch (error) {
                throw new WalletLoadError(error?.message, error);
            }
            let wallet;
            let publicKey;
            try {
                wallet = new WalletConnectClass({
                    network: this._config.network === WalletAdapterNetwork.Mainnet ? WCChainID.Mainnet : WCChainID.Devnet,
                    options: this._config.options,
                });
                ({ publicKey } = await wallet.connect());
            }
            catch (error) {
                if (error.constructor.name === 'QRCodeModalError')
                    throw new WalletWindowClosedError();
                throw new WalletConnectionError(error?.message, error);
            }
            wallet.client.on('session_delete', this._disconnected);
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
            wallet.client.off('session_delete', this._disconnected);
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
                return (await wallet.signTransaction(transaction));
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
                return await wallet.signMessage(message);
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