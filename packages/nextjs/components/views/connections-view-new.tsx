/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  IconPlus, 
  IconCheckCircle, 
  IconClock, 
  IconGithub, 
  IconLinkedin, 
  IconTwitter, 
  IconShield, 
  IconSmartphone, 
  IconAlertCircle,
  IconWrapper
} from "@/components/ui/icon-wrapper"
import { connectGitHub, getStoredGitHubData, isGitHubConnected } from "@/services/github"
import { updateUserReputation } from "@/services/reputation"
import { useAccount } from "wagmi"

// Define the platform types
type PlatformStatus = "verified" | "pending" | "not-connected";
interface ConnectedPlatform {
  name: string;
  icon: any;
  status: PlatformStatus;
  score: number;
  lastSync: string;
  color: string;
}

// Default platforms list
const defaultConnectedPlatforms: ConnectedPlatform[] = [
  { name: "GitHub", icon: IconGithub, status: "not-connected", score: 0, lastSync: "Never", color: "teal" },
  { name: "LinkedIn", icon: IconLinkedin, status: "not-connected", score: 0, lastSync: "Never", color: "blue" },
  { name: "Twitter", icon: IconTwitter, status: "not-connected", score: 0, lastSync: "Never", color: "gray" },
  { name: "Discord", icon: IconSmartphone, status: "not-connected", score: 0, lastSync: "Never", color: "purple" },
]

// Available platforms to add in the future
const availablePlatforms = [
  { name: "Stack Overflow", icon: IconShield, description: "Technical reputation from Q&A contributions" },
  { name: "Medium", icon: IconShield, description: "Content creation and thought leadership" },
  { name: "Dribbble", icon: IconShield, description: "Design portfolio and community engagement" },
  { name: "Behance", icon: IconShield, description: "Creative work showcase and peer reviews" },
]

// Security settings with toggle controls
const securitySettings = [
  { name: "Two-Factor Authentication", description: "Secure your account with 2FA", enabled: true },
  { name: "Privacy Mode", description: "Hide sensitive reputation data", enabled: false },
  { name: "Auto-sync Data", description: "Automatically update platform data", enabled: true },
  { name: "Public Profile", description: "Make your reputation publicly viewable", enabled: false },
]

