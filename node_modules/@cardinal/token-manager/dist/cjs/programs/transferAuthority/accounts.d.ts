import type { AccountData } from "@cardinal/common";
import type { Connection, PublicKey } from "@solana/web3.js";
import type { ListingData, MarketplaceData, TransferAuthorityData, TransferData } from "./constants";
export declare const getTransferAuthority: (connection: Connection, transferAuthorityId: PublicKey) => Promise<AccountData<TransferAuthorityData>>;
export declare const getTransferAuthorityByName: (connection: Connection, name: string) => Promise<AccountData<TransferAuthorityData>>;
export declare const getAllTransferAuthorities: (connection: Connection) => Promise<AccountData<TransferAuthorityData>[]>;
export declare const getMarketplace: (connection: Connection, marketplaceId: PublicKey) => Promise<AccountData<MarketplaceData>>;
export declare const getMarketplaceByName: (connection: Connection, name: string) => Promise<AccountData<MarketplaceData>>;
export declare const getAllMarketplaces: (connection: Connection) => Promise<AccountData<MarketplaceData>[]>;
export declare const getListing: (connection: Connection, mintId: PublicKey) => Promise<AccountData<ListingData>>;
export declare const getListingsForMarketplace: (connection: Connection, marketplaceId: PublicKey) => Promise<AccountData<ListingData>[]>;
export declare const getListingsForIssuer: (connection: Connection, issuerId: PublicKey) => Promise<AccountData<ListingData>[]>;
export declare const getAllListings: (connection: Connection) => Promise<AccountData<ListingData>[]>;
export declare const getTransfer: (connection: Connection, mintId: PublicKey) => Promise<AccountData<TransferData>>;
export declare const getTransfersFromUser: (connection: Connection, from: PublicKey) => Promise<AccountData<TransferData>[]>;
export declare const getTransfersToUser: (connection: Connection, to: PublicKey) => Promise<AccountData<TransferData>[]>;
export declare const getAllOfType: <T>(connection: Connection, key: string) => Promise<AccountData<T>[]>;
//# sourceMappingURL=accounts.d.ts.map