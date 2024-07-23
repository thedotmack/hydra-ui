import { PublicKey } from "@solana/web3.js";

import { withCluster } from "./utils";

export function shortPubKey(
  pubkey: PublicKey | string | null | undefined,
  startChars = 4,
  endChars = startChars
) {
  if (!pubkey) return "";
  return `${pubkey?.toString().substring(0, startChars)}..${pubkey
    ?.toString()
    .substring(pubkey?.toString().length - endChars)}`;
}

export function pubKeyUrl(
  pubkey: PublicKey | null | undefined,
  cluster: string
) {
  if (!pubkey) return "https://explorer.solana.com";
  return `https://explorer.solana.com/address/${pubkey.toString()}/metadata${
    cluster === "devnet" ? "?cluster=devnet" : ""
  }`;
}

export const tryPublicKey = (
  publicKeyString: string | string[] | undefined | null
): PublicKey | null => {
  if (!publicKeyString) return null;
  try {
    return new PublicKey(publicKeyString);
  } catch (e) {
    return null;
  }
};

export function transactionUrl(txid: string, cluster: string) {
  return withCluster(`https://explorer.solana.com/tx/${txid}`, cluster);
}
