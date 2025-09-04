import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Activity, Users, Calendar, BarChart3 } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const scoreHistory = [
  { month: "Jan", score: 720 },
  { month: "Feb", score: 735 },
  { month: "Mar", score: 742 },
  { month: "Apr", score: 758 },
  { month: "May", score: 771 },
  { month: "Jun", score: 785 },
]

const activityData = [
  { name: "On-Chain", value: 65, color: "#14B8A6" },
  { name: "Off-Chain", value: 35, color: "#8B5CF6" },
]

const platformActivity = [
  { platform: "GitHub", commits: 45, score: 120 },
  { platform: "DAO Votes", votes: 12, score: 95 },
  { platform: "DeFi", transactions: 28, score: 85 },
  { platform: "LinkedIn", endorsements: 8, score: 60 },
]

export function AnalyticsView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
        <Badge variant="outline" className="border-teal-500/30 text-teal-400 bg-teal-500/10">
          <TrendingUp className="h-4 w-4 mr-1" />
          +8.2% This Month
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 hover:border-teal-500/30 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Score Growth</p>
                <p className="text-2xl font-bold text-white">+65</p>
                <p className="text-teal-400 text-sm flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8.2%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-teal-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 hover:border-purple-500/30 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Platforms</p>
                <p className="text-2xl font-bold text-white">12</p>
                <p className="text-purple-400 text-sm flex items-center">
                  <Activity className="h-3 w-3 mr-1" />3 new
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 hover:border-blue-500/30 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Monthly Activities</p>
                <p className="text-2xl font-bold text-white">93</p>
                <p className="text-blue-400 text-sm flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15%
                </p>
              </div>
              <Activity className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 hover:border-green-500/30 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg. Daily Score</p>
                <p className="text-2xl font-bold text-white">26.1</p>
                <p className="text-green-400 text-sm flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +2.4
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white">Score History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" tick={{ fill: "#9CA3AF" }} />
                  <YAxis tick={{ fill: "#9CA3AF" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#14B8A6" strokeWidth={3} dot={{ fill: "#14B8A6" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white">Activity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activityData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {activityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Performance */}
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white">Platform Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {platformActivity.map((platform, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-800/30 border border-gray-700/30"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                    <Activity className="h-6 w-6 text-teal-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{platform.platform}</p>
                    <p className="text-gray-400 text-sm">
                      {platform.commits && `${platform.commits} commits`}
                      {platform.votes && `${platform.votes} votes`}
                      {platform.transactions && `${platform.transactions} transactions`}
                      {platform.endorsements && `${platform.endorsements} endorsements`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{platform.score} pts</p>
                  <div className="w-24 h-2 bg-gray-700 rounded-full mt-1">
                    <div
                      className="h-full bg-gradient-to-r from-teal-400 to-purple-400 rounded-full"
                      style={{ width: `${(platform.score / 120) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
