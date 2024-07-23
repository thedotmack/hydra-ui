import type { Wallet } from "@coral-xyz/anchor/dist/cjs/provider";
import { Connection, Keypair } from "@solana/web3.js";
export type CardinalProvider = {
    connection: Connection;
    wallet: Wallet;
};
export declare function getTestConnection(): Connection;
export declare function newAccountWithLamports(connection: Connection, lamports?: number, keypair?: Keypair): Promise<Keypair>;
//# sourceMappingURL=workspace.d.ts.map