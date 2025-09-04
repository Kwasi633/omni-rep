import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, CheckCircle, Clock, Github, Linkedin, Twitter, Shield, Smartphone } from "lucide-react"

const connectedPlatforms = [
  { name: "GitHub", icon: Github, status: "verified", score: 120, lastSync: "2 hours ago", color: "teal" },
  { name: "LinkedIn", icon: Linkedin, status: "verified", score: 85, lastSync: "1 day ago", color: "blue" },
  { name: "Twitter", icon: Twitter, status: "pending", score: 0, lastSync: "Never", color: "gray" },
  { name: "Discord", icon: Smartphone, status: "verified", score: 65, lastSync: "3 hours ago", color: "purple" },
]

const availablePlatforms = [
  { name: "Stack Overflow", icon: Shield, description: "Technical reputation from Q&A contributions" },
  { name: "Medium", icon: Shield, description: "Content creation and thought leadership" },
  { name: "Dribbble", icon: Shield, description: "Design portfolio and community engagement" },
  { name: "Behance", icon: Shield, description: "Creative work showcase and peer reviews" },
]

const securitySettings = [
  { name: "Two-Factor Authentication", description: "Secure your account with 2FA", enabled: true },
  { name: "Privacy Mode", description: "Hide sensitive reputation data", enabled: false },
  { name: "Auto-sync Data", description: "Automatically update platform data", enabled: true },
  { name: "Public Profile", description: "Make your reputation publicly viewable", enabled: false },
]

export function ConnectionsView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Platform Connections</h1>
        <Button className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Platform
        </Button>
      </div>

      {/* Connected Platforms */}
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white">Connected Platforms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connectedPlatforms.map((platform, index) => {
              const Icon = platform.icon
              return (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-gray-800/30 border border-gray-700/30 hover:border-teal-500/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 bg-gradient-to-br from-${platform.color}-500/20 to-${platform.color}-600/20 rounded-lg flex items-center justify-center`}
                      >
                        <Icon className={`h-5 w-5 text-${platform.color}-400`} />
                      </div>
                      <div>
                        <p className="text-white font-medium">{platform.name}</p>
                        <p className="text-gray-400 text-sm">Last sync: {platform.lastSync}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {platform.status === "verified" && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {platform.status === "pending" && (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Reputation Score</span>
                    <span className="text-white font-bold">{platform.score} pts</span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full mt-2">
                    <div
                      className={`h-full bg-gradient-to-r from-${platform.color}-400 to-${platform.color}-500 rounded-full`}
                      style={{ width: `${(platform.score / 120) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Available Platforms */}
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white">Available Platforms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availablePlatforms.map((platform, index) => {
              const Icon = platform.icon
              return (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-gray-800/30 border border-gray-700/30 hover:border-purple-500/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-600/20 to-gray-700/20 rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{platform.name}</p>
                        <p className="text-gray-400 text-sm">{platform.description}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                    >
                      Connect
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-teal-400" />
            Security & Privacy Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securitySettings.map((setting, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-800/30 border border-gray-700/30"
              >
                <div>
                  <p className="text-white font-medium">{setting.name}</p>
                  <p className="text-gray-400 text-sm">{setting.description}</p>
                </div>
                <Switch checked={setting.enabled} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
