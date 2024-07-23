"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletActivateError = exports.WalletDisconnectError = exports.WalletAutomaticConnectionError = exports.UseSolanaDerivedError = exports.UseSolanaError = exports.ErrorLevel = void 0;
var ErrorLevel;
(function (ErrorLevel) {
    ErrorLevel["WARN"] = "warn";
    ErrorLevel["ERROR"] = "error";
})(ErrorLevel = exports.ErrorLevel || (exports.ErrorLevel = {}));
/**
 * Error thrown by the use-solana library.
 */
class UseSolanaError extends Error {
    constructor(name, message) {
        super(message);
        this.name = name;
    }
}
exports.UseSolanaError = UseSolanaError;
/**
 * Error derived from another error.
 */
class UseSolanaDerivedError extends UseSolanaError {
    constructor(name, description, originalError) {
        super(name, `${description}: ${originalError instanceof Error ? originalError.message : "unknown"}`);
        this.description = description;
        this.originalError = originalError;
        if (originalError instanceof Error) {
            this.stack = originalError.stack;
        }
    }
}
exports.UseSolanaDerivedError = UseSolanaDerivedError;
/**
 * Thrown when the automatic connection to a wallet errors.
 */
class WalletAutomaticConnectionError extends UseSolanaDerivedError {
    constructor(originalError, info) {
        super("WalletAutomaticConnectionError", `Error attempting to automatically connect to wallet ${info.name}`, originalError);
        this.info = info;
        this.level = ErrorLevel.WARN;
    }
}
exports.WalletAutomaticConnectionError = WalletAutomaticConnectionError;
/**
 * Thrown when a wallet disconnection errors.
 */
class WalletDisconnectError extends UseSolanaDerivedError {
    constructor(originalError, info) {
        var _a;
        super("WalletDisconnectError", `Error disconnecting wallet ${(_a = info === null || info === void 0 ? void 0 : info.name) !== null && _a !== void 0 ? _a : "(unknown)"}`, originalError);
        this.info = info;
        this.level = ErrorLevel.WARN;
    }
}
exports.WalletDisconnectError = WalletDisconnectError;
/**
 * Thrown when a wallet activation errors.
 */
class WalletActivateError extends UseSolanaDerivedError {
    constructor(originalError, walletType, walletArgs) {
        super("WalletActivateError", `Error activating wallet ${walletType}`, originalError);
        this.walletType = walletType;
        this.walletArgs = walletArgs;
        this.level = ErrorLevel.ERROR;
    }
}
exports.WalletActivateError = WalletActivateError;
//# sourceMappingURL=error.js.map