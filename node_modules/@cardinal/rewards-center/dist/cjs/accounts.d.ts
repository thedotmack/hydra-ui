/// <reference types="node" />
import type { NullableIdlAccountData, NullableIdlAccountInfo, ParsedIdlAccount } from "@cardinal/common";
import type { AllAccountsMap } from "@coral-xyz/anchor/dist/cjs/program/namespace/types";
import type { AccountInfo, Connection, GetAccountInfoConfig, GetProgramAccountsConfig, PublicKey } from "@solana/web3.js";
import type { CardinalRewardsCenter } from "./idl/cardinal_rewards_center";
/**
 * Fetch an account with idl types
 * @param connection
 * @param pubkey
 * @param accountType
 * @param config
 * @returns
 */
export declare const fetchIdlAccount: <T extends "stakePool" | "stakeEntry" | "userEscrow" | "stakeAuthorizationRecord" | "stakeBooster" | "receiptManager" | "rewardReceipt" | "rewardDistributor" | "rewardEntry" | "paymentInfo">(connection: Connection, pubkey: PublicKey, accountType: T, config?: GetAccountInfoConfig) => Promise<{
    pubkey: PublicKey;
    parsed: import("@coral-xyz/anchor/dist/cjs/program/namespace/types").TypeDef<AllAccountsMap<CardinalRewardsCenter>[T], {
        InitPaymentInfoIx: {
            authority: PublicKey;
            identifier: string;
            paymentAmount: import("bn.js");
            paymentMint: PublicKey;
            paymentShares: {
                address: PublicKey;
                basisPoints: number;
            }[];
        };
        PaymentShare: {
            address: PublicKey;
            basisPoints: number;
        };
        UpdatePaymentInfoIx: {
            authority: PublicKey;
            paymentAmount: import("bn.js");
            paymentMint: PublicKey;
            paymentShares: {
                address: PublicKey;
                basisPoints: number;
            }[];
        };
        InitRewardDistributorIx: {
            rewardAmount: import("bn.js");
            rewardDurationSeconds: import("bn.js");
            identifier: import("bn.js");
            supply: import("bn.js") | null;
            defaultMultiplier: import("bn.js") | null;
            multiplierDecimals: number | null;
            maxRewardSecondsReceived: import("bn.js") | null;
            claimRewardsPaymentInfo: PublicKey;
        };
        UpdateRewardDistributorIx: {
            defaultMultiplier: import("bn.js");
            multiplierDecimals: number;
            rewardAmount: import("bn.js");
            rewardDurationSeconds: import("bn.js");
            maxRewardSecondsReceived: import("bn.js") | null;
            claimRewardsPaymentInfo: PublicKey;
        };
        UpdateRewardEntryIx: {
            multiplier: import("bn.js");
        };
        InitReceiptManagerIx: {
            name: string;
            authority: PublicKey;
            requiredStakeSeconds: import("bn.js");
            stakeSecondsToUse: import("bn.js");
            paymentMint: PublicKey;
            paymentAmount: import("bn.js");
            paymentShares: {
                address: PublicKey;
                basisPoints: number;
            }[];
            requiresAuthorization: boolean;
            claimActionPaymentInfo: PublicKey;
            maxClaimedReceipts: import("bn.js") | null;
        };
        UpdateReceiptManagerIx: {
            authority: PublicKey;
            requiredStakeSeconds: import("bn.js");
            stakeSecondsToUse: import("bn.js");
            paymentMint: PublicKey;
            paymentAmount: import("bn.js");
            paymentShares: {
                address: PublicKey;
                basisPoints: number;
            }[];
            requiresAuthorization: boolean;
            claimActionPaymentInfo: PublicKey;
            maxClaimedReceipts: import("bn.js") | null;
        };
        BoostStakeEntryIx: {
            secondsToBoost: import("bn.js");
        };
        InitStakeBoosterIx: {
            stakePool: PublicKey;
            identifier: import("bn.js");
            paymentAmount: import("bn.js");
            paymentMint: PublicKey;
            paymentShares: {
                address: PublicKey;
                basisPoints: number;
            }[];
            boostSeconds: import("bn.js");
            startTimeSeconds: import("bn.js");
            boostActionPaymentInfo: PublicKey;
        };
        UpdateStakeBoosterIx: {
            paymentAmount: import("bn.js");
            paymentMint: PublicKey;
            paymentShares: {
                address: PublicKey;
                basisPoints: number;
            }[];
            boostSeconds: import("bn.js");
            startTimeSeconds: import("bn.js");
            boostActionPaymentInfo: PublicKey;
        };
        InitPoolIx: {
            allowedCollections: PublicKey[];
            allowedCreators: PublicKey[];
            requiresAuthorization: boolean;
            authority: PublicKey;
            resetOnUnstake: boolean;
            cooldownSeconds: number | null;
            minStakeSeconds: number | null;
            endDate: import("bn.js") | null;
            stakePaymentInfo: PublicKey;
            unstakePaymentInfo: PublicKey;
            identifier: string;
        };
        UpdatePoolIx: {
            allowedCollections: PublicKey[];
            allowedCreators: PublicKey[];
            requiresAuthorization: boolean;
            authority: PublicKey;
            resetOnUnstake: boolean;
            cooldownSeconds: number | null;
            minStakeSeconds: number | null;
            endDate: import("bn.js") | null;
            stakePaymentInfo: PublicKey;
            unstakePaymentInfo: PublicKey;
        };
        Action: {
            stake?: Record<string, never> | undefined;
            unstake?: Record<string, never> | undefined;
            claimRewards?: Record<string, never> | undefined;
            claimRewardReceipt?: Record<string, never> | undefined;
            boostStakeEntry?: Record<string, never> | undefined;
        };
    }>;
    type: T;
    executable: boolean;
    owner: PublicKey;
    lamports: number;
    data: Buffer;
    rentEpoch?: number | undefined;
}>;
/**
 * Fetch a possibly null account with idl types of a specific type
 * @param connection
 * @param pubkey
 * @param accountType
 * @param config
 * @param idl
 * @returns
 */
