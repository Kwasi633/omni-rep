/* eslint-disable prettier/prettier */
"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

interface WalletContextType {
  address: string | null;
  ensName: string | null;
  isConnecting: boolean;
  hasPendingRequest: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  setWalletENS: (name: string) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [ensName, setEnsName] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);

  // Load stored wallet and ENS info on init
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const savedAddress = localStorage.getItem("omnirep_wallet_address");
    const savedEnsName = localStorage.getItem("omnirep_ens_name");
    
    if (savedAddress) {
      setAddress(savedAddress);
      console.log("[WalletContext] Restored wallet address from storage:", savedAddress);
    }
    
    if (savedEnsName) {
      setEnsName(savedEnsName);
      console.log("[WalletContext] Restored ENS name from storage:", savedEnsName);
    }
  }, []);

  // Effect to handle account changes from MetaMask
  useEffect(() => {
    if (typeof window === "undefined" || !(window as any).ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      console.log("[WalletContext] Accounts changed:", accounts);
      if (accounts.length > 0) {
        const newAddress = accounts[0];
        setAddress(newAddress);
        localStorage.setItem("omnirep_wallet_address", newAddress);
      } else {
        setAddress(null);
        localStorage.removeItem("omnirep_wallet_address");
        localStorage.removeItem("omnirep_ens_name"); // Clear ENS when disconnecting
        setEnsName(null);
      }
    };

    (window as any).ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      if ((window as any).ethereum?.removeListener) {
        (window as any).ethereum.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, []);

  // Connect wallet function that always prompts for account selection
  const connectWallet = useCallback(async () => {
    if (isConnecting) return;
    if (!(window as any).ethereum) {
      alert("MetaMask not detected. Please install MetaMask to continue.");
      return;
    }

    setIsConnecting(true);

    try {
      // Always request accounts to show MetaMask popup
      const accounts: string[] = await (window as any).ethereum.request({ 
        method: "eth_requestAccounts" 
      });
      
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        console.log("[WalletContext] Wallet connected successfully:", accounts[0]);
      }
    } catch (err: any) {
      if (err.code === 4001) {
        console.log("[WalletContext] User rejected the connection request");
      } else if (err.code === -32002) {
        console.log("[WalletContext] Connection request already pending");
        setHasPendingRequest(true);
        alert("Connection request is pending in MetaMask. Please check your MetaMask extension.");
      } else {
        console.error("[WalletContext] Wallet connection failed:", err);
        alert("Failed to connect wallet. Please try again.");
      }
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting]);

  // Disconnect wallet function
  const disconnectWallet = useCallback(() => {
    setAddress(null);
    setEnsName(null);
    localStorage.removeItem("omnirep_wallet_address");
    localStorage.removeItem("omnirep_ens_name");
    console.log("[WalletContext] Wallet disconnected locally");
  }, []);
  
  // Set ENS name function
  const setWalletENS = useCallback((name: string) => {
    setEnsName(name);
    localStorage.setItem("omnirep_ens_name", name);
    console.log("[WalletContext] ENS name set and stored:", name);
  }, []);

  const value = {
    address,
    ensName,
    isConnecting,
    hasPendingRequest,
    connectWallet,
    disconnectWallet,
    setWalletENS
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
