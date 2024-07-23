import type { AccountData } from "@cardinal/common";
import type { Connection, PublicKey } from "@solana/web3.js";
import type { TokenManagerState } from ".";
import type { MintCounterData, MintManagerData, TokenManagerData, TransferReceiptData } from "./constants";
export declare const getTokenManager: (connection: Connection, tokenManagerId: PublicKey) => Promise<AccountData<TokenManagerData>>;
export declare const getTokenManagers: (connection: Connection, tokenManagerIds: PublicKey[]) => Promise<AccountData<TokenManagerData | null>[]>;
export declare const getTokenManagersByState: (connection: Connection, state: TokenManagerState | null) => Promise<AccountData<TokenManagerData>[]>;
export declare const getMintManager: (connection: Connection, mintManagerId: PublicKey) => Promise<AccountData<MintManagerData>>;
export declare const getMintCounter: (connection: Connection, mintCounterId: PublicKey) => Promise<AccountData<MintCounterData>>;
export declare const getTokenManagersForIssuer: (connection: Connection, issuerId: PublicKey) => Promise<AccountData<TokenManagerData>[]>;
export declare const getTransferReceipt: (connection: Connection, transferReceiptId: PublicKey) => Promise<AccountData<TransferReceiptData>>;
//# sourceMappingURL=accounts.d.ts.map