export declare const fetchIdlAccountNullable: <T extends "stakePool" | "stakeEntry" | "userEscrow" | "stakeAuthorizationRecord" | "stakeBooster" | "receiptManager" | "rewardReceipt" | "rewardDistributor" | "rewardEntry" | "paymentInfo">(connection: Connection, pubkey: PublicKey, accountType: T, config?: GetAccountInfoConfig) => Promise<{
    pubkey: PublicKey;
    parsed: import("@coral-xyz/anchor/dist/cjs/program/namespace/types").TypeDef<AllAccountsMap<CardinalRewardsCenter>[T], {
        InitPaymentInfoIx: {
            authority: PublicKey;
            identifier: string;
            paymentAmount: import("bn.js");
            paymentMint: PublicKey;
            paymentShares: {
                address: PublicKey;
                basisPoints: number;
            }[];
        };
        PaymentShare: {
            address: PublicKey;
            basisPoints: number;
        };
        UpdatePaymentInfoIx: {
            authority: PublicKey;
            paymentAmount: import("bn.js");
            paymentMint: PublicKey;
            paymentShares: {
                address: PublicKey;
                basisPoints: number;
            }[];
        };
        InitRewardDistributorIx: {
            rewardAmount: import("bn.js");
            rewardDurationSeconds: import("bn.js");
            identifier: import("bn.js");
            supply: import("bn.js") | null;
            defaultMultiplier: import("bn.js") | null;
            multiplierDecimals: number | null;
            maxRewardSecondsReceived: import("bn.js") | null;
            claimRewardsPaymentInfo: PublicKey;
        };
        UpdateRewardDistributorIx: {
            defaultMultiplier: import("bn.js");
            multiplierDecimals: number;
            rewardAmount: import("bn.js");
            rewardDurationSeconds: import("bn.js");
            maxRewardSecondsReceived: import("bn.js") | null;
            claimRewardsPaymentInfo: PublicKey;
        };
        UpdateRewardEntryIx: {
            multiplier: import("bn.js");
        };
        InitReceiptManagerIx: {
            name: string;
            authority: PublicKey;
            requiredStakeSeconds: import("bn.js");
            stakeSecondsToUse: import("bn.js");
            paymentMint: PublicKey;
            paymentAmount: import("bn.js");
            paymentShares: {
                address: PublicKey;
                basisPoints: number;
            }[];
            requiresAuthorization: boolean;
            claimActionPaymentInfo: PublicKey;
            maxClaimedReceipts: import("bn.js") | null;
        };
        UpdateReceiptManagerIx: {
            authority: PublicKey;
            requiredStakeSeconds: import("bn.js");
            stakeSecondsToUse: import("bn.js");
            paymentMint: PublicKey;
            paymentAmount: import("bn.js");
            paymentShares: {
                address: PublicKey;
                basisPoints: number;
            }[];
            requiresAuthorization: boolean;
            claimActionPaymentInfo: PublicKey;
            maxClaimedReceipts: import("bn.js") | null;
        };
        BoostStakeEntryIx: {
            secondsToBoost: import("bn.js");
        };
        InitStakeBoosterIx: {
            stakePool: PublicKey;
            identifier: import("bn.js");
            paymentAmount: import("bn.js");
            paymentMint: PublicKey;
            paymentShares: {
                address: PublicKey;
                basisPoints: number;
            }[];
            boostSeconds: import("bn.js");
            startTimeSeconds: import("bn.js");
            boostActionPaymentInfo: PublicKey;
        };
        UpdateStakeBoosterIx: {
            paymentAmount: import("bn.js");
            paymentMint: PublicKey;
            paymentShares: {
                address: PublicKey;
                basisPoints: number;
            }[];
            boostSeconds: import("bn.js");
            startTimeSeconds: import("bn.js");
            boostActionPaymentInfo: PublicKey;
        };
        InitPoolIx: {
            allowedCollections: PublicKey[];
            allowedCreators: PublicKey[];
            requiresAuthorization: boolean;
            authority: PublicKey;
            resetOnUnstake: boolean;
            cooldownSeconds: number | null;
            minStakeSeconds: number | null;
            endDate: import("bn.js") | null;
            stakePaymentInfo: PublicKey;
            unstakePaymentInfo: PublicKey;
            identifier: string;
        };
        UpdatePoolIx: {
            allowedCollections: PublicKey[];
            allowedCreators: PublicKey[];
            requiresAuthorization: boolean;
            authority: PublicKey;
            resetOnUnstake: boolean;
            cooldownSeconds: number | null;
            minStakeSeconds: number | null;
            endDate: import("bn.js") | null;
            stakePaymentInfo: PublicKey;
            unstakePaymentInfo: PublicKey;
        };
        Action: {
            stake?: Record<string, never> | undefined;
            unstake?: Record<string, never> | undefined;
            claimRewards?: Record<string, never> | undefined;
            claimRewardReceipt?: Record<string, never> | undefined;
            boostStakeEntry?: Record<string, never> | undefined;
        };
    }>;
    type: T;
    executable: boolean;
    owner: PublicKey;
    lamports: number;
    data: Buffer;
    rentEpoch?: number | undefined;
} | null>;
/**
 * Decode an account with idl types of a specific type
 * @param accountInfo
 * @param accountType
 * @param idl
 * @returns
 */
