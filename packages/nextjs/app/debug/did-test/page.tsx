/* eslint-disable prettier/prettier */
"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useIdentity } from "@/hooks/useIdentity";
import { useCredential } from "@/hooks/useCredential";
import { hashReputationScore, generateMockReputationData } from "@/utils/hashScore";
import { generateDeterministicDID, safeRandomUUID } from "@/utils/did-utils";

export default function TestDID() {
  const {
    did,
    didDocument,
    ensName,
    isCreating,
    error,
    createDID,
    isDIDCreated,
    clearDID,
    resolveDIDFromENS
  } = useIdentity();
  
  const {
    isCreating: isCreatingCredential,
    isUploading,
    error: credentialError,
    lastCID,
    createAndUploadCredential,
  } = useCredential();

  const [credentialTestResult, setCredentialTestResult] = useState("");
  const { address } = useAccount();
  const [debugInfo, setDebugInfo] = useState<string>("");

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🚀 OmniRep DID + ENS Integration Test</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* DID Status Card */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-teal-400">🆔 Decentralized Identity Status</h2>
          <div className="space-y-3">
            <p><span className="font-semibold">Wallet:</span> {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}</p>
            <p><span className="font-semibold">DID:</span> {did ? `${did.slice(0, 30)}...` : 'Not created'}</p>
            <p><span className="font-semibold">ENS Name:</span> 
              {ensName ? (
                <span className="text-green-400 font-mono ml-2">{ensName}</span>
              ) : (
                <span className="text-gray-500 ml-2">Not assigned</span>
              )}
            </p>
            <p><span className="font-semibold">Status:</span> 
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                isCreating ? 'bg-yellow-600 text-yellow-100' : 
                isDIDCreated() ? 'bg-green-600 text-green-100' : 
                'bg-gray-600 text-gray-100'
              }`}>
                {isCreating ? 'Creating...' : isDIDCreated() ? 'Active' : 'Not Created'}
              </span>
            </p>
            {error && (
              <div className="p-3 bg-red-900/30 border border-red-500/50 rounded">
                <p className="text-red-400 text-sm">❌ {error}</p>
              </div>
            )}
          </div>
        </div>

        {/* ENS Benefits Card */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-purple-400">🌐 ENS Integration Benefits</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✅</span>
              <span>Human-readable identity</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✅</span>
              <span>Free subnames under omnirep.eth</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✅</span>
              <span>DID stored in ENS text records</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✅</span>
              <span>Discoverable across all dApps</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✅</span>
              <span>Portable reputation system</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✅</span>
              <span>No gas cost to users</span>
            </div>
          </div>
          
          {ensName && (
            <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded">
              <p className="text-green-400 font-semibold mb-1">🎉 ENS Identity Active!</p>
              <p className="text-sm">Your reputation is now discoverable at:</p>
              <code className="text-green-300 text-xs">{ensName}</code>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => createDID()}
            disabled={isCreating || !address}
            className="bg-gradient-to-r from-teal-600 to-purple-600 hover:from-teal-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed"
          >
            {isCreating ? '🔄 Creating DID + ENS...' : '🚀 Create DID + ENS Identity'}
          </button>

          <button
            onClick={clearDID}
            disabled={isCreating}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
          >
            🗑️ Clear Identity
          </button>
        </div>

        {!address && (
          <div className="p-4 bg-yellow-900/30 border border-yellow-500/50 rounded">
            <p className="text-yellow-400">⚠️ Please connect your wallet to test DID creation</p>
          </div>
        )}
      </div>
      
      {didDocument && (
        <div className="mt-4 bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-2">DID Document:</h2>
          <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(didDocument, null, 2)}</pre>
        </div>
      )}
      
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Credential Testing</h2>
        
        <button 
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={async () => {
            try {
              if (!did) {
                setCredentialTestResult("No DID available. Create a DID first.");
                return;
              }
              
              // Generate mock reputation data
              const reputationData = generateMockReputationData(800);
              const hashedScore = hashReputationScore(reputationData);
              
              // Create and upload credential
              const result = await createAndUploadCredential(did, hashedScore, {
                platform: "test-platform",
                demoMode: true
              });
              
              setCredentialTestResult(`Success! Credential created with CID: ${result.cid}`);
            } catch (error) {
              console.error("Credential test error:", error);
              setCredentialTestResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
            }
          }}
          disabled={!isDIDCreated() || isCreatingCredential || isUploading}
        >
          {isCreatingCredential || isUploading ? "Processing..." : "Test Credential Creation"}
        </button>
        
        {credentialError && (
          <div className="mt-2 p-3 bg-red-800/30 border border-red-500 rounded">
            <p className="text-red-400">Credential Error: {credentialError}</p>
          </div>
        )}
        
        {credentialTestResult && (
          <div className="mt-2 p-3 bg-gray-800 border border-gray-700 rounded">
            <p>{credentialTestResult}</p>
          </div>
        )}
        
        {lastCID && (
          <div className="mt-2 p-3 bg-gray-800 border border-green-700/30 rounded">
            <p><strong>Last CID:</strong> {lastCID}</p>
          </div>
        )}
      </div>
      
      <div className="mt-8 border-t border-gray-700 pt-4">
        <h2 className="text-xl font-bold mb-4">Debug Tools</h2>
        
        <button
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={() => {
            if (address) {
              try {
                const { did: testDid } = generateDeterministicDID(address);
                setDebugInfo(`Deterministic DID for ${address}:\n${testDid}\n\nThis should match the DID above if working correctly.`);
              } catch (error) {
                setDebugInfo(`Error generating test DID: ${error instanceof Error ? error.message : String(error)}`);
              }
            } else {
              setDebugInfo("No wallet address available. Please connect your wallet.");
            }
          }}
        >
          Test DID Generation
        </button>
        
        <button
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={() => {
            try {
              const uuid = safeRandomUUID();
              setDebugInfo(`Generated UUID: ${uuid}`);
            } catch (error) {
              setDebugInfo(`Error generating UUID: ${error instanceof Error ? error.message : String(error)}`);
            }
          }}
        >
          Test UUID Generation
        </button>

        <button
          className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
          onClick={async () => {
            try {
              if (ensName) {
                const resolvedDID = await resolveDIDFromENS(ensName);
                setDebugInfo(`ENS Resolution Test:\nENS Name: ${ensName}\nResolved DID: ${resolvedDID || 'Not found'}\n\nThis demonstrates how any dApp can resolve your identity from your ENS name.`);
              } else {
                setDebugInfo("No ENS name available. Create a DID first to test ENS resolution.");
              }
            } catch (error) {
              setDebugInfo(`ENS resolution error: ${error instanceof Error ? error.message : String(error)}`);
            }
          }}
        >
          Test ENS Resolution
        </button>
        
        {debugInfo && (
          <div className="mt-4 p-4 bg-gray-800/80 border border-purple-500/30 rounded whitespace-pre-wrap">
            <h3 className="text-lg font-semibold mb-2">Debug Output:</h3>
            <pre className="text-sm">{debugInfo}</pre>
          </div>
        )}
      </div>

      {/* Technical Details */}
      {didDocument && (
        <div className="mt-8 border-t border-gray-700 pt-6">
          <h2 className="text-xl font-bold mb-4 text-blue-400">📋 Technical Details</h2>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-bold mb-2">DID Document:</h3>
            <pre className="text-xs bg-gray-900 p-3 rounded overflow-auto whitespace-pre-wrap border border-gray-600">
              {JSON.stringify(didDocument, null, 2)}
            </pre>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-bold mb-2 text-teal-400">🔑 Deterministic Generation</h3>
              <ul className="text-sm space-y-1">
                <li>• DID derived from wallet address</li>
                <li>• Same DID across all devices</li>
                <li>• No storage dependency</li>
                <li>• Cryptographically secure</li>
              </ul>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-bold mb-2 text-purple-400">🌐 ENS Integration</h3>
              <ul className="text-sm space-y-1">
                <li>• Free subnames under omnirep.eth</li>
                <li>• Human-readable identity</li>
                <li>• DID stored in text records</li>
                <li>• Cross-dApp compatibility</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
