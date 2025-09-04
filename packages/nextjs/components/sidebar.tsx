"use client"

import type { LucideIcon } from "lucide-react"

interface SidebarItem {
  id: string
  label: string
  icon: LucideIcon
}

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  activeTab: string
  setActiveTab: (tab: string) => void
  sidebarItems: SidebarItem[]
}

export function Sidebar({ sidebarOpen, setSidebarOpen, activeTab, setActiveTab, sidebarItems }: SidebarProps) {
  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } bg-gradient-to-b from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 shadow-2xl shadow-teal-500/10`}
      >
        <div className="flex flex-col h-full p-4">
          <nav className="flex-1 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-teal-500/20 to-purple-500/20 text-white border border-teal-500/30 shadow-lg shadow-teal-500/10"
                      : "text-gray-300 hover:text-white hover:bg-slate-800/50 hover:shadow-md"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${activeTab === item.id ? "text-teal-400" : "text-gray-400 group-hover:text-teal-400"}`}
                  />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  )
}
