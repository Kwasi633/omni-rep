"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  Download,
  Share,
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
  Zap,
  Eye,
  Lock,
  X,
  Copy,
  ExternalLink,
  QrCode,
} from "lucide-react"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
} from "recharts"
import { REPUTATION_DATA, ON_CHAIN_ACTIVITIES, OFF_CHAIN_ACTIVITIES, CURRENT_SCORE } from "@/lib/constants"
import { useState } from "react"

const scoreBreakdown = [
  { category: "Technical Skills", current: 85, potential: 95, color: "#14B8A6" },
  { category: "Community Engagement", current: 78, potential: 90, color: "#8B5CF6" },
  { category: "Financial Reliability", current: 92, potential: 95, color: "#3B82F6" },
  { category: "Identity Verification", current: 88, potential: 100, color: "#10B981" },
  { category: "Governance Participation", current: 65, potential: 85, color: "#F59E0B" },
  { category: "Security Practices", current: 95, potential: 100, color: "#EF4444" },
]

const monthlyTrend = [
  { month: "Jan", score: 720, verified: 680 },
  { month: "Feb", score: 745, verified: 710 },
  { month: "Mar", score: 768, verified: 735 },
  { month: "Apr", score: 785, verified: 760 },
  { month: "May", score: 812, verified: 785 },
  { month: "Jun", score: 847, verified: 820 },
]

