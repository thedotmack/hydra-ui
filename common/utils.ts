import { web3 } from '@coral-xyz/anchor'
import { ComputeBudgetProgram, Connection, Transaction, TransactionInstruction } from '@solana/web3.js'
import { BigNumber } from 'bignumber.js'

export const firstParam = (param: string | string[] | undefined): string => {
  if (!param) return ''
  return typeof param === 'string' ? param : param[0] || ''
}

export function shortPubKey(
  pubkey: web3.PublicKey | string | null | undefined
) {
  if (!pubkey) return ''
  return `${pubkey?.toString().substring(0, 4)}..${pubkey
    ?.toString()
    .substring(pubkey?.toString().length - 4)}`
}

export const tryPublicKey = (
  publicKeyString: web3.PublicKey | string | string[] | undefined | null
): web3.PublicKey | null => {
  if (publicKeyString instanceof web3.PublicKey) return publicKeyString
  if (!publicKeyString) return null
  try {
    return new web3.PublicKey(publicKeyString)
  } catch (e) {
    return null
  }
}

export function pubKeyUrl(
  pubkey: web3.PublicKey | null | undefined,
  cluster: string
) {
  if (!pubkey) return 'https://explorer.solana.com'
  return `https://explorer.solana.com/address/${pubkey.toString()}${
    cluster === 'devnet' ? '?cluster=devnet' : ''
  }`
}

export const hexColor = (colorString: string): string => {
  if (colorString.includes('#')) return colorString
  const [r, g, b] = colorString
    .replace('rgb(', '')
    .replace('rgba(', '')
    .replace(')', '')
    .replace(' ', '')
    .split(',')
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = parseInt(x || '').toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })
      .join('')
  )
}

export const getColorByBgColor = (bgColor: string) => {
  if (!bgColor) {
    return ''
  }
  return parseInt(hexColor(bgColor).replace('#', ''), 16) > 0xffffff / 2
    ? '#000'
    : '#fff'
}

// Converts amount in decimals to mint amount (natural units)
export function getMintNaturalAmountFromDecimal(
  mintAmount: number,
  decimals: number
) {
  return new BigNumber(mintAmount.toString()).shiftedBy(-decimals)
}

function getDistinctPublicKeys(transaction: Transaction): web3.PublicKey[] {
  const uniqueKeysSet = new Set<string>();
  const distinctPublicKeys: web3.PublicKey[] = [];

  for (const instruction of transaction.instructions) {
    if (instruction) {
      // Add pubkeys from the keys array of the instruction
      for (const accountMeta of instruction.keys) {
        const pubkeyStr = accountMeta.pubkey.toBase58();
        if (!uniqueKeysSet.has(pubkeyStr)) {
          uniqueKeysSet.add(pubkeyStr);
          distinctPublicKeys.push(accountMeta.pubkey);
        }
      }

      // Add the programId from the instruction
      const programIdStr = instruction.programId.toBase58();
      if (!uniqueKeysSet.has(programIdStr)) {
        uniqueKeysSet.add(programIdStr);
        distinctPublicKeys.push(instruction.programId);
      }
    }
  }

  return distinctPublicKeys;
}

interface feeEntry {
  prioritizationFee: number;
  slot: number;
}

interface ApiResponse {
  jsonrpc: string;
  result: feeEntry[];
  id: number;
}

function getTop10AverageFees(response: ApiResponse): number {
  const fees = response.result.map(entry => entry.prioritizationFee);

  const sortedFees = fees.sort((a, b) => b - a);

  const top5Fees = sortedFees.slice(0, 5);

  const sumTop5Fees = top5Fees.reduce((sum, fee) => sum + fee, 0);
  const averageTop5Fees = Math.ceil(sumTop5Fees / top5Fees.length);

  return averageTop5Fees;
}

export const getPriorityFeeIx = async (
  connection: Connection,
  transaction: Transaction
): Promise<TransactionInstruction> => {
  const distinctPublicKeys = getDistinctPublicKeys(transaction);
  // directly fetch to avoid web3.js compatability issues
  const response = await fetch(connection.rpcEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getRecentPrioritizationFees',
      params: [distinctPublicKeys],
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json() as ApiResponse;
  const priorityFee = getTop10AverageFees(data)
  console.info("using priority Fee: ", priorityFee)
  
  //@ts-ignore since setComputeUnitPrice is not found but exists
  return ComputeBudgetProgram.setComputeUnitPrice({ 
    microLamports: priorityFee
  })
}
