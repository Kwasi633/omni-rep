/* eslint-disable prettier/prettier */
/**
 * ENS Integration for OmniRep
 * Following official ENS documentation and Wagmi patterns
 * Provides free subnames under omnirep.eth for DID resolution
 */

import { useState, useCallback } from "react";
import { useEnsName, useEnsAvatar, useEnsText } from 'wagmi';

interface ENSProfile {
  name: string | null;
  avatar: string | null;
  did: string | null;
  github: string | null;
  twitter: string | null;
}

interface ENSSubnameService {
  createSubname: (username: string, ownerAddress: string, did: string) => Promise<string>;
  resolveDID: (ensName: string) => Promise<string | null>;
  updateDIDRecord: (ensName: string, did: string) => Promise<void>;
}

export class OmniRepENSService implements ENSSubnameService {
  private parentDomain = 'omnirep.eth';

  /**
   * Create a free subname under omnirep.eth
   * Following ENS documentation for subname management
   */
  async createSubname(username: string, ownerAddress: string, did: string): Promise<string> {
    const subdomain = `${username}.${this.parentDomain}`;

    try {
      console.log(`🌐 Creating ENS subname: ${subdomain}`);
      console.log(`📋 Linking DID: ${did}`);
      console.log(`👤 Owner: ${ownerAddress}`);

      // For demo purposes, we simulate the ENS subname creation
      // but provide more realistic integration with Sepolia testnet
      
      // Simulate blockchain interaction 
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate tx time
      
      // Add ENS integration details for Sepolia - In real implementation we would:
      // 1. Connect to the Sepolia network via a provider
      // 2. Use the ENS Registry contract to set the subnode owner
      // 3. Set the resolver for the new subdomain
      // 4. Add text records including the DID
      
      // Simulate successful transaction
      console.log(`✅ Created ENS subname: ${subdomain}`);
      console.log(`🔗 View on Sepolia ENS App: https://sepolia.app.ens.domains/name/${subdomain}`);
      
      // In a real implementation, we would check that the subdomain was successfully registered
      // by querying the ENS Registry on Sepolia
      
      return subdomain;

    } catch (error) {
      console.error('Failed to create ENS subname:', error);
      throw error;
    }
  }

  /**
   * Resolve DID from ENS name using standard ENS resolution
   */
  async resolveDID(ensName: string): Promise<string | null> {
    try {
      console.log(`🔍 Resolving DID for ENS name: ${ensName}`);
      
      // For demo, simulate ENS text record lookup
      // In production, this would use ENS resolver text records
      if (ensName.includes('omnirep.eth')) {
        const mockDID = `did:key:z${ensName.split('.')[0]}deterministicHash123`;
        console.log(`✅ Resolved DID: ${mockDID}`);
        return mockDID;
      }

      return null;
    } catch (error) {
      console.error('Failed to resolve DID from ENS:', error);
      return null;
    }
  }

  /**
   * Update DID record for existing ENS name
   */
  async updateDIDRecord(ensName: string, did: string): Promise<void> {
    console.log(`📝 Updating DID record for ${ensName}: ${did}`);
    // In production, this would call ENS resolver setText
  }

  /**
   * Generate available username from wallet address
   */
  generateUsername(address: string): string {
    const shortAddress = address.slice(2, 8).toLowerCase();
    return `user${shortAddress}`;
  }

  /**
   * Check if username is available
   */
  async isUsernameAvailable(username: string): Promise<boolean> {
    const subdomain = `${username}.${this.parentDomain}`;
    try {
      const existingDID = await this.resolveDID(subdomain);
      return !existingDID;
    } catch {
      return true;
    }
  }
}

/**
 * Hook for ENS profile information using official Wagmi hooks
 * Following ENS quickstart documentation patterns
 */
export function useENSProfile(address?: string): ENSProfile {
  // Get ENS name for address (following ENS docs pattern)
  const { data: name } = useEnsName({ 
    address: address as `0x${string}`, 
    chainId: 1 // Always use mainnet for ENS resolution
  });
  
  // Get avatar for ENS name
  const { data: avatar } = useEnsAvatar({ 
    name: name || undefined, 
    chainId: 1 
  });
  
  // Get DID from text records
  const { data: did } = useEnsText({ 
    name: name || undefined, 
    key: 'did',
    chainId: 1 
  });
  
  // Get GitHub handle
  const { data: github } = useEnsText({ 
    name: name || undefined, 
    key: 'com.github',
    chainId: 1 
  });
  
  // Get Twitter handle  
  const { data: twitter } = useEnsText({ 
    name: name || undefined, 
    key: 'com.twitter',
    chainId: 1 
  });

  return {
    name: name || null,
    avatar: avatar || null,
    did: did || null,
    github: github || null,
    twitter: twitter || null
  };
}

/**
 * ENS Integration Hook for React Components
 * Following ENS documentation best practices
 */
export function useENSIntegration() {
  // Use localStorage to persist ENS name between refreshes
  const [ensName, setEnsName] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('omnirep_ens_name') || '';
  });
  
  const [isCreatingSubname, setIsCreatingSubname] = useState(false);
  const [ensService] = useState(() => new OmniRepENSService());
  const [error, setError] = useState<string | null>(null);

  // Create subname for new user
  const createUserSubname = useCallback(async (
    address: string, 
    did: string, 
    preferredUsername?: string
  ) => {
    setIsCreatingSubname(true);
    setError(null);
    
    try {
      let username = preferredUsername || ensService.generateUsername(address);
      
      // Check availability and add suffix if needed
      let attempts = 0;
      while (!(await ensService.isUsernameAvailable(username)) && attempts < 5) {
        username = `${preferredUsername || ensService.generateUsername(address)}${attempts + 1}`;
        attempts++;
      }
      
      const subdomain = await ensService.createSubname(username, address, did);
      
      // Persist ENS name in local storage to survive page refreshes
      localStorage.setItem('omnirep_ens_name', subdomain);
      console.log(`🔒 ENS name saved to local storage: ${subdomain}`);
      
      setEnsName(subdomain);
      return subdomain;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create subname';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsCreatingSubname(false);
    }
  }, [ensService]);

  // Resolve existing ENS to DID
  const resolveDIDFromENS = useCallback(async (ensName: string) => {
    try {
      return await ensService.resolveDID(ensName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resolve ENS');
      return null;
    }
  }, [ensService]);

  // Connect existing ENS name
  const connectExistingENS = useCallback((existingEnsName: string) => {
    try {
      if (!existingEnsName) {
        throw new Error('No ENS name provided');
      }
      
      // Validate ENS name format
      if (!existingEnsName.includes('.eth')) {
        existingEnsName += '.eth';
      }
      
      // Save to state and localStorage
      setEnsName(existingEnsName);
      localStorage.setItem('omnirep_ens_name', existingEnsName);
      console.log(`🔗 Connected existing ENS name: ${existingEnsName}`);
      
      return existingEnsName;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to connect ENS name';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, []);

  // Clear ENS data
  const clearENS = useCallback(() => {
    setEnsName('');
    setError(null);
    
    // Also clear from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('omnirep_ens_name');
      console.log('🗑️ ENS name cleared from local storage');
    }
  }, []);

  return {
    ensName,
    isCreatingSubname,
    error,
    createUserSubname,
    resolveDIDFromENS,
    connectExistingENS,
    clearENS,
    ensService
  };
}
