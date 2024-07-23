import { type Adapter, type WalletError } from '@solana/wallet-adapter-base';
import { type ReactNode } from 'react';
export interface WalletProviderProps {
    children: ReactNode;
    wallets: Adapter[];
    autoConnect?: boolean;
    localStorageKey?: string;
    onError?: (error: WalletError, adapter?: Adapter) => void;
}
export declare function WalletProvider({ children, wallets: adapters, autoConnect, localStorageKey, onError, }: WalletProviderProps): JSX.Element;
//# sourceMappingURL=WalletProvider.d.ts.map