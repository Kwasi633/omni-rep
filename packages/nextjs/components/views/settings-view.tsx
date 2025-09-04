import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Shield, Download, Trash2, Key, Smartphone, Globe, Eye, Bell } from "lucide-react"

const profileData = {
  name: "Alex Chen",
  username: "alexchen.eth",
  email: "alex@example.com",
  avatar: "/professional-avatar.png",
}

const privacySettings = [
  { name: "Public Profile", description: "Make your reputation score publicly visible", enabled: false },
  { name: "Activity Tracking", description: "Allow platforms to track your activities", enabled: true },
  { name: "Data Analytics", description: "Share anonymized data for platform improvements", enabled: true },
  { name: "Marketing Communications", description: "Receive updates about new features and grants", enabled: false },
]

const securitySettings = [
  { name: "Two-Factor Authentication", description: "Secure your account with 2FA", enabled: true, icon: Smartphone },
  { name: "Session Monitoring", description: "Monitor active sessions and devices", enabled: true, icon: Globe },
  { name: "Login Notifications", description: "Get notified of new login attempts", enabled: true, icon: Bell },
  { name: "API Access", description: "Allow third-party applications to access your data", enabled: false, icon: Key },
]

const dataExportOptions = [
  { name: "Reputation Data", description: "Export your complete reputation history", format: "JSON" },
  { name: "Activity Logs", description: "Export all tracked activities and scores", format: "CSV" },
  { name: "Platform Connections", description: "Export connected platform information", format: "JSON" },
  { name: "Grant Applications", description: "Export your grant application history", format: "PDF" },
]

export function SettingsView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <Badge variant="outline" className="border-teal-500/30 text-teal-400 bg-teal-500/10">
          Profile Complete
        </Badge>
      </div>

      {/* Profile Settings */}
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="h-5 w-5 text-teal-400" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profileData.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-gradient-to-br from-teal-500 to-purple-500 text-white text-xl">
                {profileData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent">
                Change Avatar
              </Button>
              <p className="text-gray-400 text-sm">JPG, PNG or GIF. Max size 2MB.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">
                Full Name
              </Label>
              <Input id="name" defaultValue={profileData.name} className="bg-gray-800/50 border-gray-600 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300">
                Username
              </Label>
              <Input
                id="username"
                defaultValue={profileData.username}
                className="bg-gray-800/50 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                defaultValue={profileData.email}
                className="bg-gray-800/50 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="theme" className="text-gray-300">
                Theme Preference
              </Label>
              <select className="w-full p-2 bg-gray-800/50 border border-gray-600 rounded-md text-white">
                <option>Dark (Current)</option>
                <option>Light</option>
                <option>Auto</option>
              </select>
            </div>
          </div>

          <Button className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white">
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Eye className="h-5 w-5 text-purple-400" />
            Privacy Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {privacySettings.map((setting, index) => (
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

      {/* Security Settings */}
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-teal-400" />
            Security & Authentication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securitySettings.map((setting, index) => {
              const Icon = setting.icon
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-800/30 border border-gray-700/30"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-teal-400" />
                    <div>
                      <p className="text-white font-medium">{setting.name}</p>
                      <p className="text-gray-400 text-sm">{setting.description}</p>
                    </div>
                  </div>
                  <Switch checked={setting.enabled} />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Download className="h-5 w-5 text-blue-400" />
            Data Export & Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dataExportOptions.map((option, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-800/30 border border-gray-700/30"
              >
                <div>
                  <p className="text-white font-medium">{option.name}</p>
                  <p className="text-gray-400 text-sm">{option.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-gray-600 text-gray-300">
                    {option.format}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
            <div className="flex items-center gap-3 mb-2">
              <Trash2 className="h-5 w-5 text-red-400" />
              <p className="text-red-400 font-medium">Danger Zone</p>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
