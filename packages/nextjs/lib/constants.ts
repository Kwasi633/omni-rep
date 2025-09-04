import {
  Home,
  Star,
  Link,
  DollarSign,
  BarChart3,
  Settings,
  Vote,
  Coins,
  TrendingUp,
  Github,
  Linkedin,
  Users,
} from "lucide-react"
import type { SidebarItem, Activity, ReputationData } from "@/types/dashboard"

export const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "reputation", label: "Reputation Score", icon: Star },
  { id: "connections", label: "Connections", icon: Link },
  { id: "grants", label: "Grants & Opportunities", icon: DollarSign },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
]

export const REPUTATION_DATA: ReputationData[] = [
  { subject: "Technical", A: 85, fullMark: 100 },
  { subject: "Community", A: 72, fullMark: 100 },
  { subject: "Financial", A: 91, fullMark: 100 },
  { subject: "Governance", A: 68, fullMark: 100 },
  { subject: "Reliability", A: 94, fullMark: 100 },
  { subject: "Innovation", A: 77, fullMark: 100 },
]

export const ON_CHAIN_ACTIVITIES: Activity[] = [
  { platform: "Ethereum", activity: "DAO Governance", score: 95, verified: true, icon: Vote },
  { platform: "Polygon", activity: "DeFi Lending", score: 88, verified: true, icon: Coins },
  { platform: "Arbitrum", activity: "Liquidity Provision", score: 92, verified: true, icon: TrendingUp },
]

export const OFF_CHAIN_ACTIVITIES: Activity[] = [
  { platform: "GitHub", activity: "Open Source Contributions", score: 89, verified: true, icon: Github },
  { platform: "LinkedIn", activity: "Professional Network", score: 76, verified: true, icon: Linkedin },
  { platform: "Discord", activity: "Community Engagement", score: 83, verified: false, icon: Users },
]

export const CURRENT_SCORE = 847
export const CONNECTED_PLATFORMS = 12
export const AVAILABLE_GRANTS = 8
export const MONTHLY_GROWTH = "+2.7%"