export function ConnectionsView() {
  const { address } = useAccount();
  const [connectedPlatforms, setConnectedPlatforms] = useState<ConnectedPlatform[]>(defaultConnectedPlatforms);
  const [isConnectingGithub, setIsConnectingGithub] = useState(false);
  const [githubError, setGithubError] = useState<string | null>(null);

  // Load connected platforms data
  const loadConnectedPlatforms = useCallback(() => {
    // Update GitHub status if connected
    const githubData = getStoredGitHubData();
    
    if (githubData && isGitHubConnected()) {
      // Deep clone the platforms array
      const updatedPlatforms = JSON.parse(JSON.stringify(defaultConnectedPlatforms));
      
      // Find GitHub platform and update it
      const githubPlatform = updatedPlatforms.find((p: ConnectedPlatform) => p.name === "GitHub");
      if (githubPlatform) {
        githubPlatform.status = "verified";
        githubPlatform.score = Math.round(githubData.activity.commits + githubData.activity.contributions * 0.5);
        githubPlatform.lastSync = new Date(githubData.lastUpdated).toLocaleString();
      }
      
      setConnectedPlatforms(updatedPlatforms);
    }
  }, []);

  // Check for connected platforms on component mount
  useEffect(() => {
    loadConnectedPlatforms();
  }, [loadConnectedPlatforms]);

  // Handle GitHub connection
  const handleConnectGitHub = async () => {
    setIsConnectingGithub(true);
    setGithubError(null);
    
    try {
      // Get username input with better validation
      const githubUsername = prompt("Enter your GitHub username:")?.trim();
      if (!githubUsername) {
        setIsConnectingGithub(false);
        return;
      }

      // Validate username format (basic check)
      if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(githubUsername)) {
        setGithubError("Invalid GitHub username format");
        setIsConnectingGithub(false);
        return;
      }

      // Connect to GitHub
      const result = await connectGitHub(githubUsername);
      
      if (result.success) {
        // Update platform status
        loadConnectedPlatforms();
        
        // Update user reputation with GitHub data
        if (address) {
          await updateUserReputation(address);
        }
        
        // Clear any previous errors
        setGithubError(null);
      } else {
        setGithubError(result.error || "Failed to connect to GitHub");
      }
    } catch (error) {
      console.error("GitHub connection error:", error);
      setGithubError(error instanceof Error ? error.message : "Connection failed");
    }
    
    setIsConnectingGithub(false);
  };

  // Handle GitHub disconnection
  const handleDisconnectGitHub = () => {
    if (confirm("Are you sure you want to disconnect your GitHub account?")) {
      // Clear stored data
      localStorage.removeItem('omniRep_github_data');
      
      // Reset platform status
      const updatedPlatforms = JSON.parse(JSON.stringify(defaultConnectedPlatforms));
      const githubPlatform = updatedPlatforms.find((p: ConnectedPlatform) => p.name === "GitHub");
      if (githubPlatform) {
        githubPlatform.status = "not-connected";
        githubPlatform.score = 0;
        githubPlatform.lastSync = "Never";
      }
      
      setConnectedPlatforms(updatedPlatforms);
      setGithubError(null);
    }
  };

  // Get connection button based on platform status
  const getConnectionButton = (platform: ConnectedPlatform) => {
    if (platform.name === "GitHub") {
      if (platform.status === "verified") {
        return (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-teal-600/30 text-teal-400 bg-teal-500/10 hover:bg-teal-500/20"
              onClick={loadConnectedPlatforms}
            >
              <IconCheckCircle className="h-3 w-3 mr-1" /> Connected
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-red-600/30 text-red-400 hover:bg-red-500/20"
              onClick={handleDisconnectGitHub}
            >
              Disconnect
            </Button>
          </div>
        );
      } else {
        return (
          <Button
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
            onClick={handleConnectGitHub}
            disabled={isConnectingGithub}
          >
            {isConnectingGithub ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-300 mr-2"></div>
                Connecting...
              </>
            ) : (
              "Connect"
            )}
          </Button>
        );
      }
    } else {
      return (
        <Button
          variant="outline"
          size="sm"
          className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
          disabled={true}
        >
          Coming Soon
        </Button>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Platform Connections</h1>
        <Button className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white">
          <IconPlus className="h-4 w-4 mr-2" />
          Add Platform
        </Button>
      </div>

      {/* Connection Error Display */}
      {githubError && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconAlertCircle className="h-5 w-5" />
            <span>{githubError}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={() => setGithubError(null)}
          >
            ✕
          </Button>
        </div>
      )}

      {/* Connected Platforms */}
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white">Platform Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connectedPlatforms.map((platform, index) => {
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg bg-gray-800/30 border ${
                    platform.status === "verified" 
                      ? `border-${platform.color}-500/30 hover:border-${platform.color}-500/50` 
                      : "border-gray-700/30 hover:border-gray-600/50"
                  } transition-all duration-300`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 bg-gradient-to-br from-${
                          platform.status === "verified" ? platform.color : "gray"
                        }-500/20 to-${
                          platform.status === "verified" ? platform.color : "gray"
                        }-600/20 rounded-lg flex items-center justify-center`}
                      >
                        <IconWrapper 
                          icon={platform.icon} 
                          className={`h-5 w-5 text-${platform.status === "verified" ? platform.color : "gray"}-400`} 
                        />
                      </div>
                      <div>
                        <p className="text-white font-medium">{platform.name}</p>
                        <p className="text-gray-400 text-sm">Last sync: {platform.lastSync}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {platform.status === "verified" && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          <IconCheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {platform.status === "pending" && (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                          <IconClock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                      {getConnectionButton(platform)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Reputation Score</span>
                    <span className="text-white font-bold">{platform.score} pts</span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full mt-2">
                    <div
                      className={`h-full bg-gradient-to-r from-${platform.status === "verified" ? platform.color : "gray"}-400 to-${platform.status === "verified" ? platform.color : "gray"}-500 rounded-full`}
                      style={{ width: `${platform.score > 0 ? (platform.score / 120) * 100 : 0}%` }}
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
              return (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-gray-800/30 border border-gray-700/30 hover:border-purple-500/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-600/20 to-gray-700/20 rounded-lg flex items-center justify-center">
                        <IconWrapper icon={platform.icon} className="h-5 w-5 text-gray-400" />
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
            <IconShield className="h-5 w-5 text-teal-400" />
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
                <Switch checked={setting.enabled} onCheckedChange={() => {}} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
