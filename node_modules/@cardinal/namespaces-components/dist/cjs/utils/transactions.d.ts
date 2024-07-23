import { web3 } from "@project-serum/anchor";
import type { Wallet } from "@saberhq/solana-contrib";
export declare const signAndSendTransaction: (connection: web3.Connection, wallet: Wallet | null, transaction: web3.Transaction) => Promise<string>;
export declare const withSleep: (fn: () => void, sleep?: number) => Promise<void>;
//# sourceMappingURL=transactions.d.ts.map