export declare const decodeIdlAccount: <T extends "stakePool" | "stakeEntry" | "userEscrow" | "stakeAuthorizationRecord" | "stakeBooster" | "receiptManager" | "rewardReceipt" | "rewardDistributor" | "rewardEntry" | "paymentInfo">(accountInfo: AccountInfo<Buffer>, accountType: T) => {
    type: T;
    parsed: import("@coral-xyz/anchor/dist/cjs/program/namespace/types").TypeDef<AllAccountsMap<CardinalRewardsCenter>[T], {
        InitPaymentInfoIx: {
            authority: PublicKey;
            identifier: string;
            paymentAmount: import("bn.js");
            paymentMint: PublicKey;
            paymentShares: {
                address: PublicKey;
                basisPoints: number;
            }[];
        };
        PaymentShare: {
            address: PublicKey;
            basisPoints: number;
        };
        UpdatePaymentInfoIx: {
            authority: PublicKey;
            paymentAmount: import("bn.js");
            paymentMint: PublicKey;
            paymentShares: {
                address: PublicKey;
                basisPoints: number;
            }[];
        };
        InitRewardDistributorIx: {
            rewardAmount: import("bn.js");
            rewardDurationSeconds: import("bn.js");
            identifier: import("bn.js");
            supply: import("bn.js") | null;
            defaultMultiplier: import("bn.js") | null;
            multiplierDecimals: number | null;
            maxRewardSecondsReceived: import("bn.js") | null;
            claimRewardsPaymentInfo: PublicKey;
        };
        UpdateRewardDistributorIx: {
            defaultMultiplier: import("bn.js");
            multiplierDecimals: number;
            rewardAmount: import("bn.js");
            rewardDurationSeconds: import("bn.js");
            maxRewardSecondsReceived: import("bn.js") | null;
            claimRewardsPaymentInfo: PublicKey;
        };
        UpdateRewardEntryIx: {
            multiplier: import("bn.js");
        };
        InitReceiptManagerIx: {
            name: string;
            authority: PublicKey;
            requiredStakeSeconds: import("bn.js");
            stakeSecondsToUse: import("bn.js");
            paymentMint: PublicKey;
            paymentAmount: import("bn.js");
            paymentShares: {
                address: PublicKey;
                basisPoints: number;
            }[];
            requiresAuthorization: boolean;
            claimActionPaymentInfo: PublicKey;
            maxClaimedReceipts: import("bn.js") | null;
        };
        UpdateReceiptManagerIx: {
            authority: PublicKey;
            requiredStakeSeconds: import("bn.js");
            stakeSecondsToUse: import("bn.js");
            paymentMint: PublicKey;
            paymentAmount: import("bn.js");
            paymentShares: {
                address: PublicKey;
                basisPoints: number;
            }[];
            requiresAuthorization: boolean;
            claimActionPaymentInfo: PublicKey;
            maxClaimedReceipts: import("bn.js") | null;
        };
        BoostStakeEntryIx: {
            secondsToBoost: import("bn.js");
        };
        InitStakeBoosterIx: {
            stakePool: PublicKey;
            identifier: import("bn.js");
            paymentAmount: import("bn.js");
            paymentMint: PublicKey;
            paymentShares: {
                address: PublicKey;
                basisPoints: number;
            }[];
            boostSeconds: import("bn.js");
            startTimeSeconds: import("bn.js");
            boostActionPaymentInfo: PublicKey;
        };
        UpdateStakeBoosterIx: {
            paymentAmount: import("bn.js");
            paymentMint: PublicKey;
            paymentShares: {
                address: PublicKey;
                basisPoints: number;
            }[];
            boostSeconds: import("bn.js");
            startTimeSeconds: import("bn.js");
            boostActionPaymentInfo: PublicKey;
        };
        InitPoolIx: {
            allowedCollections: PublicKey[];
            allowedCreators: PublicKey[];
            requiresAuthorization: boolean;
            authority: PublicKey;
            resetOnUnstake: boolean;
            cooldownSeconds: number | null;
            minStakeSeconds: number | null;
            endDate: import("bn.js") | null;
            stakePaymentInfo: PublicKey;
            unstakePaymentInfo: PublicKey;
            identifier: string;
        };
        UpdatePoolIx: {
            allowedCollections: PublicKey[];
            allowedCreators: PublicKey[];
            requiresAuthorization: boolean;
            authority: PublicKey;
            resetOnUnstake: boolean;
            cooldownSeconds: number | null;
            minStakeSeconds: number | null;
            endDate: import("bn.js") | null;
            stakePaymentInfo: PublicKey;
            unstakePaymentInfo: PublicKey;
        };
        Action: {
            stake?: Record<string, never> | undefined;
            unstake?: Record<string, never> | undefined;
            claimRewards?: Record<string, never> | undefined;
            claimRewardReceipt?: Record<string, never> | undefined;
            boostStakeEntry?: Record<string, never> | undefined;
        };
    }>;
    executable: boolean;
    owner: PublicKey;
    lamports: number;
    data: Buffer;
    rentEpoch?: number | undefined;
};
/**
 * Try to decode an account with idl types of specific type
 * @param accountInfo
 * @param accountType
 * @param idl
 * @returns
 */
