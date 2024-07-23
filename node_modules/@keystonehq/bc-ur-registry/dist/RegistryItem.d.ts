import { UR, UREncoder } from '@ngraveio/bc-ur';
import { DataItem } from './lib';
import { RegistryType } from './RegistryType';
export declare abstract class RegistryItem {
    abstract getRegistryType: () => RegistryType;
    abstract toDataItem: () => DataItem;
    toCBOR: () => any;
    toUR: () => UR;
    toUREncoder: (maxFragmentLength?: number, firstSeqNum?: number, minFragmentLength?: number) => UREncoder;
}
