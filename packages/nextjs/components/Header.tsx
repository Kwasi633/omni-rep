/* eslint-disable prettier/prettier */
"use client";
import React, { useCallback } from 'react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Bell as BellRaw, 
  Search as SearchRaw, 
  Menu as MenuRaw, 
  Wallet as WalletRaw,
  User as UserRaw,
  ExternalLink as ExternalLinkRaw,
  LogOut as LogOutRaw
} from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

// Lucide icons
const MenuIcon = (props: any) => <MenuRaw {...props} />;
const SearchIcon = (props: any) => <SearchRaw {...props} />;
const WalletIcon = (props: any) => <WalletRaw {...props} />;
const BellIcon = (props: any) => <BellRaw {...props} />;
const UserIcon = (props: any) => <UserRaw {...props} />;
const ExternalLinkIcon = (props: any) => <ExternalLinkRaw {...props} />;
const LogOutIcon = (props: any) => <LogOutRaw {...props} />;

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  // Use our global wallet context
  const { 
    address,
    ensName,
    isConnecting,
    hasPendingRequest,
    connectWallet,
    disconnectWallet
  } = useWallet();

  // We don't need the effect to check for connections anymore
  // as this is handled by our WalletContext

  // Function to handle wallet connection using our WalletContext
  const handleWalletConnect = useCallback(() => {
    if (address) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  }, [address, connectWallet, disconnectWallet]);

  // Function to view ENS profile
  const viewENSProfile = useCallback(() => {
    if (ensName) {
      window.open(`https://sepolia.app.ens.domains/name/${ensName}`, '_blank');
    } else if (address) {
      window.open(`https://sepolia.app.ens.domains/address/${address}`, '_blank');
    }
  }, [ensName, address]);

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
            <MenuIcon className="h-5 w-5" />
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
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search reputation data..."
              className="pl-10 bg-gray-800/50 border-gray-700 text-gray-200 placeholder-gray-400 focus:border-teal-500 focus:ring-teal-500/20"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasPendingRequest && (
            <Button
              onClick={() => connectWallet()} // This will reset pending state in WalletContext
              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm"
            >
              Reset
            </Button>
          )}
          
          {address ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="bg-gradient-to-r from-teal-500/20 to-purple-500/20 border border-teal-500/30 text-teal-300 
                            hover:from-teal-500/30 hover:to-purple-500/30 flex items-center gap-2 px-3 py-2 rounded-lg font-medium"
                >
                  <WalletIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {ensName 
                      ? ensName.split('.')[0] 
                      : `${address.slice(0, 6)}...${address.slice(-4)}`}
                  </span>
                  {ensName && (
                    <Badge className="ml-1 bg-green-500/20 border-green-500/30 text-green-300 text-xs px-1.5 py-0">
                      ENS
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-[240px] bg-gray-800 border border-gray-700 text-gray-300">
                <div className="px-3 py-2 text-xs text-gray-400 border-b border-gray-700">Connected Wallet</div>
                {ensName && (
                  <DropdownMenuItem 
                    onClick={viewENSProfile}
                    className="flex items-center gap-2 px-3 py-2 text-green-300 hover:bg-gray-700"
                  >
                    <UserIcon className="h-4 w-4" /> 
                    <span>{ensName}</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 hover:bg-gray-700 text-teal-300">
                  <WalletIcon className="h-4 w-4" /> 
                  <span>{`${address.slice(0, 10)}...${address.slice(-6)}`}</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={viewENSProfile}
                  className="flex items-center gap-2 px-3 py-2 text-blue-300 hover:bg-gray-700"
                >
                  <ExternalLinkIcon className="h-4 w-4" /> 
                  <span>View on ENS</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={disconnectWallet}
                  className="flex items-center gap-2 px-3 py-2 text-red-300 hover:bg-gray-700 border-t border-gray-700"
                >
                  <LogOutIcon className="h-4 w-4" /> 
                  <span>Disconnect</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={handleWalletConnect}
              disabled={isConnecting}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                isConnecting
                  ? "bg-gradient-to-r from-yellow-500/50 to-orange-500/50 text-yellow-100 cursor-not-allowed"
                  : hasPendingRequest
                    ? "bg-gradient-to-r from-red-500/50 to-orange-500/50 text-red-100"
                    : "bg-gradient-to-r from-teal-500 to-purple-500 text-white hover:from-teal-600 hover:to-purple-600 shadow-lg shadow-teal-500/25"
              }`}
            >
              <WalletIcon className="h-4 w-4" />
              <span className="hidden sm:inline">
                {isConnecting 
                  ? "Connecting..." 
                  : hasPendingRequest
                    ? "Pending in MetaMask"
                    : "Connect Wallet"
                }
              </span>
            </Button>
          )}

          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800/50">
            {/* @ts-ignore */}
            <BellIcon className="h-5 w-5" />
          </Button>
          <div className="h-8 w-8 ring-2 ring-teal-500/20 rounded-full bg-gradient-to-br from-teal-500 to-purple-500 flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {ensName 
                ? ensName.slice(0, 2).toUpperCase() 
                : address 
                  ? address.slice(2, 4).toUpperCase() 
                  : "OR"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
