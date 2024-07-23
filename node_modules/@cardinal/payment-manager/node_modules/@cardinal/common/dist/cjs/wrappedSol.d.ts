import type { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import * as web3 from "@solana/web3.js";
export declare function withWrapSol(transaction: web3.Transaction, connection: web3.Connection, wallet: Wallet, lamports: number, skipInitTokenAccount?: boolean): Promise<web3.Transaction>;
export declare function createSyncNativeInstruction(nativeAccount: web3.PublicKey): web3.TransactionInstruction;
//# sourceMappingURL=wrappedSol.d.ts.map