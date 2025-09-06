/* eslint-disable prettier/prettier */
"use client";

import { useCallback, useState } from "react";
import { useAccount } from "wagmi";
import { safeRandomUUID } from "@/utils/did-utils";

/**
 * OmniRep Credential Hook
 *
 * This hook manages verifiable credential creation and IPFS storage
 * for the OmniRep reputation system. Integrates with Pinata/Web3.Storage
 * for decentralized credential storage.
 *
 * @author OmniRep Team - ETHAccra Hackathon 2025
 */

export interface VerifiableCredential {
  "@context": string[];
  id: string;
  type: string[];
  issuer: {
    id: string;
    name: string;
  };
  issuanceDate: string;
  expirationDate?: string;
  credentialSubject: {
    id: string;
    reputationScore: string; // Hashed score
    timestamp: number;
    metadata: Record<string, any>;
  };
  proof?: {
    type: string;
    created: string;
    verificationMethod: string;
    proofPurpose: string;
    proofValue: string;
  };
}

export interface CredentialState {
  isCreating: boolean;
  isUploading: boolean;
  error: string | null;
  lastCredential: VerifiableCredential | null;
  lastCID: string | null;
}

/**
 * Custom hook for managing verifiable credentials
 *
 * Features:
 * - Create W3C compliant verifiable credentials
 * - Upload credentials to IPFS via Pinata
 * - Validate credential format
 * - Retry mechanism for failed uploads
 * - Comprehensive error handling
 */
