/// <reference types="node" />
import { CryptoOutput } from '.';
import { DataItem } from './lib';
import { RegistryItem } from './RegistryItem';
export declare class CryptoAccount extends RegistryItem {
    private masterFingerprint;
    private outputDescriptors;
    getRegistryType: () => import("./RegistryType").RegistryType;
    constructor(masterFingerprint: Buffer, outputDescriptors: CryptoOutput[]);
    getMasterFingerprint: () => Buffer;
    getOutputDescriptors: () => CryptoOutput[];
    toDataItem: () => DataItem;
    static fromDataItem: (dataItem: DataItem) => CryptoAccount;
    static fromCBOR: (_cborPayload: Buffer) => CryptoAccount;
}
