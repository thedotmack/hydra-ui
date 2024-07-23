import type { WalletProviderInfo, WalletTypeEnum } from ".";
export declare enum ErrorLevel {
    WARN = "warn",
    ERROR = "error"
}
/**
 * Error thrown by the use-solana library.
 */
export declare abstract class UseSolanaError extends Error {
    abstract readonly level: ErrorLevel;
    constructor(name: string, message: string);
}
/**
 * Error derived from another error.
 */
export declare abstract class UseSolanaDerivedError extends UseSolanaError {
    readonly description: string;
    readonly originalError: unknown;
    constructor(name: string, description: string, originalError: unknown);
}
/**
 * Thrown when the automatic connection to a wallet errors.
 */
export declare class WalletAutomaticConnectionError extends UseSolanaDerivedError {
    readonly info: WalletProviderInfo;
    level: ErrorLevel;
    constructor(originalError: unknown, info: WalletProviderInfo);
}
/**
 * Thrown when a wallet disconnection errors.
 */
export declare class WalletDisconnectError extends UseSolanaDerivedError {
    readonly info?: WalletProviderInfo | undefined;
    level: ErrorLevel;
    constructor(originalError: unknown, info?: WalletProviderInfo | undefined);
}
/**
 * Thrown when a wallet activation errors.
 */
export declare class WalletActivateError<WalletType extends WalletTypeEnum<WalletType>> extends UseSolanaDerivedError {
    readonly walletType: WalletType[keyof WalletType];
    readonly walletArgs?: Record<string, unknown> | undefined;
    level: ErrorLevel;
    constructor(originalError: unknown, walletType: WalletType[keyof WalletType], walletArgs?: Record<string, unknown> | undefined);
}
//# sourceMappingURL=error.d.ts.map