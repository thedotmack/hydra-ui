import { BN } from "@project-serum/anchor";
/**
 * Convert decimals to natural amount
 * @param decimalAmount number
 * @param decimals number
 * @returns natural amount
 */
export declare function naturalAmount(decimalAmount: number, decimals: number): BN;
/**
 * Convert natural amount to decimals
 * @param decimalAmount number
 * @param decimals number
 * @returns natural amount
 */
export declare function decimalAmount(naturalAmount: BN, decimals: number): number;
/**
 * Format a string stored input value in the input
 * @param stringAmount State stored string value
 * @param decimals Decimals to shift by
 * @param defaultValue Fallback if the provided string is not a number
 * @returns The formatted inputted to display
 */
export declare function tryFormatInput(stringAmount: string | undefined, decimals: number | undefined, defaultValue: string): string;
/**
 * Parse a string input state value from an input
 * @param stringAmount String input value
 * @param decimals Decimals to shift by
 * @param defaultValue Fallback if the provided string is not a number
 * @returns The the value to store in state for the input
 */
export declare function tryParseInput(stringDecimal: string | undefined, decimals: number | undefined, defaultValue: string): string;
/**
 * Try to convert value to BN
 * @param stringAmount
 * @param defaultValue
 * @returns
 */
export declare const tryBN: (n: number | string | null | undefined) => BN | null;
//# sourceMappingURL=units.d.ts.map