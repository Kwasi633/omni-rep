/* eslint-disable prettier/prettier */
/**
 * OmniRep Hash Score Utility
 * 
 * This utility provides functions to hash reputation data for verifiable credentials.
 * Uses SHA256 for consistent, deterministic hashing of reputation scores.
 * 
 * @author OmniRep Team - ETHAccra Hackathon 2025
 */

import { keccak256, toBytes } from "viem";

export interface ReputationData {
  score: number;
  timestamp: number;
  categories: {
    financial: number;
    social: number;
    professional: number;
    educational: number;
  };
  metadata?: Record<string, any>;
}

/**
 * Hashes reputation data using Keccak256 (Ethereum standard)
 * 
 * @param data - The reputation data to hash
 * @returns Hexadecimal hash string
 */
export function hashReputationScore(data: ReputationData): string {
  console.log("🔐 Hashing reputation data:", data);
  
  try {
    // Create a deterministic string representation of the data
    const dataString = JSON.stringify({
      score: data.score,
      timestamp: data.timestamp,
      categories: data.categories,
      metadata: data.metadata || {}
    }, Object.keys(data).sort()); // Sort keys for deterministic output
    
    // Convert to bytes and hash with Keccak256
    const hash = keccak256(toBytes(dataString));
    
    console.log("✅ Reputation data hashed successfully:", hash);
    return hash;
  } catch (error) {
    console.error("❌ Error hashing reputation data:", error);
    throw new Error(`Failed to hash reputation data: ${error}`);
  }
}

/**
 * Creates a simple hash from a numerical score (for quick demos)
 * 
 * @param score - Numerical reputation score
 * @returns Hexadecimal hash string
 */
export function hashSimpleScore(score: number): string {
  console.log("🔐 Hashing simple score:", score);
  
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const dataString = `${score}_${timestamp}`;
    const hash = keccak256(toBytes(dataString));
    
    console.log("✅ Simple score hashed successfully:", hash);
    return hash;
  } catch (error) {
    console.error("❌ Error hashing simple score:", error);
    throw new Error(`Failed to hash simple score: ${error}`);
  }
}

/**
 * Validates that a hash matches the provided reputation data
 * 
 * @param hash - The hash to validate
 * @param data - The original reputation data
 * @returns Boolean indicating if hash is valid
 */
export function validateReputationHash(hash: string, data: ReputationData): boolean {
  try {
    const calculatedHash = hashReputationScore(data);
    const isValid = hash === calculatedHash;
    
    console.log("🔍 Hash validation result:", isValid);
    return isValid;
  } catch (error) {
    console.error("❌ Error validating hash:", error);
    return false;
  }
}

/**
 * Mock reputation data generator for demo purposes
 * 
 * @param baseScore - Base reputation score (0-1000)
 * @returns Mock reputation data
 */
export function generateMockReputationData(baseScore: number = 750): ReputationData {
  const timestamp = Math.floor(Date.now() / 1000);
  
  return {
    score: baseScore,
    timestamp,
    categories: {
      financial: Math.floor(baseScore * 0.3),
      social: Math.floor(baseScore * 0.25),
      professional: Math.floor(baseScore * 0.25),
      educational: Math.floor(baseScore * 0.2),
    },
    metadata: {
      version: "1.0.0",
      source: "omni-rep-demo",
      generatedAt: new Date().toISOString()
    }
  };
}
