"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCredential } from "@/hooks/useCredential";
import { useIdentity } from "@/hooks/useIdentity";
import { AVAILABLE_GRANTS, CONNECTED_PLATFORMS, CURRENT_SCORE, MONTHLY_GROWTH } from "@/lib/constants";
import { generateMockReputationData, hashReputationScore } from "@/utils/hashScore";
import {
  AlertCircle,
  ArrowRight,
  Award,
  CheckCircle,
  Clock,
  Copy,
  DollarSign,
  ExternalLink,
  FileText,
  Key,
  Link,
  Shield,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { Area, AreaChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const scoreHistory = [
  { month: "Jan", score: 720 },
  { month: "Feb", score: 745 },
  { month: "Mar", score: 768 },
  { month: "Apr", score: 785 },
  { month: "May", score: 812 },
  { month: "Jun", score: 847 },
];

const weeklyActivity = [
  { day: "Mon", activity: 12 },
  { day: "Tue", activity: 19 },
  { day: "Wed", activity: 8 },
  { day: "Thu", activity: 25 },
  { day: "Fri", activity: 22 },
  { day: "Sat", activity: 15 },
  { day: "Sun", activity: 9 },
];

export function OverviewView() {
  const {
    did,
    didDocument,
    isCreating: isCreatingDID,
    error: didError,
    isLoaded,
    createDID,
    isDIDCreated,
  } = useIdentity();

  const {
    isCreating: isCreatingCredential,
    isUploading,
    error: credentialError,
    lastCredential,
    lastCID,
    createAndUploadCredential,
    getIPFSUrl,
  } = useCredential();

  const [copiedDID, setCopiedDID] = useState(false);
  const [copiedCID, setCopiedCID] = useState(false);

  const handleCreateDID = async () => {
    console.log("🆔 Creating DID from dashboard...");
    await createDID();
  };

  const handleIssueCredential = async () => {
    if (!did) {
      console.error("❌ Cannot issue credential: No DID available");
      return;
    }

    console.log("📜 Issuing credential from dashboard...");

    try {
      // Generate mock reputation data for demo
      const reputationData = generateMockReputationData(CURRENT_SCORE);
      const hashedScore = hashReputationScore(reputationData);

      // Create and upload credential
      await createAndUploadCredential(did, hashedScore, {
        reputationData,
        platform: "omni-rep",
        demoMode: true,
      });
    } catch (error) {
      console.error("❌ Error issuing credential:", error);
    }
  };

  const copyToClipboard = async (text: string, type: "did" | "cid") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "did") {
        setCopiedDID(true);
        setTimeout(() => setCopiedDID(false), 2000);
      } else {
        setCopiedCID(true);
        setTimeout(() => setCopiedCID(false), 2000);
      }
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-gray-400 mt-2">Track your reputation growth and manage your decentralized identity</p>
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

      {/* DID & Credential Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-blue-800/40 to-blue-900/40 border-blue-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Key className="h-5 w-5 text-blue-400" />
              Decentralized Identity (DID)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isLoaded ? (
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="h-4 w-4 animate-spin" />
                Loading identity status...
              </div>
            ) : isDIDCreated() ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-green-400 font-medium">DID Created Successfully</span>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-gray-400 text-sm mb-1">Your DID:</p>
                  <div className="flex items-center gap-2">
                    <code className="text-blue-400 text-sm font-mono bg-gray-900/50 px-2 py-1 rounded flex-1 truncate">
                      {did}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(did!, "did")}
                      className="text-gray-400 hover:text-white"
                    >
                      {copiedDID ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                {didDocument && (
                  <div className="text-sm text-gray-400">
                    <p>Created: {new Date(didDocument.created).toLocaleDateString()}</p>
                    <p>Controller: {didDocument.controller}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  <span className="text-yellow-400 font-medium">DID Not Created</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Create a decentralized identity to issue verifiable credentials for your reputation.
                </p>
                <Button
                  onClick={handleCreateDID}
                  disabled={isCreatingDID}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 w-full"
                >
                  {isCreatingDID ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Creating DID...
                    </>
                  ) : (
                    <>
                      <Key className="h-4 w-4 mr-2" />
                      Create DID
                    </>
                  )}
                </Button>
              </div>
            )}
            {didError && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-400 text-sm">{didError}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-800/40 to-purple-900/40 border-purple-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-400" />
              Verifiable Credentials
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {lastCredential && lastCID ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-green-400 font-medium">Credential Issued</span>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-gray-400 text-sm mb-1">IPFS CID:</p>
                  <div className="flex items-center gap-2">
                    <code className="text-purple-400 text-sm font-mono bg-gray-900/50 px-2 py-1 rounded flex-1 truncate">
                      {lastCID}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(lastCID!, "cid")}
                      className="text-gray-400 hover:text-white"
                    >
                      {copiedCID ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(getIPFSUrl(lastCID!), "_blank")}
                    className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on IPFS
                  </Button>
                </div>
                <div className="text-sm text-gray-400">
                  <p>Score: {CURRENT_SCORE} (hashed)</p>
                  <p>Issued: {new Date(lastCredential.issuanceDate).toLocaleDateString()}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  <span className="text-yellow-400 font-medium">No Credentials Issued</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Issue a verifiable credential containing your hashed reputation score to IPFS.
                </p>
                <Button
                  onClick={handleIssueCredential}
                  disabled={!isDIDCreated() || isCreatingCredential || isUploading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 w-full"
                >
                  {isCreatingCredential || isUploading ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      {isCreatingCredential ? "Creating..." : "Uploading..."}
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Issue Credential
                    </>
                  )}
                </Button>
              </div>
            )}
            {!isDIDCreated() && (
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-yellow-400 text-sm">⚠️ Create a DID first to issue credentials</p>
              </div>
            )}
            {credentialError && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-400 text-sm">{credentialError}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Existing Overview Content */}
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
  );
}
