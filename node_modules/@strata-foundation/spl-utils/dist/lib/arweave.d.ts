import { Creator } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { Attribute } from "./splTokenMetadata";
export declare const AR_SOL_HOLDER_ID: PublicKey;
export declare const ARWEAVE_UPLOAD_URL: string;
declare type ArweaveFile = {
    filename: string;
    status: "success" | "fail";
    transactionId?: string;
    error?: string;
};
interface IArweaveResult {
    error?: string;
    messages?: Array<ArweaveFile>;
}
export declare type ArweaveEnv = "mainnet-beta" | "testnet" | "devnet";
export declare function uploadToArweave(txid: string, mintKey: PublicKey, files: File[], uploadUrl?: string, env?: ArweaveEnv): Promise<IArweaveResult>;
export declare const prePayForFilesInstructions: (payer: PublicKey, files: File[]) => Promise<TransactionInstruction[]>;
export declare function getFilesWithMetadata(files: File[], metadata: {
    name: string;
    symbol: string;
    description: string;
    image: string | undefined;
    animationUrl: string | undefined;
    externalUrl: string;
    properties: any;
    attributes: Attribute[] | undefined;
    creators: Creator[] | null;
    sellerFeeBasisPoints: number;
}): File[];
export {};
//# sourceMappingURL=arweave.d.ts.map