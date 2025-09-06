/* eslint-disable prettier/prettier */
"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { OFF_CHAIN_ACTIVITIES, ON_CHAIN_ACTIVITIES } from "@/lib/constants";
import { connectGitHub as connectGitHubAccount, getStoredGitHubData } from "@/services/github";
import { ReputationData, getStoredReputationData, updateUserReputation } from "@/services/reputation";
import {
  Activity,
  Award,
  CheckCircle,
  Clock,
  Copy,
  Download,
  ExternalLink,
  Eye,
  Github,
  QrCode,
  Share,
  Shield,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
  X,
} from "lucide-react";
import {
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { useAccount } from "wagmi";

export default function ReputationView() {
  const { address } = useAccount();
  const [reputationData, setReputationData] = useState<ReputationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCredentialPreview, setShowCredentialPreview] = useState(false);
  const [credentialType, setCredentialType] = useState<"preview" | "share" | "export">("preview");
  const [isConnectingGitHub, setIsConnectingGitHub] = useState(false);
  const [githubConnected, setGithubConnected] = useState(false);

  // Check if GitHub is already connected
  useEffect(() => {
    const githubData = getStoredGitHubData();
    setGithubConnected(!!githubData);
  }, []);

  // Load reputation data on component mount
  useEffect(() => {
    const loadReputationData = async () => {
      setIsLoading(true);

      let data = getStoredReputationData();

      // If no data exists or it's stale (older than 30 minutes), generate new data
      if (!data || Date.now() - data.lastUpdated > 1800000) {
        if (address) {
          console.log('Generating new reputation data for address:', address);
          data = await updateUserReputation(address);
        }
      } else {
        console.log('Using cached reputation data');
      }

      setReputationData(data);
      setIsLoading(false);
    };

    loadReputationData();
  }, [address]);

  const handleRefreshReputation = async () => {
    if (!address) return;

    setIsUpdating(true);
    try {
      console.log('Refreshing reputation data...');
      const data = await updateUserReputation(address);
      setReputationData(data);
      console.log('Reputation data updated successfully');
    } catch (error) {
      console.error("Failed to update reputation:", error);
      alert("Failed to update reputation. Please try again.");
    }
    setIsUpdating(false);
  };

  const connectGitHub = async () => {
    setIsConnectingGitHub(true);
    try {
      // Use the standalone function instead of the class method
      const githubUsername = prompt("Please enter your GitHub username");
      if (!githubUsername) {
        setIsConnectingGitHub(false);
        return;
      }
      
      console.log('Connecting to GitHub for user:', githubUsername);
      const result = await connectGitHubAccount(githubUsername);
      
      if (result.success) {
        setGithubConnected(true);
        alert(`Successfully connected to GitHub account: ${githubUsername}`);
        
        // Refresh reputation data after connecting GitHub
        if (address) {
          await handleRefreshReputation();
        }
      } else {
        alert(`Failed to connect GitHub: ${result.error}`);
      }
    } catch (error) {
      console.error("Failed to connect GitHub:", error);
      alert("Failed to connect to GitHub. Please check the username and try again.");
    }
    setIsConnectingGitHub(false);
  };

  // Convert reputation data to chart format
  const getScoreBreakdown = () => {
    if (!reputationData) return [];

    const components = reputationData.components;
    return [
      {
        category: "Wallet",
        current: components.walletScore,
        potential: 100,
        color: "#3B82F6",
        icon: Wallet,
      },
      {
        category: "GitHub",
        current: components.githubScore,
        potential: 100,
        color: "#14B8A6",
        icon: Github,
      },
      {
        category: "Social",
        current: components.socialScore,
        potential: 100,
        color: "#8B5CF6",
        icon: Users,
      },
      {
        category: "Identity",
        current: components.identityScore,
        potential: 100,
        color: "#10B981",
        icon: UserCheck,
      },
      {
        category: "Activity",
        current: components.activityScore,
        potential: 100,
        color: "#F59E0B",
        icon: Activity,
      },
      {
        category: "Security",
        current: components.securityScore,
        potential: 100,
        color: "#EF4444",
        icon: Shield,
      },
    ];
  };

  const getRadarData = () => {
    if (!reputationData) return [];

    const components = reputationData.components;
    return [
      { subject: "Wallet", A: components.walletScore, fullMark: 100 },
      { subject: "GitHub", A: components.githubScore, fullMark: 100 },
      { subject: "Social", A: components.socialScore, fullMark: 100 },
      { subject: "Identity", A: components.identityScore, fullMark: 100 },
      { subject: "Activity", A: components.activityScore, fullMark: 100 },
      { subject: "Security", A: components.securityScore, fullMark: 100 },
    ];
  };

  const monthlyTrend = [
    { month: "Jan", score: 720, verified: 680 },
    { month: "Feb", score: 745, verified: 710 },
    { month: "Mar", score: 768, verified: 735 },
    { month: "Apr", score: 782, verified: 750 },
    { month: "May", score: 795, verified: 765 },
    { month: "Jun", score: reputationData?.totalScore || 800, verified: reputationData?.totalScore || 780 },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!reputationData) {
    return (
      <div className="text-center py-12">
        <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Reputation Data</h3>
        <p className="text-gray-500 mb-4">Connect your wallet to generate your reputation score</p>
        {address && (
          <Button onClick={handleRefreshReputation} disabled={isUpdating}>
            {isUpdating ? "Generating..." : "Generate Reputation Score"}
          </Button>
        )}
      </div>
    );
  }

  const scoreBreakdown = getScoreBreakdown();
  const radarData = getRadarData();

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

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
                <div className="text-2xl font-bold text-teal-400">{reputationData.totalScore}</div>
                <div className="text-gray-400 text-sm">Total Score</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
                <div className="text-2xl font-bold text-purple-400">{reputationData.insights.percentile}%</div>
                <div className="text-gray-400 text-sm">Percentile</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
                <div className="text-2xl font-bold text-blue-400">{reputationData.insights.trustLevel}</div>
                <div className="text-gray-400 text-sm">Trust Level</div>
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
                    {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Wallet:</span>
                  <span className="text-white ml-2 font-mono">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
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
                    value={`https://omnirep.io/verify/${address}`}
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
                    Discord
                  </Button>
                </div>
              </div>
            )}

            {credentialType === "export" && (
              <div className="w-full space-y-3">
                <Button className="w-full bg-gray-700 hover:bg-gray-600">
                  <Download className="h-4 w-4 mr-2" />
                  Download as PDF
                </Button>
                <Button variant="outline" className="w-full border-gray-600 bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Download as PNG
                </Button>
                <Button variant="outline" className="w-full border-gray-600 bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Download as JSON
                </Button>
                <Button variant="outline" className="w-full border-gray-600 bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Export to IPFS
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

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
              setCredentialType("preview");
              setShowCredentialPreview(true);
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent hover:border-purple-500/50"
            onClick={() => {
              setCredentialType("share");
              setShowCredentialPreview(true);
            }}
          >
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button
            className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600"
            onClick={() => {
              setCredentialType("export");
              setShowCredentialPreview(true);
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
                  {reputationData.totalScore}
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span>Percentile: {reputationData.insights.percentile}th</span>
                </div>
                <Badge
                  variant="secondary"
                  className={`text-sm px-4 py-1 ${
                    reputationData.insights.trustLevel === "Excellent"
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : reputationData.insights.trustLevel === "High"
                        ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                        : reputationData.insights.trustLevel === "Medium"
                          ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                  }`}
                >
                  {reputationData.insights.trustLevel} Trust Level
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-6 text-left">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-3">Strengths</h4>
                  <div className="space-y-2">
                    {reputationData.insights.strengths.slice(0, 3).map((strength, index) => (
                      <div key={index} className="flex items-center gap-2 text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-3">Improvements</h4>
                  <div className="space-y-2">
                    {reputationData.insights.improvements.slice(0, 3).map((improvement, index) => (
                      <div key={index} className="flex items-center gap-2 text-yellow-400">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{improvement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center justify-between">
              Quick Actions
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefreshReputation}
                disabled={isUpdating}
                className="text-gray-400 hover:text-white"
              >
                {isUpdating ? (
                  <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full" />
                ) : (
                  "Refresh"
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* GitHub Connection Status */}
            {!githubConnected ? (
              <div className="p-4 border border-gray-600 rounded-lg bg-gray-800/30">
                <div className="flex items-center gap-3 mb-2">
                  <Github className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-white">Connect GitHub</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">Boost your reputation by connecting your GitHub profile</p>
                <Button 
                  size="sm" 
                  onClick={connectGitHub} 
                  disabled={isConnectingGitHub}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-50"
                >
                  {isConnectingGitHub ? 'Connecting...' : 'Connect GitHub'}
                </Button>
              </div>
            ) : (
              <div className="p-4 border border-green-600/30 rounded-lg bg-green-500/10">
                <div className="flex items-center gap-3 mb-2">
                  <Github className="h-5 w-5 text-green-400" />
                  <span className="text-sm font-medium text-white">GitHub Connected</span>
                  <CheckCircle className="h-4 w-4 text-green-400" />
                </div>
                <p className="text-xs text-gray-400">Contributing to your reputation score</p>
                <Button 
                  size="sm" 
                  onClick={handleRefreshReputation}
                  disabled={isUpdating}
                  className="w-full mt-2 bg-green-700 hover:bg-green-600 text-white"
                >
                  {isUpdating ? 'Updating...' : 'Refresh Data'}
                </Button>
              </div>
            )}

            {/* Next Milestones */}
            <div>
              <h4 className="text-sm font-medium text-white mb-3">Next Milestones</h4>
              <div className="space-y-2">
                {reputationData.insights.nextMilestones.slice(0, 3).map((milestone, index) => (
                  <div key={index} className="flex items-center gap-2 text-blue-400">
                    <Award className="h-4 w-4" />
                    <span className="text-xs">{milestone}</span>
                  </div>
                ))}
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
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#D1D5DB", fontSize: 12 }} />
                  <PolarRadiusAxis tick={{ fill: "#9CA3AF", fontSize: 10 }} />
                  <Radar name="Current" dataKey="A" stroke="#14B8A6" fill="#14B8A6" fillOpacity={0.3} strokeWidth={2} />
                  <Radar
                    name="Potential"
                    dataKey="fullMark"
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
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Line type="monotone" dataKey="score" stroke="#14B8A6" strokeWidth={2} />
                  <Line type="monotone" dataKey="verified" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="5 5" />
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
            {scoreBreakdown.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="p-4 rounded-xl bg-gray-800/40 border border-gray-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5" style={{ color: item.color }} />
                      <h3 className="text-white font-medium">{item.category}</h3>
                    </div>
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
              );
            })}
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
              const Icon = activity.icon;
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
              );
            })}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white">Off-Chain Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {OFF_CHAIN_ACTIVITIES.map((activity, index) => {
              const Icon = activity.icon;
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
                    {activity.verified && <CheckCircle className="h-4 w-4 text-green-400" />}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
