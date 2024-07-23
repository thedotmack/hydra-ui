/// <reference types="node" />
import { CryptoCoinInfo } from './CryptoCoinInfo';
import { CryptoKeypath } from './CryptoKeypath';
import { DataItem } from './lib';
import { RegistryItem } from './RegistryItem';
import { ICryptoKey } from './types';
declare type MasterKeyProps = {
    isMaster: true;
    key: Buffer;
    chainCode: Buffer;
};
declare type DeriveKeyProps = {
    isMaster: false;
    isPrivateKey?: boolean;
    key: Buffer;
    chainCode?: Buffer;
    useInfo?: CryptoCoinInfo;
    origin?: CryptoKeypath;
    children?: CryptoKeypath;
    parentFingerprint?: Buffer;
    name?: string;
    note?: string;
};
export declare class CryptoHDKey extends RegistryItem implements ICryptoKey {
    private master?;
    private privateKey?;
    private key?;
    private chainCode?;
    private useInfo?;
    private origin?;
    private children?;
    private parentFingerprint?;
    private name?;
    private note?;
    isECKey: () => boolean;
    getKey: () => Buffer;
    getChainCode: () => Buffer;
    isMaster: () => boolean;
    isPrivateKey: () => boolean;
    getUseInfo: () => CryptoCoinInfo;
    getOrigin: () => CryptoKeypath;
    getChildren: () => CryptoKeypath;
    getParentFingerprint: () => Buffer;
    getName: () => string;
    getNote: () => string;
    getBip32Key: () => string;
    getRegistryType: () => import("./RegistryType").RegistryType;
    getOutputDescriptorContent: () => string;
    constructor(args: DeriveKeyProps | MasterKeyProps);
    private setupMasterKey;
    private setupDeriveKey;
    toDataItem: () => DataItem;
    static fromDataItem: (dataItem: DataItem) => CryptoHDKey;
    static fromCBOR: (_cborPayload: Buffer) => CryptoHDKey;
}
export {};
