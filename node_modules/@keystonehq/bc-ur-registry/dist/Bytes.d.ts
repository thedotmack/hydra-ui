/// <reference types="node" />
import { DataItem } from './lib';
import { RegistryItem } from './RegistryItem';
export declare class Bytes extends RegistryItem {
    private bytes;
    getRegistryType: () => import("./RegistryType").RegistryType;
    constructor(bytes: Buffer);
    getData: () => Buffer;
    toDataItem: () => DataItem;
    static fromDataItem: (dataItem: DataItem) => Bytes;
    static fromCBOR: (_cborPayload: Buffer) => Bytes;
}
