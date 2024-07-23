export declare class RegistryType {
    private type;
    private tag?;
    constructor(type: string, tag?: number);
    getTag: () => number;
    getType: () => string;
}
export declare const RegistryTypes: {
    UUID: RegistryType;
    BYTES: RegistryType;
    CRYPTO_HDKEY: RegistryType;
    CRYPTO_KEYPATH: RegistryType;
    CRYPTO_COIN_INFO: RegistryType;
    CRYPTO_ECKEY: RegistryType;
    CRYPTO_OUTPUT: RegistryType;
    CRYPTO_PSBT: RegistryType;
    CRYPTO_ACCOUNT: RegistryType;
    CRYPTO_MULTI_ACCOUNTS: RegistryType;
};
