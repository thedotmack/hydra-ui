import type { ParsedIdlAccountData } from "@cardinal/common";
import { Program } from "@project-serum/anchor";
import type { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import type { ConfirmOptions, Connection } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import * as CLAIM_APPROVER_TYPES from "../../idl/cardinal_paid_claim_approver";
export declare const CLAIM_APPROVER_ADDRESS: PublicKey;
export declare const CLAIM_APPROVER_SEED = "paid-claim-approver";
export declare const CLAIM_APPROVER_IDL: CLAIM_APPROVER_TYPES.CardinalPaidClaimApprover;
export type CLAIM_APPROVER_PROGRAM = CLAIM_APPROVER_TYPES.CardinalPaidClaimApprover;
export type PaidClaimApproverData = ParsedIdlAccountData<"paidClaimApprover", CLAIM_APPROVER_PROGRAM>;
export declare const defaultPaymentManagerId: PublicKey;
export type ClaimApproverParams = {
    paymentMint: PublicKey;
    paymentAmount: number;
    collector?: PublicKey;
    paymentManager?: PublicKey;
};
export declare const claimApproverProgram: (connection: Connection, wallet?: Wallet, confirmOptions?: ConfirmOptions) => Program<CLAIM_APPROVER_TYPES.CardinalPaidClaimApprover>;
//# sourceMappingURL=constants.d.ts.map