import type { AccountData } from "@cardinal/common";
import type { Commitment, Connection, PublicKey } from "@solana/web3.js";
import type { GroupRewardCounterData, GroupRewardDistributorData, GroupRewardEntryData } from "./constants";
export declare const getGroupRewardCounter: (connection: Connection, groupRewardCounterId: PublicKey, commitment?: Commitment) => Promise<AccountData<GroupRewardCounterData>>;
export declare const getGroupRewardCounters: (connection: Connection, groupRewardCounterIds: PublicKey[], commitment?: Commitment) => Promise<AccountData<GroupRewardCounterData>[]>;
export declare const getGroupRewardEntry: (connection: Connection, groupRewardEntryId: PublicKey, commitment?: Commitment) => Promise<AccountData<GroupRewardEntryData>>;
export declare const getGroupRewardEntries: (connection: Connection, groupRewardEntryIds: PublicKey[], commitment?: Commitment) => Promise<AccountData<GroupRewardEntryData>[]>;
export declare const getGroupRewardDistributor: (connection: Connection, groupRewardDistributorId: PublicKey, commitment?: Commitment) => Promise<AccountData<GroupRewardDistributorData>>;
export declare const getGroupRewardDistributors: (connection: Connection, groupRewardDistributorIds: PublicKey[], commitment?: Commitment) => Promise<AccountData<GroupRewardDistributorData>[]>;
export declare const getGroupRewardEntriesForGroupRewardDistributor: (connection: Connection, groupRewardDistributorId: PublicKey, commitment?: Commitment) => Promise<AccountData<GroupRewardEntryData>[]>;
export declare const getAllGroupRewardEntries: (connection: Connection, commitment?: Commitment) => Promise<AccountData<GroupRewardEntryData>[]>;
//# sourceMappingURL=accounts.d.ts.map