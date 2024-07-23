import { utils } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

import { PAYMENT_MANAGER_ADDRESS, PAYMENT_MANAGER_SEED } from ".";

/**
 * Finds the address of the payment manager.
 * @returns
 */
export const findPaymentManagerAddress = (name: string): PublicKey => {
  return PublicKey.findProgramAddressSync(
    [
      utils.bytes.utf8.encode(PAYMENT_MANAGER_SEED),
      utils.bytes.utf8.encode(name),
    ],
    PAYMENT_MANAGER_ADDRESS
  )[0];
};
