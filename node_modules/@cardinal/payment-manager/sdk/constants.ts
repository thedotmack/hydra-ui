import type { ParsedIdlAccountData } from "@cardinal/common";
import { emptyWallet } from "@cardinal/common";
import { AnchorProvider, Program } from "@project-serum/anchor";
import type { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import type { ConfirmOptions, Connection } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";

import * as PAYMENT_MANAGER_TYPES from "./idl/cardinal_payment_manager";

export const BASIS_POINTS_DIVISOR = 10000;
export const DEFAULT_BUY_SIDE_FEE_SHARE = 50;

export const PAYMENT_MANAGER_ADDRESS = new PublicKey(
  "pmvYY6Wgvpe3DEj3UX1FcRpMx43sMLYLJrFTVGcqpdn"
);

export const CRANK_KEY = new PublicKey(
  "crkdpVWjHWdggGgBuSyAqSmZUmAjYLzD435tcLDRLXr"
);

export const PAYMENT_MANAGER_SEED = "payment-manager";
export const DEFAULT_PAYMENT_MANAGER_NAME = "cardinal";

export const PAYMENT_MANAGER_IDL = PAYMENT_MANAGER_TYPES.IDL;

export type PAYMENT_MANAGER_PROGRAM =
  PAYMENT_MANAGER_TYPES.CardinalPaymentManager;

export type PaymentManagerData = ParsedIdlAccountData<
  "paymentManager",
  PAYMENT_MANAGER_PROGRAM
>;

export const paymentManagerProgram = (
  connection: Connection,
  wallet?: Wallet,
  confirmOptions?: ConfirmOptions
) => {
  return new Program<PAYMENT_MANAGER_PROGRAM>(
    PAYMENT_MANAGER_IDL,
    PAYMENT_MANAGER_ADDRESS,
    new AnchorProvider(
      connection,
      wallet ?? emptyWallet(PublicKey.default),
      confirmOptions ?? {}
    )
  );
};
