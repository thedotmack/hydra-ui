/// <reference types="node" />
import { Provider } from "@project-serum/anchor";
import { AccountInfo, MintInfo } from "@solana/spl-token";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
export declare function createMint(provider: Provider, authority?: PublicKey, decimals?: number): Promise<PublicKey>;
export declare function createMintInstructions(provider: Provider, authority: PublicKey, mint: PublicKey, decimals?: number, freezeAuthority?: PublicKey): Promise<TransactionInstruction[]>;
export declare function getMintInfo(provider: Provider, addr: PublicKey): Promise<MintInfo>;
export declare function parseMintAccount(data: Buffer): MintInfo;
export declare function getTokenAccount(provider: Provider, addr: PublicKey): Promise<AccountInfo>;
export declare function parseTokenAccount(data: Buffer): AccountInfo;
export declare function sleep(ms: number): Promise<any>;
//# sourceMappingURL=splToken.d.ts.map