/// <reference types="node" />
import { DataItem } from './lib';
import { RegistryItem } from './RegistryItem';
import { ICryptoKey } from './types';
export declare class CryptoECKey extends RegistryItem implements ICryptoKey {
    private data;
    private curve;
    private privateKey;
    constructor(args: {
        data: Buffer;
        curve?: number;
        privateKey?: boolean;
    });
    isECKey: () => boolean;
    getCurve: () => number;
    isPrivateKey: () => boolean;
    getData: () => Buffer;
    getRegistryType: () => import("./RegistryType").RegistryType;
    toDataItem: () => DataItem;
    getOutputDescriptorContent: () => string;
    static fromDataItem: (dataItem: DataItem) => CryptoECKey;
    static fromCBOR: (_cborPayload: Buffer) => CryptoECKey;
}
