import { Creator, DataV2, EditionData, MasterEditionData, MetadataData } from "@metaplex-foundation/mpl-token-metadata";
import { Provider } from "@project-serum/anchor";
import { MintInfo } from "@solana/spl-token";
import { PublicKey, Signer, TransactionInstruction } from "@solana/web3.js";
import { InstructionResult } from ".";
import { ArweaveEnv } from "./arweave";
export declare enum StorageProvider {
    Arweave = "arweave"
}
export interface IUploadMetadataArgs {
    payer?: PublicKey;
    name: string;
    symbol: string;
    description?: string;
    image?: File;
    creators?: Creator[];
    attributes?: Attribute[];
    animationUrl?: string;
    externalUrl?: string;
    extraMetadata?: any;
    provider?: StorageProvider;
    mint?: PublicKey;
}
export interface ICreateArweaveUrlArgs {
    payer?: PublicKey;
    name: string;
    symbol: string;
    description?: string;
    image?: string;
    creators?: Creator[];
    files?: File[];
    existingFiles?: FileOrString[];
    attributes?: Attribute[];
    animationUrl?: string;
    externalUrl?: string;
    extraMetadata?: any;
}
export declare type Attribute = {
    trait_type?: string;
    display_type?: string;
    value: string | number;
};
export declare type MetadataFile = {
    uri: string;
    type: string;
};
export declare type FileOrString = MetadataFile | string;
export interface IMetadataExtension {
    name: string;
    symbol: string;
    creators: Creator[] | null;
    description: string;
    image: string;
    animation_url?: string;
    attributes?: Attribute[];
    external_url: string;
    seller_fee_basis_points: number;
    properties: {
        files?: FileOrString[];
        category: MetadataCategory;
        maxSupply?: number;
        creators?: {
            address: string;
            shares: number;
        }[];
    };
}
export interface ICreateMetadataInstructionsArgs {
    data: DataV2;
    authority?: PublicKey;
    mintAuthority?: PublicKey;
    mint: PublicKey;
    payer?: PublicKey;
}
export interface IUpdateMetadataInstructionsArgs {
    data?: DataV2 | null;
    newAuthority?: PublicKey | null;
    metadata: PublicKey;
    payer?: PublicKey;
    /** The update authority to use when updating the metadata. **Default:** Pulled from the metadata object. This can be useful if you're chaining transactions */
    updateAuthority?: PublicKey;
}
export declare enum MetadataCategory {
    Audio = "audio",
    Video = "video",
    Image = "image",
    VR = "vr"
}
export interface ITokenWithMeta {
    displayName?: string;
    metadataKey?: PublicKey;
    metadata?: MetadataData;
    mint?: MintInfo;
    edition?: EditionData;
    masterEdition?: MasterEditionData;
    data?: IMetadataExtension;
    image?: string;
    description?: string;
}
export declare function getImageFromMeta(meta?: any): string | undefined;
export declare class SplTokenMetadata {
    provider: Provider;
    static init(provider: Provider): Promise<SplTokenMetadata>;
    constructor(opts: {
        provider: Provider;
    });
    static attributesToRecord(attributes: Attribute[] | undefined): Record<string, string | number> | undefined;
    static getArweaveMetadata(uri: string | undefined): Promise<IMetadataExtension | undefined>;
    static getImage(uri: string | undefined): Promise<string | undefined>;
    getEditionInfo(metadata: MetadataData | undefined): Promise<{
        edition?: EditionData;
        masterEdition?: MasterEditionData;
    }>;
    getTokenMetadata(metadataKey: PublicKey): Promise<ITokenWithMeta>;
    sendInstructions(instructions: TransactionInstruction[], signers: Signer[], payer?: PublicKey): Promise<string>;
    uploadMetadata(args: IUploadMetadataArgs): Promise<string>;
    /**
     * Wrapper function that prepays for arweave metadata files in SOL, then uploads them to arweave and returns the url
     *
     * @param args
     * @returns
     */
    createArweaveMetadata(args: ICreateArweaveUrlArgs & {
        env?: ArweaveEnv;
        uploadUrl?: string;
        mint: PublicKey;
    }): Promise<string>;
    presignCreateArweaveUrlInstructions({ name, symbol, description, image, creators, files, payer, existingFiles, attributes, externalUrl, animationUrl, extraMetadata, }: ICreateArweaveUrlArgs): Promise<InstructionResult<{
        files: File[];
    }>>;
    presignCreateArweaveUrl(args: ICreateArweaveUrlArgs): Promise<{
        files: File[];
        txid: string;
    }>;
    getArweaveUrl({ txid, mint, files, uploadUrl, env, }: {
        env: ArweaveEnv;
        uploadUrl?: string;
        txid: string;
        mint: PublicKey;
        files?: File[];
    }): Promise<string>;
    createMetadataInstructions({ data, authority, mint, mintAuthority, payer, }: ICreateMetadataInstructionsArgs): Promise<InstructionResult<{
        metadata: PublicKey;
    }>>;
    getMetadata(metadataKey: PublicKey): Promise<MetadataData | null>;
    createMetadata(args: ICreateMetadataInstructionsArgs): Promise<{
        metadata: PublicKey;
    }>;
    updateMetadataInstructions({ data, newAuthority, metadata, updateAuthority, }: IUpdateMetadataInstructionsArgs): Promise<InstructionResult<{
        metadata: PublicKey;
    }>>;
    updateMetadata(args: IUpdateMetadataInstructionsArgs): Promise<{
        metadata: PublicKey;
    }>;
}
//# sourceMappingURL=splTokenMetadata.d.ts.map