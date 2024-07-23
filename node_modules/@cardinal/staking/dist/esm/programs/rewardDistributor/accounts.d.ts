import type { AccountData } from "@cardinal/common";
import type { Commitment, Connection, PublicKey } from "@solana/web3.js";
import type { RewardDistributorData, RewardEntryData } from "./constants";
export declare const getRewardEntry: (connection: Connection, rewardEntryId: PublicKey, commitment?: Commitment) => Promise<AccountData<RewardEntryData>>;
export declare const getRewardEntries: (connection: Connection, rewardEntryIds: PublicKey[], commitment?: Commitment) => Promise<AccountData<RewardEntryData>[]>;
export declare const getRewardDistributor: (connection: Connection, rewardDistributorId: PublicKey, commitment?: Commitment) => Promise<AccountData<RewardDistributorData>>;
export declare const getRewardDistributors: (connection: Connection, rewardDistributorIds: PublicKey[], commitment?: Commitment) => Promise<AccountData<RewardDistributorData>[]>;
export declare const getRewardEntriesForRewardDistributor: (connection: Connection, rewardDistributorId: PublicKey, commitment?: Commitment) => Promise<AccountData<RewardEntryData>[]>;
export declare const getAllRewardEntries: (connection: Connection, commitment?: Commitment) => Promise<AccountData<RewardEntryData>[]>;
//# sourceMappingURL=accounts.d.ts.map