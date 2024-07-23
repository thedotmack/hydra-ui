/// <reference types="node" />
import { DataItem } from './lib';
import { RegistryItem } from './RegistryItem';
export declare class CryptoPSBT extends RegistryItem {
    private psbt;
    getRegistryType: () => import("./RegistryType").RegistryType;
    constructor(psbt: Buffer);
    getPSBT: () => Buffer;
    toDataItem: () => DataItem;
    static fromDataItem: (dataItem: DataItem) => CryptoPSBT;
    static fromCBOR: (_cborPayload: Buffer) => CryptoPSBT;
}
