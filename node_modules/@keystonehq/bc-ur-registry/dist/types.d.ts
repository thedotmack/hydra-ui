export interface ICryptoKey {
    isECKey: () => boolean;
    getOutputDescriptorContent: () => string;
}
export declare type DataItemMap = Record<string, any>;
