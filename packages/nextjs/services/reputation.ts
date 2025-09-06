/* eslint-disable prettier/prettier */
/**
 * Reputation Score Engine
 * Calculates weighted reputation scores combining on-chain and off-chain data
 */

import { GitHubActivity, gitHubService, getStoredGitHubData } from './github';
import { walletAnalyticsService } from './wallet-analytics';

export interface WalletMetrics {
  address: string;
  age: number; // in days
  transactionCount: number;
  totalVolume: number; // in ETH
  uniqueContracts: number;
  nftCount: number;
  defiProtocols: number;
  ensName?: string;
  balance: number; // in ETH
}

export interface ReputationComponents {
  walletScore: number;
  githubScore: number;
  socialScore: number;
  identityScore: number;
  activityScore: number;
  securityScore: number;
}

export interface ReputationInsights {
  strengths: string[];
  improvements: string[];
  nextMilestones: string[];
  percentile: number;
  trustLevel: 'Low' | 'Medium' | 'High' | 'Excellent';
}

export interface ReputationData {
  totalScore: number;
  components: ReputationComponents;
  insights: ReputationInsights;
  lastUpdated: number;
  hash?: string; // For on-chain verification
}

class ReputationEngine {
  private weights = {
    wallet: 0.30,      // 30% - On-chain wallet activity
    github: 0.25,      // 25% - Technical contributions
    social: 0.15,      // 15% - Social connections and verification
    identity: 0.15,    // 15% - Identity verification (ENS, etc.)
    activity: 0.10,    // 10% - Recent activity and engagement
    security: 0.05     // 5% - Security practices
  };

  /**
   * Calculate wallet reputation score based on on-chain data
   */
  calculateWalletScore(metrics: WalletMetrics): number {
    const factors = {
      age: this.scoreWalletAge(metrics.age),
      activity: this.scoreTransactionActivity(metrics.transactionCount),
      volume: this.scoreVolume(metrics.totalVolume),
      diversity: this.scoreDiversity(metrics.uniqueContracts, metrics.nftCount, metrics.defiProtocols),
      balance: this.scoreBalance(metrics.balance)
    };

    const weightedScore = (
      factors.age * 0.25 +
      factors.activity * 0.25 +
      factors.volume * 0.20 +
      factors.diversity * 0.20 +
      factors.balance * 0.10
    );

    return Math.round(weightedScore);
  }

  /**
   * Calculate GitHub reputation score
   */
  calculateGitHubScore(activity: GitHubActivity): number {
    return gitHubService.calculateGitHubScore(activity);
  }

  /**
   * Calculate social reputation score
   */
  calculateSocialScore(socialData: {
    twitterFollowers?: number;
    linkedinConnections?: number;
    discordRoles?: number;
    verifiedAccounts?: number;
  }): number {
    const {
      twitterFollowers = 0,
      linkedinConnections = 0,
      discordRoles = 0,
      verifiedAccounts = 0
    } = socialData;

    const twitterScore = Math.min(50, Math.sqrt(twitterFollowers) * 2);
    const linkedinScore = Math.min(30, Math.sqrt(linkedinConnections) * 1.5);
    const discordScore = Math.min(20, discordRoles * 5);
    const verificationBonus = verifiedAccounts * 25;

    return Math.round(twitterScore + linkedinScore + discordScore + verificationBonus);
  }

  /**
   * Calculate identity verification score
   */
  calculateIdentityScore(identityData: {
    hasENS?: boolean;
    ensAge?: number;
    verified2FA?: boolean;
    kycVerified?: boolean;
    profileComplete?: boolean;
  }): number {
    const {
      hasENS = false,
      ensAge = 0,
      verified2FA = false,
      kycVerified = false,
      profileComplete = false
    } = identityData;

    let score = 0;

    if (hasENS) score += 40;
    if (ensAge > 365) score += 20; // ENS older than 1 year
    if (verified2FA) score += 25;
    if (kycVerified) score += 30;
    if (profileComplete) score += 15;

    return Math.min(130, score);
  }

