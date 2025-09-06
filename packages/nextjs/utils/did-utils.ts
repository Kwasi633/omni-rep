/* eslint-disable prettier/prettier */
/**
 * DID Debug Utilities
 *
 * Helper functions for debugging DID generation and credential issues.
 */

import { keccak256, toBytes, toHex } from "viem";

/**
 * Generate a deterministic DID from an Ethereum address
 * This function can be called directly without hooks for testing
 */
export function generateDeterministicDID(address: string): {did: string, publicKey: string} {
  if (!address) {
    throw new Error("Address is required to generate a DID");
  }
  
  // Generate deterministic key from address using keccak256
  const addressBytes = toBytes(address);
  const keyHash = keccak256(addressBytes);
  
  // Create DID using did:key method with a consistent format
  const did = `did:key:z${toHex(keyHash).slice(2, 34)}`;
  const publicKey = toHex(keyHash);
  
  return { did, publicKey };
}

/**
 * Generate a UUID compatible with RFC4122 v4
 * This is a replacement for crypto.randomUUID() which isn't available in all environments
 */
export function generateUUID(): string {
  let dt = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

/**
 * Check if environment supports crypto.randomUUID
 */
export function hasRandomUUID(): boolean {
  return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function';
}

/**
 * Get safe UUID (tries crypto.randomUUID first, falls back to custom implementation)
 */
export function safeRandomUUID(): string {
  try {
    if (hasRandomUUID()) {
      return crypto.randomUUID();
    }
  } catch {
    console.warn("crypto.randomUUID not available, using fallback");
  }
  return generateUUID();
}
