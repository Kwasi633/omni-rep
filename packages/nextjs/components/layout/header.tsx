/* eslint-disable prettier/prettier */
// /* eslint-disable prettier/prettier */
// "use client";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Bell, Search, Menu } from "lucide-react";
// import { RainbowKitCustomConnectButton } from "../scaffold-eth/RainbowKitCustomConnectButton";

// interface HeaderProps {
//   sidebarOpen: boolean;
//   setSidebarOpen: (open: boolean) => void;
// }

// export function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
//   // We're using the RainbowKitCustomConnectButton component that handles wallet connection

//   // We'll use RainbowKitCustomConnectButton instead of manually handling wallet connection

//   return (
//     <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 shadow-lg shadow-teal-500/5">
//       <div className="flex items-center justify-between h-full px-4">
//         <div className="flex items-center gap-4">
//           <Button
//             variant="ghost"
// @ts-nocheck
//             size="sm"
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="lg:hidden text-gray-300 hover:text-white hover:bg-gray-800/50"
//           >
//             <Menu size={20} />
// Avatar component removed, using simple placeholder
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-purple-500 rounded-lg flex items-center justify-center">
//               <span className="text-white font-bold text-sm">OR</span>
//             </div>
//             <span className="text-xl font-bold bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
//               OmniRep
//             </span>
//           </div>
//         </div>

//         <div className="flex-1 max-w-md mx-4">
//           <div className="relative">
//             <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             <Input
//               placeholder="Search reputation data..."
//               className="pl-10 bg-gray-800/50 border-gray-700 text-gray-200 placeholder-gray-400 focus:border-teal-500 focus:ring-teal-500/20"
//             />
//           </div>
//         </div>

//         <div className="flex items-center gap-3">
//           <div className="flex items-center">
//             <RainbowKitCustomConnectButton />
//           </div>

//           <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800/50">
//             <Bell size={20} />
//           </Button>
//           <Avatar className="h-8 w-8 ring-2 ring-teal-500/20">
//             <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Default avatar" />
//             <AvatarFallback className="bg-gradient-to-br from-teal-500 to-purple-500 text-white text-sm">
//               OR
//             </AvatarFallback>
//           </Avatar>
//         </div>
//       </div>
//     </header>
//   )
// }


/* eslint-disable prettier/prettier */
"use client";
import React, { useState } from 'react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell as BellRaw, Search as SearchRaw, Menu as MenuRaw, Wallet as WalletRaw } from "lucide-react";
// Manual wallet connection, no wagmi used

// Lucide icons
const MenuIcon = (props: any) => <MenuRaw {...props} />;
const SearchIcon = (props: any) => <SearchRaw {...props} />;
const WalletIcon = (props: any) => <WalletRaw {...props} />;
const BellIcon = (props: any) => <BellRaw {...props} />;

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  // Manual MetaMask connection state
  const [address, setAddress] = useState<string | null>(null);

  const handleWalletConnect = async () => {
    if (address) {
      // disconnect
      setAddress(null);
    } else if ((window as any).ethereum) {
      try {
        // Check if there's already a pending request
        const existingAccounts = await (window as any).ethereum.request({ 
          method: 'eth_accounts' 
        });
        
        if (existingAccounts.length > 0) {
          setAddress(existingAccounts[0]);
        } else {
          const accounts: string[] = await (window as any).ethereum.request({ 
            method: 'eth_requestAccounts' 
          });
          setAddress(accounts[0]);
        }
      } catch (err: any) {
        // Only log if it's not a user rejection or pending request
        if (err.code !== 4001 && err.code !== -32002) {
          console.error('Wallet connection failed', err);
        }
      }
    } else {
      alert('MetaMask not detected');
    }
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
          <Button
            onClick={handleWalletConnect}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
              address
                ? "bg-gradient-to-r from-teal-500/20 to-purple-500/20 border border-teal-500/30 text-teal-300 hover:from-teal-500/30 hover:to-purple-500/30"
                : "bg-gradient-to-r from-teal-500 to-purple-500 text-white hover:from-teal-600 hover:to-purple-600 shadow-lg shadow-teal-500/25"
            }`}
          >
            <WalletIcon className="h-4 w-4" />
            <span className="hidden sm:inline">
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connect Wallet"}
            </span>
          </Button>

          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800/50">
            {/* @ts-ignore */}
            <BellIcon className="h-5 w-5" />
          </Button>
          <div className="h-8 w-8 ring-2 ring-teal-500/20 rounded-full bg-gradient-to-br from-teal-500 to-purple-500 flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {address ? address.slice(2, 4).toUpperCase() : "OR"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
