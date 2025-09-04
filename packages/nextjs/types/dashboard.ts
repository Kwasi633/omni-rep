import type { LucideIcon } from "lucide-react"

export interface SidebarItem {
  id: string
  label: string
  icon: LucideIcon
}

export interface Activity {
  platform: string
  activity: string
  score: number
  verified: boolean
  icon: LucideIcon
}

export interface ReputationData {
  subject: string
  A: number
  fullMark: number
}

export interface ScoreHistory {
  month: string
  score: number
}

export type TabId = "overview" | "reputation" | "connections" | "grants" | "analytics" | "settings"
