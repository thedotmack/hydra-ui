"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryBN = exports.tryParseInput = exports.tryFormatInput = exports.decimalAmount = exports.naturalAmount = void 0;
const anchor_1 = require("@project-serum/anchor");
const bignumber_js_1 = require("bignumber.js");
/**
 * Convert decimals to natural amount
 * @param decimalAmount number
 * @param decimals number
 * @returns natural amount
 */
function naturalAmount(decimalAmount, decimals) {
    return new anchor_1.BN(new bignumber_js_1.BigNumber(decimalAmount).shiftedBy(decimals).toString());
}
exports.naturalAmount = naturalAmount;
/**
 * Convert natural amount to decimals
 * @param decimalAmount number
 * @param decimals number
 * @returns natural amount
 */
function decimalAmount(naturalAmount, decimals) {
    return new bignumber_js_1.BigNumber(naturalAmount.toString())
        .shiftedBy(-decimals)
        .toNumber();
}
exports.decimalAmount = decimalAmount;
/**
 * Format a string stored input value in the input
 * @param stringAmount State stored string value
 * @param decimals Decimals to shift by
 * @param defaultValue Fallback if the provided string is not a number
 * @returns The formatted inputted to display
 */
function tryFormatInput(stringAmount, decimals, defaultValue) {
    if (!stringAmount)
        return defaultValue;
    const trailingZeros = stringAmount.match(/\.(0+)?$/);
    try {
        if (new bignumber_js_1.BigNumber(stringAmount.replace(",", "")).isFinite()) {
            return new bignumber_js_1.BigNumber(stringAmount.replace(",", ""))
                .shiftedBy(-(decimals || 0))
                .toFormat({
                groupSeparator: "",
                decimalSeparator: ".",
            })
                .concat(trailingZeros && trailingZeros[0] ? trailingZeros[0] : "");
        }
        return defaultValue;
    }
    catch (e) {
        return defaultValue;
    }
}
exports.tryFormatInput = tryFormatInput;
/**
 * Parse a string input state value from an input
 * @param stringAmount String input value
 * @param decimals Decimals to shift by
 * @param defaultValue Fallback if the provided string is not a number
 * @returns The the value to store in state for the input
 */
function tryParseInput(stringDecimal, decimals, defaultValue) {
    if (!stringDecimal)
        return "0";
    const trailingZeros = stringDecimal.match(/\.(0+)?$/);
    try {
        if (new bignumber_js_1.BigNumber(stringDecimal.replace(",", "")).isFinite()) {
            return new bignumber_js_1.BigNumber(stringDecimal.replace(",", ""))
                .shiftedBy(decimals || 0)
                .toFixed(0, bignumber_js_1.BigNumber.ROUND_FLOOR)
                .concat(trailingZeros && trailingZeros[0] ? trailingZeros[0] : "");
        }
        return defaultValue;
    }
    catch (e) {
        return defaultValue;
    }
}
exports.tryParseInput = tryParseInput;
/**
 * Try to convert value to BN
 * @param stringAmount
 * @param defaultValue
 * @returns
 */
const tryBN = (n) => {
    if (n === null || n === undefined)
        return null;
    try {
        return new anchor_1.BN(n);
    }
    catch (_a) {
        return null;
    }
};
exports.tryBN = tryBN;
//# sourceMappingURL=units.js.map