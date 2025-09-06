/* eslint-disable prettier/prettier */
"use client";
import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useEnsName } from 'wagmi';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Bell, 
  Search, 
  Menu,
  Wallet,
  Copy
} from "lucide-react";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 shadow-lg shadow-teal-500/5">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-gray-300 hover:text-white hover:bg-gray-800/50"
          >
            {/* @ts-ignore */}
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">OR</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
              OmniRep
            </span>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            {/* @ts-ignore */}
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search reputation data..."
              className="pl-10 bg-gray-800/50 border-gray-700 text-gray-200 placeholder-gray-400 focus:border-teal-500 focus:ring-teal-500/20"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800/50">
            {/* @ts-ignore */}
            <Bell className="h-5 w-5" />
          </Button>
          
          {isConnected && address ? (
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-800/50 rounded-lg border border-gray-700/50">
                {/* @ts-ignore */}
                <Wallet className="h-4 w-4 text-teal-400" />
                <span className="text-sm text-gray-300">
                  {ensName || formatAddress(address)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyAddress}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                >
                  {/* @ts-ignore */}
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <ConnectButton />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <ConnectButton />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
