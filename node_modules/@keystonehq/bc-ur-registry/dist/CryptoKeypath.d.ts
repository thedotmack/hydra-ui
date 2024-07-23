/// <reference types="node" />
import { DataItem } from './lib';
import { PathComponent } from './PathComponent';
import { RegistryItem } from './RegistryItem';
export declare class CryptoKeypath extends RegistryItem {
    private components;
    private sourceFingerprint?;
    private depth?;
    getRegistryType: () => import("./RegistryType").RegistryType;
    constructor(components?: PathComponent[], sourceFingerprint?: Buffer, depth?: number);
    getPath: () => string;
    getComponents: () => PathComponent[];
    getSourceFingerprint: () => Buffer;
    getDepth: () => number;
    toDataItem: () => DataItem;
    static fromDataItem: (dataItem: DataItem) => CryptoKeypath;
    static fromCBOR: (_cborPayload: Buffer) => CryptoKeypath;
}
