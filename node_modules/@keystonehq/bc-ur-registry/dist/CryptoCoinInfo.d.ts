/// <reference types="node" />
import { DataItem } from './lib';
import { RegistryItem } from './RegistryItem';
export declare enum Type {
    bitcoin = 0
}
export declare enum Network {
    mainnet = 0,
    testnet = 1
}
export declare class CryptoCoinInfo extends RegistryItem {
    private type?;
    private network?;
    getRegistryType: () => import("./RegistryType").RegistryType;
    constructor(type?: Type, network?: Network);
    getType: () => Type;
    getNetwork: () => Network;
    toDataItem: () => DataItem;
    static fromDataItem: (dataItem: DataItem) => CryptoCoinInfo;
    static fromCBOR: (_cborPayload: Buffer) => CryptoCoinInfo;
}