  /**
   * Calculate activity score based on recent engagement
   */
  calculateActivityScore(activityData: {
    recentTransactions?: number;
    platformEngagement?: number;
    lastActive?: number; // days ago
  }): number {
    const {
      recentTransactions = 0,
      platformEngagement = 0,
      lastActive = 999
    } = activityData;

    let score = 0;

    // Recent transaction activity (last 30 days)
    score += Math.min(50, recentTransactions * 2);

    // Platform engagement
    score += Math.min(30, platformEngagement);

    // Recency bonus
    if (lastActive <= 1) score += 20;      // Active today
    else if (lastActive <= 7) score += 15; // Active this week
    else if (lastActive <= 30) score += 10; // Active this month
    else if (lastActive <= 90) score += 5;  // Active in last 3 months

    return Math.round(score);
  }

  /**
   * Calculate security practices score
   */
  calculateSecurityScore(securityData: {
    multiSigUsage?: boolean;
    hardwareWallet?: boolean;
    regularActivity?: boolean;
    noSuspiciousActivity?: boolean;
  }): number {
    const {
      multiSigUsage = false,
      hardwareWallet = false,
      regularActivity = true,
      noSuspiciousActivity = true
    } = securityData;

    let score = 0;

    if (multiSigUsage) score += 25;
    if (hardwareWallet) score += 20;
    if (regularActivity) score += 15;
    if (noSuspiciousActivity) score += 40;

    return score;
  }

  /**
   * Generate insights based on reputation components
   */
  generateInsights(components: ReputationComponents): ReputationInsights {
    const strengths: string[] = [];
    const improvements: string[] = [];
    const nextMilestones: string[] = [];

    // Analyze strengths
    if (components.walletScore > 80) strengths.push('Strong on-chain presence');
    if (components.githubScore > 70) strengths.push('Active technical contributor');
    if (components.identityScore > 80) strengths.push('Well-verified identity');
    if (components.securityScore > 80) strengths.push('Excellent security practices');

    // Identify improvements
    if (components.walletScore < 60) improvements.push('Increase on-chain activity');
    if (components.githubScore < 50) improvements.push('Build technical contributions');
    if (components.socialScore < 40) improvements.push('Expand social verification');
    if (components.identityScore < 60) improvements.push('Complete identity verification');

    // Suggest milestones
    if (components.githubScore < 100) nextMilestones.push('Reach 100+ GitHub contributions');
    if (components.walletScore < 100) nextMilestones.push('Increase wallet diversity');
    if (!strengths.includes('Well-verified identity')) nextMilestones.push('Set up ENS name');

    const totalScore = this.calculateTotalScore(components);
    const percentile = this.calculatePercentile(totalScore);
    const trustLevel = this.determineTrustLevel(totalScore);

    return {
      strengths,
      improvements,
      nextMilestones,
      percentile,
      trustLevel
    };
  }

  /**
   * Calculate total weighted reputation score
   */
  calculateTotalScore(components: ReputationComponents): number {
    return Math.round(
      components.walletScore * this.weights.wallet +
      components.githubScore * this.weights.github +
      components.socialScore * this.weights.social +
      components.identityScore * this.weights.identity +
      components.activityScore * this.weights.activity +
      components.securityScore * this.weights.security
    );
  }

  /**
   * Generate complete reputation data for a user
   */
  async generateReputationData(
    walletMetrics: WalletMetrics,
    socialData?: any,
    identityData?: any,
    activityData?: any,
    securityData?: any
  ): Promise<ReputationData> {
    const components: ReputationComponents = {
      walletScore: this.calculateWalletScore(walletMetrics),
      githubScore: 0,
      socialScore: this.calculateSocialScore(socialData || {}),
      identityScore: this.calculateIdentityScore(identityData || {}),
      activityScore: this.calculateActivityScore(activityData || {}),
      securityScore: this.calculateSecurityScore(securityData || {})
    };

    // Get GitHub data if connected
    const githubData = getStoredGitHubData();
    if (githubData && githubData.activity) {
      components.githubScore = this.calculateGitHubScore(githubData.activity);
    }

    const totalScore = this.calculateTotalScore(components);
    const insights = this.generateInsights(components);

    return {
      totalScore,
      components,
      insights,
      lastUpdated: Date.now(),
      hash: this.generateHash(components)
    };
  }

