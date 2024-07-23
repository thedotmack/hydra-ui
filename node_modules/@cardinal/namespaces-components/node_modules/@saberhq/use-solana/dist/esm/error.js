export var ErrorLevel;
(function (ErrorLevel) {
    ErrorLevel["WARN"] = "warn";
    ErrorLevel["ERROR"] = "error";
})(ErrorLevel || (ErrorLevel = {}));
/**
 * Error thrown by the use-solana library.
 */
export class UseSolanaError extends Error {
    constructor(name, message) {
        super(message);
        this.name = name;
    }
}
/**
 * Error derived from another error.
 */
export class UseSolanaDerivedError extends UseSolanaError {
    constructor(name, description, originalError) {
        super(name, `${description}: ${originalError instanceof Error ? originalError.message : "unknown"}`);
        this.description = description;
        this.originalError = originalError;
        if (originalError instanceof Error) {
            this.stack = originalError.stack;
        }
    }
}
/**
 * Thrown when the automatic connection to a wallet errors.
 */
export class WalletAutomaticConnectionError extends UseSolanaDerivedError {
    constructor(originalError, info) {
        super("WalletAutomaticConnectionError", `Error attempting to automatically connect to wallet ${info.name}`, originalError);
        this.info = info;
        this.level = ErrorLevel.WARN;
    }
}
/**
 * Thrown when a wallet disconnection errors.
 */
export class WalletDisconnectError extends UseSolanaDerivedError {
    constructor(originalError, info) {
        var _a;
        super("WalletDisconnectError", `Error disconnecting wallet ${(_a = info === null || info === void 0 ? void 0 : info.name) !== null && _a !== void 0 ? _a : "(unknown)"}`, originalError);
        this.info = info;
        this.level = ErrorLevel.WARN;
    }
}
/**
 * Thrown when a wallet activation errors.
 */
export class WalletActivateError extends UseSolanaDerivedError {
    constructor(originalError, walletType, walletArgs) {
        super("WalletActivateError", `Error activating wallet ${walletType}`, originalError);
        this.walletType = walletType;
        this.walletArgs = walletArgs;
        this.level = ErrorLevel.ERROR;
    }
}
//# sourceMappingURL=error.js.map