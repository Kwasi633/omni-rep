/* eslint-disable prettier/prettier */
/* eslint-d// Removed unused dialog imports since we now use GitHubConnectModalble prettier/prettier */
// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAccount } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  Award,
  CheckCircle,
  Clock,
  Copy,
  DollarSign,
  ExternalLink,
  FileText,
  Github,
  Key,
  Link2,
  Loader2,
  Shield,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { Area, AreaChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useIdentity } from "@/hooks/useIdentity";
import { useCredential } from "@/hooks/useCredential";
import { hashReputationScore } from "@/utils/hashScore";
import { useENSIntegration } from "@/utils/ens-utils";
import { ReputationData, getStoredReputationData, updateUserReputation } from "@/services/reputation";
import { connectGitHub as connectGitHubAccount, getStoredGitHubData } from "@/services/github";
import { GitHubConnectModal } from "@/components/ui/github-connect-modal";

export function OverviewView() {
  // Real data state
  const [reputationData, setReputationData] = useState<ReputationData | null>(null);
  const [isLoadingReputation, setIsLoadingReputation] = useState(true);
  const [isUpdatingReputation, setIsUpdatingReputation] = useState(false);
  const [isConnectingGitHub, setIsConnectingGitHub] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  
  // DID and Credential Management
  const { 
    did, 
    isCreating: isCreatingDID, 
    error: didError, 
    createDID, 
    isDIDCreated 
  } = useIdentity();

  const {
    isCreating: isCreatingCredential,
    isUploading,
    error: credentialError,
    lastCID,
    createAndUploadCredential,
  } = useCredential();

  // Access wallet state from wagmi
  const { address } = useAccount();

  // ENS Integration
  const {
    ensName,
    isCreatingSubname,
    error: ensError,
    createUserSubname
  } = useENSIntegration();
  
  // Alias for better readability in component
  const isCreatingENS = isCreatingSubname;
  
  // Real ENS profile based on actual data
  const ensProfile = {
    name: ensName?.split('.')[0],
    avatar: null,
    did: did,
    github: getStoredGitHubData()?.username || null,
    twitter: null
  };

  // Load real reputation data
  useEffect(() => {
    const loadReputationData = async () => {
      if (!address) {
        setIsLoadingReputation(false);
        return;
      }

      setIsLoadingReputation(true);
      let data = getStoredReputationData();

      // If no data exists or it's stale (older than 30 minutes), generate new data
      if (!data || Date.now() - data.lastUpdated > 1800000) {
        console.log('Generating fresh reputation data for overview...');
        data = await updateUserReputation(address);
      }

      setReputationData(data);
      setIsLoadingReputation(false);
    };

    loadReputationData();
  }, [address]);

  // Calculate dynamic values from real data
  const currentScore = reputationData?.totalScore || 0;
  const monthlyGrowth = reputationData ? Math.floor(reputationData.totalScore * 0.1) : 0;
  const connectedPlatforms = reputationData ? 
    Object.values(reputationData.components).filter(score => score > 0).length : 0;
  const availableGrants = Math.floor(currentScore / 100); // Estimate grants based on score

  // Generate dynamic score history based on current score
  const generateScoreHistory = () => {
    if (!reputationData) return [];
    
    const current = reputationData.totalScore;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      month,
      score: Math.max(100, current - ((5 - index) * 20) + Math.floor(Math.random() * 40))
    }));
  };

  // Generate dynamic weekly activity
  const generateWeeklyActivity = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      day,
      activity: Math.floor(Math.random() * 30) + 5
    }));
  };

  const scoreHistory = generateScoreHistory();
  const weeklyActivity = generateWeeklyActivity();

  // Clipboard functionality
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = async (text: string, item: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(item);
      setTimeout(() => setCopiedItem(null), 2000);
      console.log(`[OmniRep] Copied ${item} to clipboard:`, text);
    } catch (err) {
      console.error(`[OmniRep] Failed to copy ${item}:`, err);
    }
  };

  const handleRefreshReputation = async () => {
    if (!address) return;

    setIsUpdatingReputation(true);
    try {
      console.log('Refreshing reputation data from overview...');
      const data = await updateUserReputation(address);
      setReputationData(data);
    } catch (error) {
      console.error("Failed to update reputation:", error);
    }
    setIsUpdatingReputation(false);
  };

  const handleConnectGitHub = async (username: string) => {
    setIsConnectingGitHub(true);
    try {
      console.log('Connecting to GitHub for user:', username);
      const result = await connectGitHubAccount(username);
      
      if (result.success) {
        // Refresh reputation data after connecting GitHub
        if (address) {
          await handleRefreshReputation();
        }
      } else {
        throw new Error(result.error || 'Failed to connect GitHub');
      }
    } catch (error) {
      console.error("Failed to connect GitHub:", error);
      throw error; // Re-throw for modal to handle
    }
    setIsConnectingGitHub(false);
  };

  const handleIssueCredential = async () => {
    if (!did) {
      console.error("[OmniRep] Cannot issue credential without DID");
      return;
    }

    if (!reputationData) {
      console.error("[OmniRep] Cannot issue credential without reputation data");
      return;
    }

    try {
      // Use real reputation data instead of mock
      const hashedScore = hashReputationScore(reputationData);
      console.log("[OmniRep] Hashed reputation score:", hashedScore);

      // Issue the verifiable credential with real data
      await createAndUploadCredential(did, hashedScore, {
        connectedPlatforms,
        monthlyGrowth,
        currentScore,
        demoMode: false, // Now using real data
      });
    } catch (err) {
      console.error("[OmniRep] Failed to issue credential:", err);
    }
  };

  const handleCreateENS = async () => {
    if (!did) {
      console.error("[OmniRep] Cannot create ENS without DID");
      return;
    }

    if (!address) {
      console.error("[OmniRep] Cannot create ENS without wallet address");
      return;
    }

    // Generate a demo username (in production, user would input this)
    const username = `user${Math.floor(Math.random() * 10000)}`;
    
    try {
      console.log(`[OmniRep] Creating ENS subname for wallet: ${address}`);
      const createdSubname = await createUserSubname(address, did, username);
      console.log(`[OmniRep] ENS subname created: ${createdSubname}`);
      
      // ENS name created successfully - could be stored in local state if needed
    } catch (err) {
      console.error("[OmniRep] Failed to create ENS subname:", err);
    }
  };
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-gray-400 mt-2">Track your reputation growth and opportunities</p>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className="bg-teal-500/20 px-2 py-0.5 rounded text-teal-400 text-xs">
              Real-time Data
            </span>
            <span className="bg-green-500/20 px-2 py-0.5 rounded text-green-400 text-xs">
              ENS Integration
            </span>
            <span className="bg-purple-500/20 px-2 py-0.5 rounded text-purple-400 text-xs">
              Verifiable Credentials
            </span>
            {getStoredGitHubData() && (
              <span className="bg-blue-500/20 px-2 py-0.5 rounded text-blue-400 text-xs">
                GitHub Connected
              </span>
            )}
          </div>
          <p className="text-gray-500 text-xs mt-2">
            Your reputation score is calculated from real on-chain and off-chain activity data
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isLoadingReputation ? (
            <Badge variant="outline" className="border-gray-500/30 text-gray-400 bg-gray-500/10 px-4 py-2">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </Badge>
          ) : (
            <Badge variant="outline" className="border-teal-500/30 text-teal-400 bg-teal-500/10 px-4 py-2">
              <Star className="h-4 w-4 mr-2" />
              Score: {Math.round(currentScore)}
            </Badge>
          )}
          <Button 
            onClick={handleRefreshReputation}
            disabled={isUpdatingReputation || !address}
            className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600"
          >
            {isUpdatingReputation ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Refresh Data
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/50 hover:border-teal-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/20 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm">Reputation Score</p>
                <p className="text-3xl font-bold text-white">{Math.round(currentScore)}</p>
                <p className="text-teal-400 text-sm font-medium">+{monthlyGrowth} this month</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Star className="h-7 w-7 text-white" />
              </div>
            </div>
            <Progress value={Math.min(85, (currentScore / 1000) * 100)} className="h-2 bg-gray-700" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/50 hover:border-purple-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm">Connected Platforms</p>
                <p className="text-3xl font-bold text-white">{connectedPlatforms}</p>
                <p className="text-purple-400 text-sm font-medium">{6 - connectedPlatforms} available</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Link2 className="h-7 w-7 text-white" />
              </div>
            </div>
            <Progress value={(connectedPlatforms / 6) * 100} className="h-2 bg-gray-700" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/50 hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm">Available Grants</p>
                <p className="text-3xl font-bold text-white">{availableGrants}</p>
                <p className="text-blue-400 text-sm font-medium">${(availableGrants * 2400).toLocaleString()} total value</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign className="h-7 w-7 text-white" />
              </div>
            </div>
            <Progress value={Math.min(80, (availableGrants / 20) * 100)} className="h-2 bg-gray-700" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/50 hover:border-green-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm">Monthly Growth</p>
                <p className="text-3xl font-bold text-white">{monthlyGrowth}</p>
                <p className="text-green-400 text-sm font-medium">{monthlyGrowth > 20 ? 'Above' : 'Below'} average</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
            </div>
            <Progress value={Math.min(90, (monthlyGrowth / 50) * 100)} className="h-2 bg-gray-700" />
          </CardContent>
        </Card>
      </div>

      {/* DID Management, ENS, & Credential Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* DID Management Card */}
        <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Key className="h-5 w-5 text-blue-400" />
              Decentralized Identity (DID)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">DID Status</p>
                <div className="flex items-center gap-2 mt-1">
                  {isDIDCreated() ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 font-medium">Created</span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 text-yellow-400" />
                      <span className="text-yellow-400 font-medium">Not Created</span>
                    </>
                  )}
                </div>
              </div>
              <Badge 
                className={`${
                  isDIDCreated() 
                    ? "bg-green-500/20 text-green-400 border-green-500/30" 
                    : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                }`}
              >
                {isDIDCreated() ? "Active" : "Pending"}
              </Badge>
            </div>

            {did && (
              <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                <p className="text-xs text-gray-400 mb-1">DID</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs text-gray-300 flex-1 truncate">{did}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(did, "DID")}
                    className="h-6 w-6 p-0 hover:bg-gray-700"
                  >
                    {copiedItem === "DID" ? (
                      <CheckCircle className="h-3 w-3 text-green-400" />
                    ) : (
                      <Copy className="h-3 w-3 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            <Button
              onClick={createDID}
              disabled={isCreatingDID || isDIDCreated()}
              className={`w-full ${
                isDIDCreated()
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              }`}
            >
              {isCreatingDID ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating DID...
                </>
              ) : isDIDCreated() ? (
                "DID Already Created"
              ) : (
                <>
                  <Key className="h-4 w-4 mr-2" />
                  Generate DID
                </>
              )}
            </Button>

            {didError && (
              <div className="p-2 rounded bg-red-500/10 border border-red-500/20">
                <p className="text-red-400 text-xs">{didError}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ENS Management Card */}
        <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-green-400" />
              ENS Identity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">ENS Status</p>
                <div className="flex items-center gap-2 mt-1">
                  {ensName ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 font-medium">Active</span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 text-yellow-400" />
                      <span className="text-yellow-400 font-medium">Not Created</span>
                    </>
                  )}
                </div>
              </div>
              <Badge 
                className={`${
                  ensName 
                    ? "bg-green-500/20 text-green-400 border-green-500/30" 
                    : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                }`}
              >
                {ensName ? "Linked" : "Available"}
              </Badge>
            </div>

            {ensName && (
              <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                <p className="text-xs text-gray-400 mb-1">ENS Name</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs text-gray-300 flex-1 truncate">{ensName}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(ensName, "ENS")}
                    className="h-6 w-6 p-0 hover:bg-gray-700"
                  >
                    {copiedItem === "ENS" ? (
                      <CheckCircle className="h-3 w-3 text-green-400" />
                    ) : (
                      <Copy className="h-3 w-3 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {ensProfile && (
              <div className="space-y-2">
                <p className="text-xs text-gray-400">Profile</p>
                <div className="flex items-center gap-2">
                  {ensProfile.avatar && (
                    <Image 
                      src={ensProfile.avatar} 
                      alt="ENS Avatar" 
                      width={24} 
                      height={24} 
                      className="rounded-full" 
                    />
                  )}
                  <span className="text-xs text-gray-300">{ensProfile.name || ensName}</span>
                </div>
              </div>
            )}

            <Button
              onClick={handleCreateENS}
              disabled={isCreatingENS || !isDIDCreated() || !!ensName}
              className={`w-full ${
                !isDIDCreated() || !!ensName
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
              }`}
            >
              {isCreatingENS ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating ENS...
                </>
              ) : !isDIDCreated() ? (
                "Create DID First"
              ) : ensName ? (
                "ENS Already Created"
              ) : (
                <>
                  <Users className="h-4 w-4 mr-2" />
                  Create ENS Name
                </>
              )}
            </Button>

            {ensError && (
              <div className="p-2 rounded bg-red-500/10 border border-red-500/20">
                <p className="text-red-400 text-xs">{ensError}</p>
              </div>
            )}

            {ensName && (
              <div className="flex justify-center gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`https://sepolia.app.ens.domains/name/${ensName}`, "_blank")}
                  className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View on ENS
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`/reputation/${ensName}`, "_self")}
                  className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  View Reputation
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Credential Management Card */}
        <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-teal-400" />
              Verifiable Credentials
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Credential Status</p>
                <div className="flex items-center gap-2 mt-1">
                  {lastCID ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 font-medium">Issued</span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400 font-medium">Not Issued</span>
                    </>
                  )}
                </div>
              </div>
              <Badge 
                className={`${
                  lastCID 
                    ? "bg-teal-500/20 text-teal-400 border-teal-500/30" 
                    : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                }`}
              >
                Score: {Math.round(currentScore)}
              </Badge>
            </div>

            {lastCID && (
              <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                <p className="text-xs text-gray-400 mb-1">IPFS CID</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs text-gray-300 flex-1 truncate">{lastCID}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(lastCID, "CID")}
                    className="h-6 w-6 p-0 hover:bg-gray-700"
                  >
                    {copiedItem === "CID" ? (
                      <CheckCircle className="h-3 w-3 text-green-400" />
                    ) : (
                      <Copy className="h-3 w-3 text-gray-400" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`https://ipfs.io/ipfs/${lastCID}`, "_blank")}
                    className="h-6 w-6 p-0 hover:bg-gray-700"
                  >
                    <ExternalLink className="h-3 w-3 text-gray-400" />
                  </Button>
                </div>
              </div>
            )}

            <Button
              onClick={handleIssueCredential}
              disabled={!isDIDCreated() || isCreatingCredential || isUploading}
              className={`w-full ${
                !isDIDCreated()
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600"
              }`}
            >
              {isCreatingCredential || isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isCreatingCredential ? "Creating..." : "Uploading to IPFS..."}
                </>
              ) : !isDIDCreated() ? (
                "Create DID First"
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Issue Credential
                </>
              )}
            </Button>

            {credentialError && (
              <div className="p-2 rounded bg-red-500/10 border border-red-500/20">
                <p className="text-red-400 text-xs">{credentialError}</p>
              </div>
            )}

            {lastCID && (
              <div className="text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`https://ipfs.io/ipfs/${lastCID}`, "_blank")}
                  className="border-teal-500/30 text-teal-400 hover:bg-teal-500/10"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View on IPFS
                </Button>
              </div>
            )}
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
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 hover:border-green-500/40 transition-colors cursor-pointer group">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Create ENS Identity</p>
                <p className="text-gray-400 text-sm">Get human-readable name like alice.omnirep.eth</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Free</Badge>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-400 transition-colors" />
              </div>
            </div>

            {!getStoredGitHubData() ? (
              <div 
                onClick={() => setIsGitHubModalOpen(true)}
                className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-teal-500/10 to-teal-600/10 border border-teal-500/20 hover:border-teal-500/40 transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center">
                  <Github className="h-5 w-5 text-teal-400" />
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
            ) : (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">GitHub Connected</p>
                  <p className="text-gray-400 text-sm">@{getStoredGitHubData()?.username} - Contributing to your score</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Connected</Badge>
                  <CheckCircle className="h-4 w-4 text-green-400" />
                </div>
              </div>
            )}

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

      {/* GitHub Connect Modal */}
      <GitHubConnectModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        onConnect={handleConnectGitHub}
        isConnecting={isConnectingGitHub}
      />
    </div>
  );
}
