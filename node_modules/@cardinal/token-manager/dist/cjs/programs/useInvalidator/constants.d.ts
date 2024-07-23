import type { ParsedIdlAccountData } from "@cardinal/common";
import { Program } from "@project-serum/anchor";
import type { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import type { ConfirmOptions, Connection } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import * as USE_INVALIDATOR_TYPES from "../../idl/cardinal_use_invalidator";
export declare const USE_INVALIDATOR_ADDRESS: PublicKey;
export declare const USE_INVALIDATOR_SEED = "use-invalidator";
export declare const USE_INVALIDATOR_IDL: USE_INVALIDATOR_TYPES.CardinalUseInvalidator;
export type USE_INVALIDATOR_PROGRAM = USE_INVALIDATOR_TYPES.CardinalUseInvalidator;
export type UseInvalidatorData = ParsedIdlAccountData<"useInvalidator", USE_INVALIDATOR_PROGRAM>;
export type UseInvalidationParams = {
    collector?: PublicKey;
    paymentManager?: PublicKey;
    totalUsages?: number;
    useAuthority?: PublicKey;
    extension?: {
        extensionUsages: number;
        extensionPaymentMint: PublicKey;
        extensionPaymentAmount: number;
        maxUsages?: number;
    };
};
export declare const useInvalidatorProgram: (connection: Connection, wallet?: Wallet, confirmOptions?: ConfirmOptions) => Program<USE_INVALIDATOR_TYPES.CardinalUseInvalidator>;
//# sourceMappingURL=constants.d.ts.map