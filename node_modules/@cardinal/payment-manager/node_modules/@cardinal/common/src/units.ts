import { BN } from "@project-serum/anchor";
import { BigNumber } from "bignumber.js";

/**
 * Convert decimals to natural amount
 * @param decimalAmount number
 * @param decimals number
 * @returns natural amount
 */
export function naturalAmount(decimalAmount: number, decimals: number): BN {
  return new BN(new BigNumber(decimalAmount).shiftedBy(decimals).toString());
}

/**
 * Convert natural amount to decimals
 * @param decimalAmount number
 * @param decimals number
 * @returns natural amount
 */
export function decimalAmount(naturalAmount: BN, decimals: number): number {
  return new BigNumber(naturalAmount.toString())
    .shiftedBy(-decimals)
    .toNumber();
}

/**
 * Format a string stored input value in the input
 * @param stringAmount State stored string value
 * @param decimals Decimals to shift by
 * @param defaultValue Fallback if the provided string is not a number
 * @returns The formatted inputted to display
 */
export function tryFormatInput(
  stringAmount: string | undefined,
  decimals: number | undefined,
  defaultValue: string
): string {
  if (!stringAmount) return defaultValue;
  const trailingZeros = stringAmount.match(/\.(0+)?$/);
  try {
    if (new BigNumber(stringAmount.replace(",", "")).isFinite()) {
      return new BigNumber(stringAmount.replace(",", ""))
        .shiftedBy(-(decimals || 0))
        .toFormat({
          groupSeparator: "",
          decimalSeparator: ".",
        })
        .concat(trailingZeros && trailingZeros[0] ? trailingZeros[0] : "");
    }
    return defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

/**
 * Parse a string input state value from an input
 * @param stringAmount String input value
 * @param decimals Decimals to shift by
 * @param defaultValue Fallback if the provided string is not a number
 * @returns The the value to store in state for the input
 */
export function tryParseInput(
  stringDecimal: string | undefined,
  decimals: number | undefined,
  defaultValue: string
): string {
  if (!stringDecimal) return "0";
  const trailingZeros = stringDecimal.match(/\.(0+)?$/);
  try {
    if (new BigNumber(stringDecimal.replace(",", "")).isFinite()) {
      return new BigNumber(stringDecimal.replace(",", ""))
        .shiftedBy(decimals || 0)
        .toFixed(0, BigNumber.ROUND_FLOOR)
        .concat(trailingZeros && trailingZeros[0] ? trailingZeros[0] : "");
    }
    return defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

/**
 * Try to convert value to BN
 * @param stringAmount
 * @param defaultValue
 * @returns
 */
export const tryBN = (n: number | string | null | undefined): BN | null => {
  if (n === null || n === undefined) return null;
  try {
    return new BN(n);
  } catch {
    return null;
  }
};
