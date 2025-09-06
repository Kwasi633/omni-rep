/* eslint-disable prettier/prettier */
"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useENSIntegration } from '@/utils/ens-utils';

interface User {
  address: string;
  ensName?: string;
  did?: string;
  isOnboarded: boolean;
  joinedAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  completeOnboarding: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // RainbowKit hooks
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  
  // ENS integration
  const { ensName, resolveDIDFromENS } = useENSIntegration();

  // Load user data from localStorage and sync with wallet connection
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      
      try {
        if (isConnected && address) {
          // Load existing user data from localStorage
          const savedUser = localStorage.getItem(`omnirep_user_${address}`);
          
          if (savedUser) {
            const userData = JSON.parse(savedUser);
            
            // Update with latest ENS data if available
            const updatedUser = { ...userData, address };
            
            if (ensName) {
              updatedUser.ensName = ensName;
              
              // Try to resolve DID from ENS
              try {
                const did = await resolveDIDFromENS(ensName);
                if (did) {
                  updatedUser.did = did;
                }
              } catch (error) {
                console.warn('Failed to resolve DID from ENS:', error);
              }
            }
            
            setUser(updatedUser);
            
            // Update localStorage with latest data
            localStorage.setItem(`omnirep_user_${address}`, JSON.stringify(updatedUser));
          } else {
            // New user - create basic user object
            const newUser: User = {
              address,
              ensName: ensName || undefined,
              isOnboarded: false,
              joinedAt: new Date().toISOString(),
            };
            
            setUser(newUser);
          }
        } else {
          // Not connected
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [isConnected, address, ensName, resolveDIDFromENS]);

  const logout = useCallback(() => {
    // Disconnect wallet using RainbowKit
    disconnect();
    
    // Clear user state
    setUser(null);
    
    // Optionally clear localStorage (keeping user data but clearing session)
    console.log('User logged out');
  }, [disconnect]);

  // Auto-logout when wallet disconnects
  useEffect(() => {
    if (!isConnected && user) {
      console.log('Wallet disconnected - logging out user');
      logout();
    }
  }, [isConnected, user, logout]);

  const login = async () => {
    // RainbowKit handles the actual wallet connection
    // This function can be used for additional login logic if needed
    if (!isConnected) {
      throw new Error('Wallet not connected. Please connect your wallet first.');
    }
  };

  const completeOnboarding = async (userData: Partial<User>) => {
    if (!user || !address) {
      throw new Error('No user or address available');
    }

    const updatedUser: User = {
      ...user,
      ...userData,
      isOnboarded: true,
      address, // Ensure address is always current
    };

    setUser(updatedUser);
    
    // Save to localStorage
    localStorage.setItem(`omnirep_user_${address}`, JSON.stringify(updatedUser));
    
    console.log('Onboarding completed for user:', updatedUser.address);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: isConnected && user !== null,
    isLoading,
    login,
    logout,
    completeOnboarding,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