export function useCredential() {
  const { address, isConnected } = useAccount();

  const [state, setState] = useState<CredentialState>({
    isCreating: false,
    isUploading: false,
    error: null,
    lastCredential: null,
    lastCID: null,
  });

  // Mock Pinata API endpoints (replace with real endpoints in production)
  const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT || "mock_jwt_for_demo";

  /**
   * Creates a verifiable credential with the provided DID and hashed score
   *
   * @param did - The DID of the credential subject
   * @param hashedScore - The hashed reputation score
   * @param metadata - Additional metadata for the credential
   * @returns Promise<VerifiableCredential>
   */
  const createCredential = useCallback(
    async (
      did: string,
      hashedScore: string,
      metadata: Record<string, any> = {},
    ): Promise<VerifiableCredential> => {
      console.log("📜 Creating verifiable credential for DID:", did);

      if (!isConnected || !address) {
        throw new Error("Wallet not connected");
      }

      setState(prev => ({ ...prev, isCreating: true, error: null }));

      try {
        const now = new Date();
        const expirationDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year from now

        // Use our safe UUID generator utility
        const credential: VerifiableCredential = {
          "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://omni-rep.eth/contexts/reputation/v1",
          ],
          id: `urn:uuid:${safeRandomUUID()}`,
          type: ["VerifiableCredential", "ReputationCredential"],
          issuer: {
            id: "did:web:omni-rep.eth",
            name: "OmniRep Reputation System",
          },
          issuanceDate: now.toISOString(),
          expirationDate: expirationDate.toISOString(),
          credentialSubject: {
            id: did,
            reputationScore: hashedScore,
            timestamp: Math.floor(now.getTime() / 1000),
            metadata: {
              ...metadata,
              issuedBy: "OmniRep",
              version: "1.0.0",
              network: "ethereum",
              issuerAddress: address,
            },
          },
        };

        console.log("✅ Verifiable credential created:", credential);

        setState(prev => ({
          ...prev,
          lastCredential: credential,
          isCreating: false,
        }));

        return credential;
      } catch (error) {
        console.error("❌ Error creating credential:", error);
        setState(prev => ({
          ...prev,
          isCreating: false,
          error: `Failed to create credential: ${error}`,
        }));
        throw error;
      }
    },
    [isConnected, address],
  );

  /**
   * Uploads a credential to IPFS using Pinata
   *
   * @param credential - The verifiable credential to upload
   * @param retries - Number of retry attempts (default: 3)
   * @returns Promise<string> - The IPFS CID
   */
  const uploadToIPFS = useCallback(
    async (credential: VerifiableCredential, retries: number = 3): Promise<string> => {
      console.log("☁️ Uploading credential to IPFS via Pinata");

      setState(prev => ({ ...prev, isUploading: true, error: null }));

      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          console.log(`📤 Upload attempt ${attempt}/${retries}`);

          // For demo purposes, we'll simulate IPFS upload
          // In production, replace this with actual Pinata API call
          if (PINATA_JWT === "mock_jwt_for_demo") {
            console.log("🧪 Using mock IPFS upload for demo");
            
            // Simulate upload delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Generate mock CID
            const mockCID = `Qm${Math.random().toString(36).substring(2, 48)}`;
            
            console.log("✅ Mock credential uploaded to IPFS:", mockCID);
            
            setState(prev => ({
              ...prev,
              lastCID: mockCID,
              isUploading: false,
            }));

            return mockCID;
          }

          // Real Pinata upload (commented for demo)
          /*
          const response = await fetch(`${PINATA_API_URL}/pinning/pinJSONToIPFS`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${PINATA_JWT}`,
            },
            body: JSON.stringify({
              pinataContent: credential,
              pinataMetadata: {
                name: `omni-rep-credential-${credential.id}`,
                keyvalues: {
                  type: "verifiable-credential",
                  subject: credential.credentialSubject.id,
                  timestamp: credential.credentialSubject.timestamp.toString(),
                }
              }
            })
          });

          if (!response.ok) {
            throw new Error(`Pinata API error: ${response.statusText}`);
          }

          const result = await response.json();
          const cid = result.IpfsHash;

          console.log("✅ Credential uploaded to IPFS:", cid);

          setState(prev => ({
            ...prev,
            lastCID: cid,
            isUploading: false,
          }));

          return cid;
          */
        } catch (error) {
          console.error(`❌ Upload attempt ${attempt} failed:`, error);

          if (attempt === retries) {
            setState(prev => ({
              ...prev,
              isUploading: false,
              error: `Failed to upload after ${retries} attempts: ${error}`,
            }));
            throw error;
          }

          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }

      throw new Error("Upload failed after all retries");
    },
    [PINATA_JWT],
  );

  /**
   * Creates and uploads a credential in one operation
   *
   * @param did - The DID of the credential subject
   * @param hashedScore - The hashed reputation score
   * @param metadata - Additional metadata for the credential
   * @returns Promise<{ credential: VerifiableCredential, cid: string }>
   */
  const createAndUploadCredential = useCallback(
    async (
      did: string,
      hashedScore: string,
      metadata: Record<string, any> = {},
    ): Promise<{ credential: VerifiableCredential; cid: string }> => {
      console.log("🚀 Creating and uploading credential...");

      try {
        const credential = await createCredential(did, hashedScore, metadata);
        const cid = await uploadToIPFS(credential);

        console.log("🎉 Credential creation and upload complete!");
        console.log("📋 Credential ID:", credential.id);
        console.log("🔗 IPFS CID:", cid);

        return { credential, cid };
      } catch (error) {
        console.error("❌ Error in credential creation/upload:", error);
        throw error;
      }
    },
    [createCredential, uploadToIPFS],
  );

  /**
   * Validates a verifiable credential format
   *
   * @param credential - The credential to validate
   * @returns Boolean indicating if credential is valid
   */
  const validateCredential = useCallback((credential: VerifiableCredential): boolean => {
    try {
      // Basic W3C VC validation
      const requiredFields = ["@context", "id", "type", "issuer", "issuanceDate", "credentialSubject"];
      
      for (const field of requiredFields) {
        if (!(field in credential)) {
          console.error(`❌ Missing required field: ${field}`);
          return false;
        }
      }

      // Check context
      if (!credential["@context"].includes("https://www.w3.org/2018/credentials/v1")) {
        console.error("❌ Missing required W3C context");
        return false;
      }

      // Check types
      if (!credential.type.includes("VerifiableCredential")) {
        console.error("❌ Missing VerifiableCredential type");
        return false;
      }

      console.log("✅ Credential validation passed");
      return true;
    } catch (error) {
      console.error("❌ Credential validation error:", error);
      return false;
    }
  }, []);

  /**
   * Gets the IPFS gateway URL for a CID
   *
   * @param cid - The IPFS Content Identifier
   * @returns Gateway URL string
   */
  const getIPFSUrl = useCallback((cid: string): string => {
    return `https://gateway.pinata.cloud/ipfs/${cid}`;
  }, []);

  return {
    // State
    isCreating: state.isCreating,
    isUploading: state.isUploading,
    error: state.error,
    lastCredential: state.lastCredential,
    lastCID: state.lastCID,

    // Actions
    createCredential,
    uploadToIPFS,
    createAndUploadCredential,
    validateCredential,
    getIPFSUrl,

    // Utility
    isConnected,
    address,
  };
}
