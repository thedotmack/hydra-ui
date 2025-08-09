// Centralized helpers to safely render on-chain numeric values (BN, bigint, etc.)
// Prevents React "Objects are not valid as a React child" errors when a BN is passed directly.
// (No React import to keep this a pure TS utility; any component wrapper can live elsewhere.)

import BN from 'bn.js'

// Helper function to check if a value is a BN instance
export function isBN(value: any): value is BN {
  return value instanceof BN
}

export interface FormatOptions {
  divisor?: number // e.g. 1e9 for lamports->SOL
  decimals?: number // fixed decimals to display after applying divisor
  fallback?: string
}

export function formatValue(value: any, opts: FormatOptions = {}): string {
  const { divisor, decimals, fallback = '--' } = opts
  if (value === null || value === undefined) return fallback
  try {
    if (isBN(value)) {
      let s = value.toString(10)
      if (divisor) {
        const num = Number(s) / divisor
        return decimals != null ? num.toFixed(decimals) : String(num)
      }
      return s
    }
    if (typeof value === 'bigint') return value.toString()
    if (typeof value === 'number') {
      if (divisor) {
        const num = value / divisor
        return decimals != null ? num.toFixed(decimals) : String(num)
      }
      return String(value)
    }
    if (typeof value === 'string') return value
    if (typeof value === 'object') {
      if (typeof (value as any).toString === 'function' && (value as any).toString !== Object.prototype.toString) {
        return (value as any).toString()
      }
      return JSON.stringify(value)
    }
    return String(value)
  } catch (e) {
    return fallback
  }
}

// Lightweight non-JSX helper for frameworks/components that want a standardized string
export function getFormattedNode(value: any, opts: FormatOptions = {}) {
  return formatValue(value, opts)
}