export function ReputationView() {
  const [showCredentialPreview, setShowCredentialPreview] = useState(false)
  const [credentialType, setCredentialType] = useState<"preview" | "share" | "export">("preview")

  const CredentialModal = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {credentialType === "preview" && "Credential Preview"}
              {credentialType === "share" && "Share Credential"}
              {credentialType === "export" && "Export Credential"}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCredentialPreview(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 border-2 border-gradient-to-r from-teal-500/30 via-purple-500/30 to-blue-500/30 rounded-xl p-8 mb-6">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.1),transparent_50%)]"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.1),transparent_50%)]"></div>
            </div>

            <div className="relative text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-teal-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                OmniRep Credential
              </h3>
              <p className="text-gray-400">Decentralized Reputation Certificate</p>
            </div>

            <div className="text-center mb-8">
              <div className="text-6xl font-bold bg-gradient-to-r from-teal-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                {CURRENT_SCORE}
              </div>
              <div className="text-gray-300 text-lg">Reputation Score</div>
              <div className="flex justify-center gap-2 mt-3">
                <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  <Lock className="h-3 w-3 mr-1" />
                  Zero-Knowledge
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
                <div className="text-2xl font-bold text-teal-400">Top 15%</div>
                <div className="text-gray-400 text-sm">Global Rank</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
                <div className="text-2xl font-bold text-purple-400">98.5%</div>
                <div className="text-gray-400 text-sm">Reliability</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
                <div className="text-2xl font-bold text-blue-400">847</div>
                <div className="text-gray-400 text-sm">Peak Score</div>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Issued:</span>
                  <span className="text-white ml-2">{new Date().toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-400">Valid Until:</span>
                  <span className="text-white ml-2">
                    {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Credential ID:</span>
                  <span className="text-white ml-2 font-mono">0x7f8a...9b2c</span>
                </div>
                <div>
                  <span className="text-gray-400">Blockchain:</span>
                  <span className="text-white ml-2">Ethereum</span>
                </div>
              </div>
            </div>

            <div className="absolute top-4 right-4">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                <QrCode className="h-10 w-10 text-gray-900" />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            {credentialType === "preview" && (
              <>
                <Button
                  onClick={() => setCredentialType("share")}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button
                  onClick={() => setCredentialType("export")}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </>
            )}

            {credentialType === "share" && (
              <div className="w-full space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value="https://omnirep.io/verify/0x7f8a...9b2c"
                    readOnly
                    className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  />
                  <Button variant="outline" className="border-gray-600 bg-transparent">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 border-gray-600 bg-transparent">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                  <Button variant="outline" className="flex-1 border-gray-600 bg-transparent">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Twitter
                  </Button>
                  <Button variant="outline" className="flex-1 border-gray-600 bg-transparent">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </div>
              </div>
            )}

            {credentialType === "export" && (
              <div className="w-full space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="border-gray-600 bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    PDF Certificate
                  </Button>
                  <Button variant="outline" className="border-gray-600 bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    JSON Data
                  </Button>
                  <Button variant="outline" className="border-gray-600 bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Verifiable Credential
                  </Button>
                  <Button variant="outline" className="border-gray-600 bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Blockchain Proof
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Reputation Score
          </h1>
          <p className="text-gray-400 mt-2">Your decentralized identity and trust metrics</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent hover:border-teal-500/50"
            onClick={() => {
              setCredentialType("preview")
              setShowCredentialPreview(true)
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent hover:border-purple-500/50"
            onClick={() => {
              setCredentialType("share")
              setShowCredentialPreview(true)
            }}
          >
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button
            className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600"
            onClick={() => {
              setCredentialType("export")
              setShowCredentialPreview(true)
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Credential
          </Button>
        </div>
      </div>

      {showCredentialPreview && <CredentialModal />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-purple-500/5"></div>
          <CardContent className="p-8 relative">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <div className="text-7xl font-bold bg-gradient-to-r from-teal-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {CURRENT_SCORE}
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span>+35 points this month</span>
                </div>
              </div>

              <div className="flex justify-center gap-3 flex-wrap">
                <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30 px-3 py-1">
                  <Shield className="h-3 w-3 mr-1" />
                  Privacy Verified
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-3 py-1">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Zero-Knowledge Proof
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-3 py-1">
                  <Lock className="h-3 w-3 mr-1" />
                  Decentralized
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">Top 15%</div>
                  <div className="text-gray-400 text-sm">Global Ranking</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">98.5%</div>
                  <div className="text-gray-400 text-sm">Reliability</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">847</div>
                  <div className="text-gray-400 text-sm">Peak Score</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-400" />
              Score Potential
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-white">952</div>
              <div className="text-gray-400 text-sm">Maximum Achievable</div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">Current Progress</span>
                  <span className="text-teal-400">89%</span>
                </div>
                <Progress value={89} className="h-2 bg-gray-700" />
              </div>

              <div className="p-3 rounded-lg bg-gradient-to-r from-teal-500/10 to-purple-500/10 border border-teal-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span className="text-white font-medium">Quick Wins</span>
                </div>
                <div className="text-gray-400 text-sm">Complete identity verification for +25 points</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white">Reputation Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={REPUTATION_DATA}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#D1D5DB", fontSize: 12 }} />
                  <PolarRadiusAxis tick={{ fill: "#9CA3AF", fontSize: 10 }} />
                  <Radar name="Current" dataKey="A" stroke="#14B8A6" fill="#14B8A6" fillOpacity={0.3} strokeWidth={2} />
                  <Radar
                    name="Potential"
                    dataKey="B"
                    stroke="#8B5CF6"
                    fill="transparent"
                    strokeWidth={1}
                    strokeDasharray="5 5"
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white">Score Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrend}>
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#14B8A6"
                    strokeWidth={3}
                    dot={{ fill: "#14B8A6", strokeWidth: 2, r: 4 }}
                    name="Total Score"
                  />
                  <Line
                    type="monotone"
                    dataKey="verified"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 3 }}
                    name="Verified Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white">Detailed Score Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scoreBreakdown.map((item, index) => (
              <div key={index} className="p-4 rounded-xl bg-gray-800/40 border border-gray-700/50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-medium">{item.category}</h3>
                  <span className="text-2xl font-bold" style={{ color: item.color }}>
                    {item.current}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Current</span>
                    <span className="text-gray-300">
                      {item.current}/{item.potential}
                    </span>
                  </div>
                  <Progress value={(item.current / item.potential) * 100} className="h-2 bg-gray-700" />
                  <div className="text-xs text-gray-400">+{item.potential - item.current} points available</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white">On-Chain Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ON_CHAIN_ACTIVITIES.map((activity, index) => {
              const Icon = activity.icon
              return (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-teal-400" />
                    <div>
                      <p className="text-white font-medium">{activity.activity}</p>
                      <p className="text-gray-400 text-sm">{activity.platform}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{activity.score}</span>
                    {activity.verified && <CheckCircle className="h-4 w-4 text-green-400" />}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white">Off-Chain Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {OFF_CHAIN_ACTIVITIES.map((activity, index) => {
              const Icon = activity.icon
              return (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className="text-white font-medium">{activity.activity}</p>
                      <p className="text-gray-400 text-sm">{activity.platform}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{activity.score}</span>
                    {activity.verified ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-400" />
                    )}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
