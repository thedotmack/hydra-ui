import { Wallet } from "@project-serum/anchor";
import { Connection, Keypair } from "@solana/web3.js";
export declare type CardinalProvider = {
    connection: Connection;
    wallet: Wallet;
};
export declare function getTestConnection(): Connection;
export declare function newAccountWithLamports(connection: Connection, lamports?: number, keypair?: Keypair): Promise<Keypair>;
export declare function getTestProvider(): Promise<CardinalProvider>;
//# sourceMappingURL=workspace.d.ts.map