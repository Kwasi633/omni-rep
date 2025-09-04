"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search, Menu, Wallet } from "lucide-react"
import { useState } from "react"

interface HeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  const handleWalletConnect = () => {
    if (walletConnected) {
      setWalletConnected(false)
      setWalletAddress("")
    } else {
      // Mock wallet connection
      setWalletConnected(true)
      setWalletAddress("0x1234...5678")
    }
  }

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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
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
              walletConnected
                ? "bg-gradient-to-r from-teal-500/20 to-purple-500/20 border border-teal-500/30 text-teal-300 hover:from-teal-500/30 hover:to-purple-500/30"
                : "bg-gradient-to-r from-teal-500 to-purple-500 text-white hover:from-teal-600 hover:to-purple-600 shadow-lg shadow-teal-500/25"
            }`}
          >
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">{walletConnected ? walletAddress : "Connect Wallet"}</span>
          </Button>

          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800/50">
            <Bell className="h-5 w-5" />
          </Button>
          <Avatar className="h-8 w-8 ring-2 ring-teal-500/20">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback className="bg-gradient-to-br from-teal-500 to-purple-500 text-white text-sm">
              JD
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
