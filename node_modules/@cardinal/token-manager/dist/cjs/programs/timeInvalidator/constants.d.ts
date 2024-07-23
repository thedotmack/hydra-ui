import type { ParsedIdlAccountData } from "@cardinal/common";
import { Program } from "@project-serum/anchor";
import type { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import type { ConfirmOptions, Connection } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import * as TIME_INVALIDATOR_TYPES from "../../idl/cardinal_time_invalidator";
export declare const TIME_INVALIDATOR_ADDRESS: PublicKey;
export declare const TIME_INVALIDATOR_SEED = "time-invalidator";
export declare const TIME_INVALIDATOR_IDL: TIME_INVALIDATOR_TYPES.CardinalTimeInvalidator;
export type TIME_INVALIDATOR_PROGRAM = TIME_INVALIDATOR_TYPES.CardinalTimeInvalidator;
export type TimeInvalidatorData = ParsedIdlAccountData<"timeInvalidator", TIME_INVALIDATOR_PROGRAM>;
export type TimeInvalidationParams = {
    collector?: PublicKey;
    paymentManager?: PublicKey;
    durationSeconds?: number;
    maxExpiration?: number;
    extension?: {
        extensionPaymentAmount: number;
        extensionDurationSeconds: number;
        extensionPaymentMint: PublicKey;
        disablePartialExtension?: boolean;
    };
};
export declare const timeInvalidatorProgram: (connection: Connection, wallet?: Wallet, confirmOptions?: ConfirmOptions) => Program<TIME_INVALIDATOR_TYPES.CardinalTimeInvalidator>;
//# sourceMappingURL=constants.d.ts.map