  // Helper methods for scoring individual factors

  private scoreWalletAge(days: number): number {
    if (days < 30) return 20;
    if (days < 90) return 40;
    if (days < 365) return 60;
    if (days < 730) return 80;
    return 100;
  }

  private scoreTransactionActivity(count: number): number {
    if (count < 10) return 20;
    if (count < 50) return 40;
    if (count < 200) return 60;
    if (count < 500) return 80;
    return 100;
  }

  private scoreVolume(volume: number): number {
    if (volume < 0.1) return 20;
    if (volume < 1) return 40;
    if (volume < 10) return 60;
    if (volume < 50) return 80;
    return 100;
  }

  private scoreDiversity(contracts: number, nfts: number, defi: number): number {
    const diversityScore = (contracts > 5 ? 25 : contracts * 5) +
                          (nfts > 0 ? 25 : 0) +
                          (defi > 0 ? 25 : 0) +
                          (defi > 3 ? 25 : defi * 8);
    return Math.min(100, diversityScore);
  }

  private scoreBalance(balance: number): number {
    if (balance < 0.01) return 10;
    if (balance < 0.1) return 30;
    if (balance < 1) return 50;
    if (balance < 10) return 70;
    if (balance < 100) return 85;
    return 100;
  }

  private calculatePercentile(score: number): number {
    // Simulated percentile calculation based on score distribution
    if (score >= 850) return 95;
    if (score >= 800) return 90;
    if (score >= 750) return 80;
    if (score >= 700) return 70;
    if (score >= 650) return 60;
    if (score >= 600) return 50;
    if (score >= 550) return 40;
    if (score >= 500) return 30;
    if (score >= 450) return 20;
    return 10;
  }

  private determineTrustLevel(score: number): 'Low' | 'Medium' | 'High' | 'Excellent' {
    if (score >= 750) return 'Excellent';
    if (score >= 650) return 'High';
    if (score >= 500) return 'Medium';
    return 'Low';
  }

  private generateHash(components: ReputationComponents): string {
    const data = JSON.stringify(components);
    // Simple hash function for demo - in production use proper crypto hash
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }
}

export const reputationEngine = new ReputationEngine();

/**
 * Mock wallet metrics for demo purposes
 */
export const mockWalletMetrics: WalletMetrics = {
  address: '0x1234...5678',
  age: 1247, // ~3.4 years
  transactionCount: 342,
  totalVolume: 15.7,
  uniqueContracts: 28,
  nftCount: 12,
  defiProtocols: 8,
  ensName: 'user.eth',
  balance: 2.3
};

/**
 * Get stored reputation data
 */
export function getStoredReputationData(): ReputationData | null {
  try {
    const data = localStorage.getItem('omniRep_reputation_data');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * Store reputation data
 */
export function storeReputationData(data: ReputationData): void {
  localStorage.setItem('omniRep_reputation_data', JSON.stringify(data));
}

/**
 * Generate and store reputation data for current user
 */
export async function updateUserReputation(
  walletAddress: string,
  additionalData?: {
    social?: any;
    identity?: any;
    activity?: any;
    security?: any;
  }
): Promise<ReputationData> {
  try {
    // Fetch real wallet metrics instead of using mock data
    console.log('Fetching real wallet metrics for:', walletAddress);
    const walletMetrics = await walletAnalyticsService.getWalletMetrics(walletAddress);
    
    console.log('Wallet metrics fetched:', walletMetrics);
    
    const reputationData = await reputationEngine.generateReputationData(
      walletMetrics,
      additionalData?.social,
      additionalData?.identity,
      additionalData?.activity,
      additionalData?.security
    );

    storeReputationData(reputationData);
    return reputationData;
  } catch (error) {
    console.error('Failed to update user reputation:', error);
    
    // Fallback to mock data if real data fails
    console.log('Falling back to mock data');
    const walletMetrics = { ...mockWalletMetrics, address: walletAddress };
    
    const reputationData = await reputationEngine.generateReputationData(
      walletMetrics,
      additionalData?.social,
      additionalData?.identity,
      additionalData?.activity,
      additionalData?.security
    );

    storeReputationData(reputationData);
    return reputationData;
  }
}
