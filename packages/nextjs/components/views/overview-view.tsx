import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Star,
  Link,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  ArrowRight,
  Zap,
  Shield,
  Target,
  Award,
  Users,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from "recharts"
import { CURRENT_SCORE, CONNECTED_PLATFORMS, AVAILABLE_GRANTS, MONTHLY_GROWTH } from "@/lib/constants"

const scoreHistory = [
  { month: "Jan", score: 720 },
  { month: "Feb", score: 745 },
  { month: "Mar", score: 768 },
  { month: "Apr", score: 785 },
  { month: "May", score: 812 },
  { month: "Jun", score: 847 },
]

const weeklyActivity = [
  { day: "Mon", activity: 12 },
  { day: "Tue", activity: 19 },
  { day: "Wed", activity: 8 },
  { day: "Thu", activity: 25 },
  { day: "Fri", activity: 22 },
  { day: "Sat", activity: 15 },
  { day: "Sun", activity: 9 },
]

export function OverviewView() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-gray-400 mt-2">Track your reputation growth and opportunities</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-teal-500/30 text-teal-400 bg-teal-500/10 px-4 py-2">
            <Star className="h-4 w-4 mr-2" />
            Score: {CURRENT_SCORE}
          </Badge>
          <Button className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600">
            <Zap className="h-4 w-4 mr-2" />
            Boost Score
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/50 hover:border-teal-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/20 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm">Reputation Score</p>
                <p className="text-3xl font-bold text-white">{CURRENT_SCORE}</p>
                <p className="text-teal-400 text-sm font-medium">+{MONTHLY_GROWTH} this month</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Star className="h-7 w-7 text-white" />
              </div>
            </div>
            <Progress value={85} className="h-2 bg-gray-700" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/50 hover:border-purple-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm">Connected Platforms</p>
                <p className="text-3xl font-bold text-white">{CONNECTED_PLATFORMS}</p>
                <p className="text-purple-400 text-sm font-medium">2 pending verification</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Link className="h-7 w-7 text-white" />
              </div>
            </div>
            <Progress value={67} className="h-2 bg-gray-700" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/50 hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm">Available Grants</p>
                <p className="text-3xl font-bold text-white">{AVAILABLE_GRANTS}</p>
                <p className="text-blue-400 text-sm font-medium">$2.4M total value</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign className="h-7 w-7 text-white" />
              </div>
            </div>
            <Progress value={43} className="h-2 bg-gray-700" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/50 hover:border-green-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm">Monthly Growth</p>
                <p className="text-3xl font-bold text-white">{MONTHLY_GROWTH}</p>
                <p className="text-green-400 text-sm font-medium">Above average</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
            </div>
            <Progress value={78} className="h-2 bg-gray-700" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-teal-400" />
              Score History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreHistory}>
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#14B8A6"
                    strokeWidth={3}
                    dot={{ fill: "#14B8A6", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-400" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyActivity}>
                  <XAxis dataKey="day" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Area type="monotone" dataKey="activity" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-teal-400" />
              Priority Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-teal-500/10 to-teal-600/10 border border-teal-500/20 hover:border-teal-500/40 transition-colors cursor-pointer group">
              <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-teal-400" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Connect GitHub Account</p>
                <p className="text-gray-400 text-sm">Boost technical reputation by +45 points</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30">High Impact</Badge>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-teal-400 transition-colors" />
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/20 hover:border-purple-500/40 transition-colors cursor-pointer group">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Complete DAO Governance</p>
                <p className="text-gray-400 text-sm">Participate in 2 more votes (+25 points)</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Medium</Badge>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 hover:border-blue-500/40 transition-colors cursor-pointer group">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Identity Verification</p>
                <p className="text-gray-400 text-sm">Increase trust score (+30 points)</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">High Trust</Badge>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-400" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Award className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">DeFi Pioneer</p>
                <p className="text-gray-400 text-sm">Completed 50+ DeFi transactions</p>
              </div>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">+15 pts</Badge>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Community Builder</p>
                <p className="text-gray-400 text-sm">Active in 5+ communities</p>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">+20 pts</Badge>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-teal-500/10 to-teal-600/10 border border-teal-500/20">
              <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-teal-400" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Security Expert</p>
                <p className="text-gray-400 text-sm">Zero security incidents</p>
              </div>
              <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30">+10 pts</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