export declare const tryDecodeIdlAccount: <T extends "stakePool" | "stakeEntry" | "userEscrow" | "stakeAuthorizationRecord" | "stakeBooster" | "receiptManager" | "rewardReceipt" | "rewardDistributor" | "rewardEntry" | "paymentInfo">(accountInfo: AccountInfo<Buffer>, accountType: T) => {
    type: string;
    parsed: null;
    executable: boolean;
    owner: PublicKey;
    lamports: number;
    data: Buffer;
    rentEpoch?: number | undefined;
} | {
    type: T;
    parsed: import("@coral-xyz/anchor/dist/cjs/program/namespace/types").TypeDef<AllAccountsMap<CardinalRewardsCenter>[T], {
        InitPaymentInfoIx: {
            authority: PublicKey;
            identifier: string;
            paymentAmount: import("bn.js");
            paymentMint: PublicKey;
            paymentShares: {
                address: PublicKey;
                basisPoints: number;
            }[];
        };
        PaymentShare: {
            address: PublicKey;
            basisPoints: number;
        };
        UpdatePaymentInfoIx: {
            authority: PublicKey;
            paymentAmount: import("bn.js");
            paymentMint: PublicKey;
            paymentShares: {
                address: PublicKey;
                basisPoints: number;
            }[];
        };
        InitRewardDistributorIx: {
            rewardAmount: import("bn.js");
            rewardDurationSeconds: import("bn.js");
            identifier: import("bn.js");
            supply: import("bn.js") | null;
            defaultMultiplier: import("bn.js") | null;
            multiplierDecimals: number | null;
            maxRewardSecondsReceived: import("bn.js") | null;
            claimRewardsPaymentInfo: PublicKey;
        };
        UpdateRewardDistributorIx: {
            defaultMultiplier: import("bn.js");
            multiplierDecimals: number;
            rewardAmount: import("bn.js");
            rewardDurationSeconds: import("bn.js");
            maxRewardSecondsReceived: import("bn.js") | null;
            claimRewardsPaymentInfo: PublicKey;
        };
        UpdateRewardEntryIx: {
            multiplier: import("bn.js");
        };
        InitReceiptManagerIx: {
            name: string;
            authority: PublicKey;
            requiredStakeSeconds: import("bn.js");
            stakeSecondsToUse: import("bn.js");
            paymentMint: PublicKey;
            paymentAmount: import("bn.js");
            paymentShares: {
                address: PublicKey;
                basisPoints: number;
            }[];
            requiresAuthorization: boolean;
            claimActionPaymentInfo: PublicKey;
            maxClaimedReceipts: import("bn.js") | null;
        };
        UpdateReceiptManagerIx: {
            authority: PublicKey;
            requiredStakeSeconds: import("bn.js");
            stakeSecondsToUse: import("bn.js");
            paymentMint: PublicKey;
            paymentAmount: import("bn.js");
            paymentShares: {
                address: PublicKey;
                basisPoints: number;
            }[];
            requiresAuthorization: boolean;
            claimActionPaymentInfo: PublicKey;
            maxClaimedReceipts: import("bn.js") | null;
        };
        BoostStakeEntryIx: {
            secondsToBoost: import("bn.js");
        };
        InitStakeBoosterIx: {
            stakePool: PublicKey;
            identifier: import("bn.js");
            paymentAmount: import("bn.js");
            paymentMint: PublicKey;
            paymentShares: {
                address: PublicKey;
                basisPoints: number;
            }[];
            boostSeconds: import("bn.js");
            startTimeSeconds: import("bn.js");
            boostActionPaymentInfo: PublicKey;
        };
        UpdateStakeBoosterIx: {
            paymentAmount: import("bn.js");
            paymentMint: PublicKey;
            paymentShares: {
                address: PublicKey;
                basisPoints: number;
            }[];
            boostSeconds: import("bn.js");
            startTimeSeconds: import("bn.js");
            boostActionPaymentInfo: PublicKey;
        };
        InitPoolIx: {
            allowedCollections: PublicKey[];
            allowedCreators: PublicKey[];
            requiresAuthorization: boolean;
            authority: PublicKey;
            resetOnUnstake: boolean;
            cooldownSeconds: number | null;
            minStakeSeconds: number | null;
            endDate: import("bn.js") | null;
            stakePaymentInfo: PublicKey;
            unstakePaymentInfo: PublicKey;
            identifier: string;
        };
        UpdatePoolIx: {
            allowedCollections: PublicKey[];
            allowedCreators: PublicKey[];
            requiresAuthorization: boolean;
            authority: PublicKey;
            resetOnUnstake: boolean;
            cooldownSeconds: number | null;
            minStakeSeconds: number | null;
            endDate: import("bn.js") | null;
            stakePaymentInfo: PublicKey;
            unstakePaymentInfo: PublicKey;
        };
        Action: {
            stake?: Record<string, never> | undefined;
            unstake?: Record<string, never> | undefined;
            claimRewards?: Record<string, never> | undefined;
            claimRewardReceipt?: Record<string, never> | undefined;
            boostStakeEntry?: Record<string, never> | undefined;
        };
    }>;
    executable: boolean;
    owner: PublicKey;
    lamports: number;
    data: Buffer;
    rentEpoch?: number | undefined;
};
/**
 * Decode an idl account of unknown type
 * @param accountInfo
 * @param idl
 * @returns
 */
