/* eslint-disable prettier/prettier */
"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { generateDeterministicDID } from "@/utils/did-utils";
import { useENSIntegration } from "@/utils/ens-utils";
import { useWallet } from "@/contexts/WalletContext";

/**
 * OmniRep Identity Hook
 *
 * This hook manages decentralized identity (DID) creation and management
 * for the OmniRep reputation system. Uses DID:Key method with deterministic
 * generation from wallet signature - no storage required.
 *
 * @author OmniRep Team - ETHAccra Hackathon 2025
 */

export interface DIDDocument {
  id: string;
  controller: string;
  created: string;
  updated: string;
  publicKey: string;
  ethereumAddress: string;
}

export interface IdentityState {
  did: string | null;
  didDocument: DIDDocument | null;
  ensName: string | null;
  isCreating: boolean;
  error: string | null;
  isLoaded: boolean;
}

/**
 * Custom hook for managing decentralized identity
 *
 * Features:
 * - Generate DID deterministically based on wallet address
 * - No storage required - same DID derived whenever connected 
 * - Validate DID format and integrity
 * - Clear error handling and logging
 */
export function useIdentity() {
  const { address: wagmiAddress, isConnected } = useAccount();
  const { address: walletAddress } = useWallet();
  
  // Use either the wagmi address or our custom wallet address
  const address = wagmiAddress || walletAddress;
  
  const [state, setState] = useState<IdentityState>({
    did: null,
    didDocument: null,
    ensName: null,
    isCreating: false,
    error: null,
    isLoaded: false,
  });

  // ENS Integration
  const {
    ensName: ensNameFromHook,
    isCreatingSubname,
    createUserSubname,
    resolveDIDFromENS,
    clearENS
  } = useENSIntegration();

  /**
   * Generate deterministic DID on wallet connection (no storage needed)
   */
  const deriveDeterministicDID = useCallback(async () => {
    if (!address) return;

    console.log("🔍 Deriving deterministic DID for address:", address);
    
    // Derive directly from the address (synchronous path)
    try {
      // Use our utility function to generate the DID deterministically
      const { did, publicKey } = generateDeterministicDID(address);
      
      // Create DID document with timestamp to mark when it was generated in this session
      const didDocument: DIDDocument = {
        id: did,
        controller: address,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        publicKey: publicKey,
        ethereumAddress: address,
      };
      
      console.log("✅ Deterministic DID derived:", did);
      
      setState(prev => ({
        ...prev,
        did,
        didDocument,
        ensName: null, // ENS will be set separately if needed
        isLoaded: true,
        error: null,
      }));
    } catch (error) {
      console.error("❌ Error deriving deterministic DID:", error);
      setState(prev => ({
        ...prev,
        error: "Failed to derive DID",
        isLoaded: true,
      }));
    }
  }, [address]);

  /**
   * Generate/retrieve DID using deterministic method with ENS integration
   */
  const createDID = useCallback(async (preferredUsername?: string): Promise<string | null> => {
    if (!address) {
      console.error("❌ Cannot create DID: No wallet address");
      setState(prev => ({ ...prev, error: "Wallet not connected" }));
      return null;
    }

    console.log("🆔 Creating DID with ENS integration for address:", address);

    setState(prev => ({
      ...prev,
      isCreating: true,
      error: null,
    }));

    try {
      // 1. Generate deterministic DID
      const { did, publicKey } = generateDeterministicDID(address);
      
      // 2. Create ENS subname and link to DID
      let ensSubname: string | null = null;
      try {
        ensSubname = await createUserSubname(address, did, preferredUsername);
        console.log("✅ ENS subname created:", ensSubname);
      } catch (ensError) {
        console.warn("⚠️ ENS subname creation failed, continuing with DID only:", ensError);
      }
      
      // 3. Create enhanced DID document with ENS service
      const didDocument: DIDDocument = {
        id: did,
        controller: address,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        publicKey: publicKey,
        ethereumAddress: address,
      };

      console.log("✅ DID created successfully:", did);
      if (ensSubname) {
        console.log("🌐 ENS name:", ensSubname);
      }

      setState(prev => ({
        ...prev,
        did,
        didDocument,
        ensName: ensSubname,
        isCreating: false,
        error: null,
      }));

      return did;
    } catch (error) {
      console.error("❌ Error creating DID:", error);
      setState(prev => ({
        ...prev,
        isCreating: false,
        error: `Failed to create DID: ${error}`,
      }));
      return null;
    }
  }, [address, createUserSubname]);

  /**
   * Check if a DID exists for the current address
   */
  const isDIDCreated = useCallback((): boolean => {
    return !!state.did && !!state.didDocument;
  }, [state.did, state.didDocument]);

  /**
   * Get the current DID
   */
  const getDID = useCallback((): string | null => {
    return state.did;
  }, [state.did]);

  /**
   * Get the full DID document
   */
  const getDIDDocument = useCallback((): DIDDocument | null => {
    return state.didDocument;
  }, [state.didDocument]);

  /**
   * Clear DID data (for testing or reset)
   * With deterministic DIDs, this just clears the current state
   */
  const clearDID = useCallback(() => {
    if (!address) return;

    console.log("🗑️ Clearing DID for address:", address);

    setState(prev => ({
      ...prev,
      did: null,
      didDocument: null,
      ensName: null,
      error: null,
    }));
  }, [address]);

  /**
   * Validate DID format
   */
  const validateDID = useCallback((did: string): boolean => {
    const didRegex = /^did:key:z[1-9A-HJ-NP-Za-km-z]+$/;
    return didRegex.test(did);
  }, []);

  // Derive DID automatically when component mounts or address changes
  useEffect(() => {
    if (isConnected && address) {
      // Auto-derive DID when wallet connects
      deriveDeterministicDID();
    } else {
      // Reset state when wallet disconnects
      setState({
        did: null,
        didDocument: null,
        ensName: null,
        isCreating: false,
        error: null,
        isLoaded: false,
      });
    }
  }, [isConnected, address, deriveDeterministicDID]);

  return {
    // State
    did: state.did,
    didDocument: state.didDocument,
    ensName: state.ensName || ensNameFromHook,
    isCreating: state.isCreating || isCreatingSubname,
    error: state.error,
    isLoaded: state.isLoaded,
    
    // Actions
    createDID,
    getDID,
    getDIDDocument,
    isDIDCreated,
    clearDID: () => {
      clearDID();
      clearENS();
    },
    validateDID,
    
    // ENS Actions
    resolveDIDFromENS,
    
    // Utility
    isConnected,
    address,
  };
}
