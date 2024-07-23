/// <reference types="node" />
import { CryptoHDKey } from "../CryptoHDKey";
import { RegistryItem } from "../RegistryItem";
import { DataItem } from '../lib';
export declare class CryptoMultiAccounts extends RegistryItem {
    private masterFingerprint;
    private keys;
    private device?;
    getRegistryType: () => import("../RegistryType").RegistryType;
    constructor(masterFingerprint: Buffer, keys: CryptoHDKey[], device?: string);
    getMasterFingerprint: () => Buffer;
    getKeys: () => CryptoHDKey[];
    getDevice: () => string;
    toDataItem: () => DataItem;
    static fromDataItem: (dataItem: DataItem) => CryptoMultiAccounts;
    static fromCBOR: (_cborPayload: Buffer) => CryptoMultiAccounts;
}
