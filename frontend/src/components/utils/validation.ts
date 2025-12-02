/* eslint-disable @typescript-eslint/no-explicit-any */
import { PublicKey } from "@solana/web3.js";

export function isValidSolanaPublicKey(key: string): boolean {
  try {
    const pubKey = new PublicKey(key);
    return PublicKey.isOnCurve(pubKey); // optional curve check
  } catch (err: any) {
    console.error({ err });
    return false;
  }
}
