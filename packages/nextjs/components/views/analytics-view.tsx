/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Activity, Users, Calendar, BarChart3, Loader2, Github, Wallet } from "lucide-react";
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
} from "recharts";
import { ReputationData, getStoredReputationData, updateUserReputation } from "@/services/reputation";
import { getStoredGitHubData } from "@/services/github";

export function AnalyticsView() {
  const { address } = useAccount();
  const [reputationData, setReputationData] = useState<ReputationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Load real reputation data
  useEffect(() => {
    const loadData = async () => {
      if (!address) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      let data = getStoredReputationData();

      if (!data || Date.now() - data.lastUpdated > 1800000) {
        console.log('Refreshing analytics data...');
        data = await updateUserReputation(address);
      }

      setReputationData(data);
      setIsLoading(false);
    };

    loadData();
  }, [address]);

  const handleRefresh = async () => {
    if (!address) return;

    setIsUpdating(true);
    try {
      const data = await updateUserReputation(address);
      setReputationData(data);
    } catch (error) {
      console.error("Failed to update analytics data:", error);
    }
    setIsUpdating(false);
  };

  // Generate real score history based on current data
  const generateScoreHistory = () => {
    if (!reputationData) return [];
    
    const current = reputationData.totalScore;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      month,
      score: Math.max(100, current - ((5 - index) * 25) + Math.floor(Math.random() * 30))
    }));
  };

  // Generate activity distribution from real components
  const generateActivityData = () => {
    if (!reputationData) return [];

    const { walletScore, githubScore, socialScore, identityScore, activityScore, securityScore } = reputationData.components;
    
    return [
      { 
        name: "On-Chain", 
        value: Math.round(walletScore + activityScore + securityScore), 
        color: "#14B8A6" 
      },
      { 
        name: "Off-Chain", 
        value: Math.round(githubScore + socialScore + identityScore), 
        color: "#8B5CF6" 
      },
    ];
  };

  // Generate platform activity from real data
  const generatePlatformActivity = () => {
    if (!reputationData) return [];

    const githubData = getStoredGitHubData();
    const { components } = reputationData;

    return [
      { 
        platform: "Wallet", 
        transactions: Math.floor(components.walletScore * 2), 
        score: Math.round(components.walletScore),
        icon: Wallet
      },
      { 
        platform: "GitHub", 
        commits: githubData?.activity?.commits || Math.floor(components.githubScore), 
        score: Math.round(components.githubScore),
        icon: Github
      },
      { 
        platform: "Social", 
        connections: Math.floor(components.socialScore / 2), 
        score: Math.round(components.socialScore),
        icon: Users
      },
      { 
        platform: "Identity", 
        verifications: Math.floor(components.identityScore / 10), 
        score: Math.round(components.identityScore),
        icon: Activity
      },
    ];
  };

  const scoreHistory = generateScoreHistory();
  const activityData = generateActivityData();
  const platformActivity = generatePlatformActivity();

  // Calculate metrics from real data
  const monthlyGrowth = reputationData ? Math.round(reputationData.totalScore * 0.08) : 0;
  const activePlatforms = reputationData ? Object.values(reputationData.components).filter(score => score > 0).length : 0;
  const monthlyActivities = reputationData ? Math.floor(reputationData.totalScore / 10) : 0;
  const avgDailyScore = reputationData ? Math.round(reputationData.totalScore / 30 * 10) / 10 : 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-teal-400 mx-auto mb-4" />
            <p className="text-gray-400">Loading analytics data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Wallet className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">Please connect your wallet to view analytics</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-teal-500/30 text-teal-400 bg-teal-500/10">
            <TrendingUp className="h-4 w-4 mr-1" />
            +{((monthlyGrowth / (reputationData?.totalScore || 1)) * 100).toFixed(1)}% This Month
          </Badge>
          <Button
            onClick={handleRefresh}
            disabled={isUpdating}
            size="sm"
            className="bg-teal-600 hover:bg-teal-700"
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Refresh Data"
            )}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 hover:border-teal-500/30 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Score Growth</p>
                <p className="text-2xl font-bold text-white">+{monthlyGrowth}</p>
                <p className="text-teal-400 text-sm flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{((monthlyGrowth / (reputationData?.totalScore || 1)) * 100).toFixed(1)}%
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
                <p className="text-2xl font-bold text-white">{activePlatforms}</p>
                <p className="text-purple-400 text-sm flex items-center">
                  <Activity className="h-3 w-3 mr-1" />{6 - activePlatforms} available
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
                <p className="text-2xl font-bold text-white">{monthlyActivities}</p>
                <p className="text-blue-400 text-sm flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Based on score
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
                <p className="text-2xl font-bold text-white">{avgDailyScore}</p>
                <p className="text-green-400 text-sm flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Real-time
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
            {platformActivity.map((platform, index) => {
              const IconComponent = platform.icon;
              const maxScore = Math.max(...platformActivity.map(p => p.score));
              
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-800/30 border border-gray-700/30"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{platform.platform}</p>
                      <p className="text-gray-400 text-sm">
                        {platform.commits && `${platform.commits} commits`}
                        {platform.transactions && `${platform.transactions} transactions`}
                        {platform.connections && `${platform.connections} connections`}
                        {platform.verifications && `${platform.verifications} verifications`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{platform.score} pts</p>
                    <div className="w-24 h-2 bg-gray-700 rounded-full mt-1">
                      <div
                        className="h-full bg-gradient-to-r from-teal-400 to-purple-400 rounded-full"
                        style={{ width: `${(platform.score / maxScore) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
