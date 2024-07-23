import { BaseMessageSignerWalletAdapter, scopePollingDetectionStrategy, WalletAccountError, WalletConnectionError, WalletDisconnectedError, WalletDisconnectionError, WalletNotConnectedError, WalletNotReadyError, WalletPublicKeyError, WalletReadyState, WalletSignMessageError, WalletSignTransactionError, } from '@solana/wallet-adapter-base';
import { PublicKey } from '@solana/web3.js';
export const XDEFIWalletName = 'XDEFI';
export class XDEFIWalletAdapter extends BaseMessageSignerWalletAdapter {
    constructor(config = {}) {
        super();
        this.name = XDEFIWalletName;
        this.url = 'https://xdefi.io';
        this.icon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE0LjI2MjggMTMuNDAxM0MxMi40MjI4IDE0LjUzMDcgOS45NTk5NyAxNS4xMTI0IDcuNDY1NjkgMTQuOTg4MUM1LjM2ODU1IDE0Ljg4NjUgMy42NDg1NSAxNC4xNDExIDIuNjA4NTUgMTIuOTE1N0MxLjY5NDI2IDExLjgyMDEgMS4zMzk5OCAxMC4zNzQ1IDEuNTc5OTggOC43MTE0M0MxLjY2MTMyIDguMTU4NzQgMS44MjgwMiA3LjYyMTY2IDIuMDc0MjYgNy4xMTg5NkwyLjEwODU1IDcuMDQ4MzdDMi45NzE4IDUuNDA1OTUgNC4yNTI5MyA0LjAxMzk3IDUuODI1ODQgMy4wMDk0MkM3LjM5ODc1IDIuMDA0ODYgOS4yMDkyNCAxLjQyMjM2IDExLjA3OTEgMS4zMTkyNEMxMi45NDkgMS4yMTYxMSAxNC44MTM4IDEuNTk1OTIgMTYuNDkwMSAyLjQyMTI4QzE4LjE2NjMgMy4yNDY2NSAxOS41OTYyIDQuNDg5MTIgMjAuNjM5IDYuMDI2NDFDMjEuNjgxOSA3LjU2MzcxIDIyLjMwMTcgOS4zNDI4NSAyMi40Mzc0IDExLjE4ODdDMjIuNTczMiAxMy4wMzQ2IDIyLjIyMDMgMTQuODgzNiAyMS40MTM0IDE2LjU1MzhDMjAuNjA2NSAxOC4yMjQgMTkuMzczNSAxOS42NTc3IDE3LjgzNTYgMjAuNzE0QzE2LjI5NzggMjEuNzcwMiAxNC41MDgxIDIyLjQxMjYgMTIuNjQyOCAyMi41Nzc4TDEyLjc1NzEgMjMuODczOEMxNC44NTE0IDIzLjY4OTQgMTYuODYxIDIyLjk2OTEgMTguNTg3OCAyMS43ODM3QzIwLjMxNDcgMjAuNTk4NCAyMS42OTkzIDE4Ljk4ODkgMjIuNjA1MiAxNy4xMTM4QzIzLjUxMTEgMTUuMjM4NyAyMy45MDcxIDEzLjE2MjcgMjMuNzU0MiAxMS4wOTA0QzIzLjYwMTIgOS4wMTgwOCAyMi45MDQ2IDcuMDIwODggMjEuNzMyOSA1LjI5NTU1QzIwLjU2MTMgMy41NzAyMiAxOC45NTUgMi4xNzYzIDE3LjA3MjQgMS4yNTExMUMxNS4xODk4IDAuMzI1OTA5IDEzLjA5NTcgLTAuMDk4NjQxMSAxMC45OTY1IDAuMDE5Mjc4N0M4Ljg5NzMzIDAuMTM3MTk4IDYuODY1NDQgMC43OTM1MiA1LjEwMTAyIDEuOTIzNTlDMy4zMzY2IDMuMDUzNjUgMS45MDA1MyA0LjYxODQ4IDAuOTM0MjY0IDYuNDYzOUwwLjg4ODU0OCA2LjU1NzA3QzAuNTgzMDgzIDcuMTgwOSAwLjM3Njg0NyA3Ljg0NzU2IDAuMjc3MTIgOC41MzM1NEMtMC4wMDg1OTQ1IDEwLjU2MDggMC40MzQyNiAxMi4zNjUxIDEuNTkxNCAxMy43NTQyQzIuODU3MTIgMTUuMjczMyA0LjkxNzEyIDE2LjE3NjggNy4zODg1NSAxNi4yOTU0QzEwLjM5NzEgMTYuNDQ1MSAxMy4zODg1IDE1LjYzNDcgMTUuNTExNCAxNC4xNDM5TDE0LjI2MjggMTMuNDAxM1oiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xNi43OCAxNC44NzUxQzE1LjU4MjkgMTUuOTAyOSAxMi44IDE3Ljc2NjQgOC4xODI4NiAxOC4wMjA1QzMuMDE0MjkgMTguMzAyOSAwLjg2MDAwMSAxNi42NDI3IDAuODQwMDAxIDE2LjYyNTdMMC40MjI4NTYgMTcuMTMzOUwwLjg0Mjg1NiAxNi42MzQyTDAgMTcuNjMzN0MwLjA5MTQyODYgMTcuNzA5OSAyLjE1NzE0IDE5LjM1ODkgNy4wMDg1NyAxOS4zNTg5QzcuNDA1NzEgMTkuMzU4OSA3LjgyMjg2IDE5LjM1ODkgOC4yNTcxNCAxOS4zMjVDMTMuODM3MSAxOS4wMTcyIDE2LjkwMjkgMTYuNjExNiAxNy45NzE0IDE1LjU4MzhMMTYuNzggMTQuODc1MVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xOS4wMiAxNi4yMTkyQzE4LjMxMjEgMTcuMTM4NyAxNy40NDA4IDE3LjkyMzMgMTYuNDQ4NiAxOC41MzQ1QzEyLjk1MTUgMjAuNzY1IDguNTAyODkgMjEuMDUzIDUuMzg4NiAyMC44OTc4TDUuMzIyODkgMjIuMTk5NEM1Ljg0NTc1IDIyLjIyNDggNi4zNDg2MSAyMi4yMzYxIDYuODM3MTggMjIuMjM2MUMxNS42MiAyMi4yMzYxIDE5LjE2ODYgMTguMjgzMiAyMC4xNiAxNi44NzE0TDE5LjAxNzIgMTYuMjA3OSIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTE4LjY4NTcgMTEuMjkyMkMxOS4yNjggMTEuMjkyMiAxOS43NCAxMC44MjU3IDE5Ljc0IDEwLjI1MDNDMTkuNzQgOS42NzQ4OSAxOS4yNjggOS4yMDg0MiAxOC42ODU3IDkuMjA4NDJDMTguMTAzNCA5LjIwODQyIDE3LjYzMTQgOS42NzQ4OSAxNy42MzE0IDEwLjI1MDNDMTcuNjMxNCAxMC44MjU3IDE4LjEwMzQgMTEuMjkyMiAxOC42ODU3IDExLjI5MjJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K';
        this.supportedTransactionVersions = null;
        this._readyState = typeof window === 'undefined' || typeof document === 'undefined'
            ? WalletReadyState.Unsupported
            : WalletReadyState.NotDetected;
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
        this._connecting = false;
        this._wallet = null;
        this._publicKey = null;
        if (this._readyState !== WalletReadyState.Unsupported) {
            scopePollingDetectionStrategy(() => {
                if (window.xfi?.solana?.isXDEFI) {
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
        return !!this._wallet?.isConnected;
    }
    get readyState() {
        return this._readyState;
    }
    async connect() {
        try {
            if (this.connected || this.connecting)
                return;
            if (this._readyState !== WalletReadyState.Installed)
                throw new WalletNotReadyError();
            this._connecting = true;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const wallet = window.xfi.solana;
            if (!wallet.isConnected) {
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
                const { signature } = await wallet.signMessage(message);
                return signature;
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