export declare const decodeIdlAccountUnknown: <T extends "stakePool" | "stakeEntry" | "userEscrow" | "stakeAuthorizationRecord" | "stakeBooster" | "receiptManager" | "rewardReceipt" | "rewardDistributor" | "rewardEntry" | "paymentInfo">(accountInfo: AccountInfo<Buffer> | null) => AccountInfo<Buffer> & ParsedIdlAccount<CardinalRewardsCenter>[T];
/**
 * Try to decode an account with idl types of unknown type
 * @param accountInfo
 * @param idl
 * @returns
 */
export declare const tryDecodeIdlAccountUnknown: <T extends "stakePool" | "stakeEntry" | "userEscrow" | "stakeAuthorizationRecord" | "stakeBooster" | "receiptManager" | "rewardReceipt" | "rewardDistributor" | "rewardEntry" | "paymentInfo">(accountInfo: AccountInfo<Buffer>) => NullableIdlAccountInfo<T, CardinalRewardsCenter>;
/**
 * Get program accounts of a specific idl type
 * @param connection
 * @param accountType
 * @param config
 * @param programId
 * @param idl
 * @returns
 */
export declare const getProgramIdlAccounts: <T extends "stakePool" | "stakeEntry" | "userEscrow" | "stakeAuthorizationRecord" | "stakeBooster" | "receiptManager" | "rewardReceipt" | "rewardDistributor" | "rewardEntry" | "paymentInfo">(connection: Connection, accountType: T, config?: GetProgramAccountsConfig) => Promise<({
    type: string;
    parsed: null;
    executable: boolean;
    owner: PublicKey;
    lamports: number;
    data: Buffer;
    rentEpoch?: number | undefined;
    pubkey: PublicKey;
} | {
    type: T;
    parsed: import("@coral-xyz/anchor/dist/cjs/program/namespace/types").TypeDef<AllAccountsMap<CardinalRewardsCenter>[T], {
        InitPaymentInfoIx: {
            authority: PublicKey;
            identifier: string;
            paymentAmount: import("bn.js");
            paymentMint: PublicKey;
            paymentShares: {
                address: PublicKey;
                basisPoints: number;
            }[];
        };
        PaymentShare: {
            address: PublicKey;
            basisPoints: number;
        };
        UpdatePaymentInfoIx: {
            authority: PublicKey;
            paymentAmount: import("bn.js");
            paymentMint: PublicKey;
            paymentShares: {
                address: PublicKey;
                basisPoints: number;
            }[];
        };
        InitRewardDistributorIx: {
            rewardAmount: import("bn.js");
            rewardDurationSeconds: import("bn.js");
            identifier: import("bn.js");
            supply: import("bn.js") | null;
            defaultMultiplier: import("bn.js") | null;
            multiplierDecimals: number | null;
            maxRewardSecondsReceived: import("bn.js") | null;
            claimRewardsPaymentInfo: PublicKey;
        };
        UpdateRewardDistributorIx: {
            defaultMultiplier: import("bn.js");
            multiplierDecimals: number;
            rewardAmount: import("bn.js");
            rewardDurationSeconds: import("bn.js");
            maxRewardSecondsReceived: import("bn.js") | null;
            claimRewardsPaymentInfo: PublicKey;
        };
        UpdateRewardEntryIx: {
            multiplier: import("bn.js");
        };
        InitReceiptManagerIx: {
            name: string;
            authority: PublicKey;
            requiredStakeSeconds: import("bn.js");
            stakeSecondsToUse: import("bn.js");
            paymentMint: PublicKey;
            paymentAmount: import("bn.js");
            paymentShares: {
                address: PublicKey;
                basisPoints: number;
            }[];
            requiresAuthorization: boolean;
            claimActionPaymentInfo: PublicKey;
            maxClaimedReceipts: import("bn.js") | null;
        };
        UpdateReceiptManagerIx: {
            authority: PublicKey;
            requiredStakeSeconds: import("bn.js");
            stakeSecondsToUse: import("bn.js");
            paymentMint: PublicKey;
            paymentAmount: import("bn.js");
            paymentShares: {
                address: PublicKey;
                basisPoints: number;
            }[];
            requiresAuthorization: boolean;
            claimActionPaymentInfo: PublicKey;
            maxClaimedReceipts: import("bn.js") | null;
        };
        BoostStakeEntryIx: {
            secondsToBoost: import("bn.js");
        };
        InitStakeBoosterIx: {
            stakePool: PublicKey;
            identifier: import("bn.js");
            paymentAmount: import("bn.js");
            paymentMint: PublicKey;
            paymentShares: {
                address: PublicKey;
                basisPoints: number;
            }[];
            boostSeconds: import("bn.js");
            startTimeSeconds: import("bn.js");
            boostActionPaymentInfo: PublicKey;
        };
        UpdateStakeBoosterIx: {
            paymentAmount: import("bn.js");
            paymentMint: PublicKey;
            paymentShares: {
                address: PublicKey;
                basisPoints: number;
            }[];
            boostSeconds: import("bn.js");
            startTimeSeconds: import("bn.js");
            boostActionPaymentInfo: PublicKey;
        };
        InitPoolIx: {
            allowedCollections: PublicKey[];
            allowedCreators: PublicKey[];
            requiresAuthorization: boolean;
            authority: PublicKey;
            resetOnUnstake: boolean;
            cooldownSeconds: number | null;
            minStakeSeconds: number | null;
            endDate: import("bn.js") | null;
            stakePaymentInfo: PublicKey;
            unstakePaymentInfo: PublicKey;
            identifier: string;
        };
        UpdatePoolIx: {
            allowedCollections: PublicKey[];
            allowedCreators: PublicKey[];
            requiresAuthorization: boolean;
            authority: PublicKey;
            resetOnUnstake: boolean;
            cooldownSeconds: number | null;
            minStakeSeconds: number | null;
            endDate: import("bn.js") | null;
            stakePaymentInfo: PublicKey;
            unstakePaymentInfo: PublicKey;
        };
        Action: {
            stake?: Record<string, never> | undefined;
            unstake?: Record<string, never> | undefined;
            claimRewards?: Record<string, never> | undefined;
            claimRewardReceipt?: Record<string, never> | undefined;
            boostStakeEntry?: Record<string, never> | undefined;
        };
    }>;
    executable: boolean;
    owner: PublicKey;
    lamports: number;
    data: Buffer;
    rentEpoch?: number | undefined;
    pubkey: PublicKey;
})[]>;
export type IdlAccountDataById<T extends keyof AllAccountsMap<CardinalRewardsCenter>> = {
    [accountId: string]: NullableIdlAccountData<T, CardinalRewardsCenter>;
};
/**
 * Decode account infos with corresponding ids
 * @param accountIds
 * @param accountInfos
 * @returns
 */
export declare const decodeAccountInfos: <T extends "stakePool" | "stakeEntry" | "userEscrow" | "stakeAuthorizationRecord" | "stakeBooster" | "receiptManager" | "rewardReceipt" | "rewardDistributor" | "rewardEntry" | "paymentInfo">(accountIds: PublicKey[], accountInfos: (AccountInfo<Buffer> | null)[]) => IdlAccountDataById<T>;
/**
 * Batch fetch a map of accounts and their corresponding ids
 * @param connection
 * @param ids
 * @returns
 */
export declare const fetchIdlAccountDataById: <T extends "stakePool" | "stakeEntry" | "userEscrow" | "stakeAuthorizationRecord" | "stakeBooster" | "receiptManager" | "rewardReceipt" | "rewardDistributor" | "rewardEntry" | "paymentInfo">(connection: Connection, ids: (PublicKey | null)[]) => Promise<IdlAccountDataById<T>>;
//# sourceMappingURL=accounts.d.ts.map