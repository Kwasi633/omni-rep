/* eslint-disable prettier/prettier */
"use client"

import { useState } from "react"
import type { TabId } from "@/types/dashboard"
import { SIDEBAR_ITEMS } from "@/lib/constants"
import { Sidebar } from "@/components/layout/sidebar"
import { OverviewView } from "@/components/views/overview-view"
import { ReputationView } from "@/components/views/reputation-view"
import { ConnectionsView } from "@/components/views/connections-view"
import { GrantsView } from "@/components/views/grants-view"
import { AnalyticsView } from "@/components/views/analytics-view"
import { SettingsView } from "@/components/views/settings-view"

export default function OmniRepDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<TabId>("overview")

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
