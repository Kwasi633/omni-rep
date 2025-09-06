/* eslint-disable prettier/prettier */
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAccount } from "wagmi"
import type { TabId } from "@/types/dashboard"
import { SIDEBAR_ITEMS } from "@/lib/constants"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/Header"
import { OverviewView } from "@/components/views/overview-view"
import ReputationView from "@/components/views/reputation-view"
import { ConnectionsView } from "@/components/views/connections-view"
import { GrantsView } from "@/components/views/grants-view"
import { AnalyticsView } from "@/components/views/analytics-view"
import { SettingsView } from "@/components/views/settings-view"
import { hasCompletedOnboarding } from "@/utils/userData"

export default function OmniRepDashboard() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<TabId>("overview")
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true)

  // Check onboarding status when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      const hasOnboarded = hasCompletedOnboarding(address)
      if (!hasOnboarded) {
        // User hasn't completed onboarding, redirect to onboarding
        router.push('/onboarding')
        return
      }
    }
    setIsCheckingOnboarding(false)
  }, [address, isConnected, router])

  // Show loading while checking onboarding status
  if (isCheckingOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewView />
      case "reputation":
        return <ReputationView />
      case "connections":
        return <ConnectionsView />
      case "grants":
        return <GrantsView />
      case "analytics":
        return <AnalyticsView />
      case "settings":
        return <SettingsView />
      default:
        return <OverviewView />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarItems={SIDEBAR_ITEMS}
      />

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : ""} pt-16`}>
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50/5 via-transparent to-gray-100/5 backdrop-blur-sm overflow-y-auto">
          <div className="p-6 space-y-6">{renderActiveView()}</div>
        </div>
      </main>
    </div>
  )
}
