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

// Flexible human amount formatter with significant trimming and threshold
export function formatAmount(
  value: number | string | null | undefined,
  opts: { maxSig?: number; minSig?: number; minThreshold?: number; showLessThan?: boolean } = {}
): string {
  const { maxSig = 4, minSig = 2, minThreshold = 0.0001, showLessThan = true } = opts
  if (value === null || value === undefined || value === '') return '--'
  const num = typeof value === 'string' ? Number(value) : value
  if (isNaN(num)) return '--'
  if (num === 0) return '0'
  if (num > 0 && num < minThreshold && showLessThan) return `<${minThreshold}`
  // Determine precision: at least minSig, up to maxSig, trim trailing zeros.
  let str = num.toFixed(maxSig)
  // Trim trailing zeros but keep at least minSig decimals if <1
  if (str.includes('.')) {
    str = str.replace(/\.0+$/, '') // whole number
    if (str.includes('.')) {
      // Remove excess zeros
      str = str.replace(/(\.[0-9]*?)0+$/, '$1')
      // Ensure minimum decimals if <1 and decimals below minSig
      const [i, d = ''] = str.split('.')
      if (Number(i) === 0 && d.length < minSig) {
        str = `${i}.${d.padEnd(minSig, '0')}`
      }
    }
  }
  return str
}

// Percent formatter with configurable precision (defaults align with high-level UI needs)
export function formatPercent(value: number | null | undefined, opts: { digits?: number } = {}) {
  if (value === null || value === undefined || isNaN(value)) return '--'
  const { digits = value < 1 ? 2 : 1 } = opts
  return `${value.toFixed(digits)}%`
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
