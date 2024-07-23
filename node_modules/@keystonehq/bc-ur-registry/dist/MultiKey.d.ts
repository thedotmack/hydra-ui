import { CryptoECKey } from './CryptoECKey';
import { CryptoHDKey } from './CryptoHDKey';
import { DataItem } from './lib/DataItem';
import { RegistryItem } from './RegistryItem';
import { RegistryType } from './RegistryType';
export declare class MultiKey extends RegistryItem {
    private threshold;
    private keys;
    getRegistryType: () => RegistryType;
    constructor(threshold: number, keys: (CryptoECKey | CryptoHDKey)[]);
    getThreshold: () => number;
    getKeys: () => (CryptoHDKey | CryptoECKey)[];
    toDataItem: () => DataItem;
    getOutputDescriptorContent: () => string;
    static fromDataItem: (dataItem: DataItem) => MultiKey;
}
