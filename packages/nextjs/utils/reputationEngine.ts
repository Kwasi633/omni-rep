/* eslint-disable prettier/prettier */
/**
 * Reputation Score Engine
 * Combines on-chain wallet data, off-chain contributions, and user profile data
 * to calculate a comprehensive reputation score
 */

import { GitHubReputationData } from './githubApi';

export interface WalletMetrics {
  address: string;
  balance: number; // ETH balance
  transactionCount: number;
  walletAge: number; // days since first transaction
  ensName?: string;
  nftCount?: number;
  defiProtocolsUsed?: number;
}

export interface OnChainMetrics {
  walletScore: number; // 0-1000
  transactionHistory: number; // 0-1000
  balanceScore: number; // 0-1000
  diversityScore: number; // 0-1000 (based on protocols used)
  ageScore: number; // 0-1000
}

export interface OffChainMetrics {
  githubScore: number; // 0-1000
  profileCompleteness: number; // 0-1000
  socialPresence: number; // 0-1000 (based on provided social links)
}

export interface ReputationComponents {
  onChain: OnChainMetrics;
  offChain: OffChainMetrics;
  totalScore: number; // 0-1000
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  percentile: number; // compared to other users
  lastCalculated: number;
}

export interface ReputationWeights {
  onChain: number; // default: 0.6
  offChain: number; // default: 0.4
  components: {
    wallet: number; // default: 0.3
    transactions: number; // default: 0.2
    balance: number; // default: 0.1
    github: number; // default: 0.25
    profile: number; // default: 0.1
    social: number; // default: 0.05
  };
}

// Default weight configuration
export const DEFAULT_WEIGHTS: ReputationWeights = {
  onChain: 0.6,
  offChain: 0.4,
  components: {
    wallet: 0.3,
    transactions: 0.2,
    balance: 0.1,
    github: 0.25,
    profile: 0.1,
    social: 0.05
  }
};

/**
 * Calculate on-chain metrics from wallet data
 */
export function calculateOnChainMetrics(walletMetrics: WalletMetrics): OnChainMetrics {
  // Wallet score based on age and ENS ownership
  const ageScore = Math.min(walletMetrics.walletAge / 10, 100); // 1000 days = 100 points
  const ensBonus = walletMetrics.ensName ? 20 : 0;
  const walletScore = Math.min(ageScore + ensBonus, 100) * 10;

  // Transaction history score
  const transactionHistory = Math.min(walletMetrics.transactionCount / 5, 100) * 10; // 500 txns = 1000 points

  // Balance score (logarithmic scale)
  const balanceScore = walletMetrics.balance > 0 
    ? Math.min(Math.log10(walletMetrics.balance + 1) * 100, 100) * 10
    : 0;

  // Diversity score based on protocols used
  const diversityScore = walletMetrics.defiProtocolsUsed 
    ? Math.min(walletMetrics.defiProtocolsUsed * 50, 100) * 10
    : 0;

  return {
    walletScore: Math.round(walletScore),
    transactionHistory: Math.round(transactionHistory),
    balanceScore: Math.round(balanceScore),
    diversityScore: Math.round(diversityScore),
    ageScore: Math.round(ageScore * 10)
  };
}

/**
 * Calculate off-chain metrics
 */
export function calculateOffChainMetrics(
  githubData?: GitHubReputationData,
  profileData?: any,
  socialLinks?: { twitter?: string; github?: string; website?: string }
): OffChainMetrics {
  // GitHub score
  const githubScore = githubData?.reputationScore || 0;

  // Profile completeness score
  let profileCompleteness = 0;
  if (profileData) {
    const fields = ['displayName', 'bio', 'email'];
    const completedFields = fields.filter(field => 
      profileData[field] && profileData[field].trim().length > 0
    ).length;
    profileCompleteness = (completedFields / fields.length) * 1000;
  }

  // Social presence score
  let socialPresence = 0;
  if (socialLinks) {
    const platforms = ['twitter', 'github', 'website'];
    const connectedPlatforms = platforms.filter(platform => 
      socialLinks[platform as keyof typeof socialLinks] && 
      socialLinks[platform as keyof typeof socialLinks]!.trim().length > 0
    ).length;
    socialPresence = (connectedPlatforms / platforms.length) * 1000;
  }

  return {
    githubScore: Math.round(githubScore),
    profileCompleteness: Math.round(profileCompleteness),
    socialPresence: Math.round(socialPresence)
  };
}

/**
 * Calculate overall reputation score
 */
export function calculateReputationScore(
  onChainMetrics: OnChainMetrics,
  offChainMetrics: OffChainMetrics,
  weights: ReputationWeights = DEFAULT_WEIGHTS
): number {
  const onChainTotal = (
    onChainMetrics.walletScore * weights.components.wallet +
    onChainMetrics.transactionHistory * weights.components.transactions +
    onChainMetrics.balanceScore * weights.components.balance
  ) / (weights.components.wallet + weights.components.transactions + weights.components.balance);

  const offChainTotal = (
    offChainMetrics.githubScore * weights.components.github +
    offChainMetrics.profileCompleteness * weights.components.profile +
    offChainMetrics.socialPresence * weights.components.social
  ) / (weights.components.github + weights.components.profile + weights.components.social);

  const totalScore = (onChainTotal * weights.onChain) + (offChainTotal * weights.offChain);
  
  return Math.round(Math.min(totalScore, 1000));
}

/**
 * Assign grade based on score
 */
export function assignGrade(score: number): 'S' | 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 900) return 'S';
  if (score >= 800) return 'A';
  if (score >= 700) return 'B';
  if (score >= 600) return 'C';
  if (score >= 400) return 'D';
  return 'F';
}

/**
 * Calculate percentile (mock implementation - in production would compare to database)
 */
export function calculatePercentile(score: number): number {
  // Mock percentile calculation based on score distribution
  if (score >= 900) return 95;
  if (score >= 800) return 85;
  if (score >= 700) return 70;
  if (score >= 600) return 50;
  if (score >= 500) return 30;
  if (score >= 400) return 15;
  return 5;
}

/**
 * Generate complete reputation analysis
 */
export function generateReputationAnalysis(
  walletMetrics: WalletMetrics,
  githubData?: GitHubReputationData,
  profileData?: any,
  socialLinks?: { twitter?: string; github?: string; website?: string },
  customWeights?: Partial<ReputationWeights>
): ReputationComponents {
  const weights = { ...DEFAULT_WEIGHTS, ...customWeights };
  
  const onChain = calculateOnChainMetrics(walletMetrics);
  const offChain = calculateOffChainMetrics(githubData, profileData, socialLinks);
  const totalScore = calculateReputationScore(onChain, offChain, weights);
  const grade = assignGrade(totalScore);
  const percentile = calculatePercentile(totalScore);

  return {
    onChain,
    offChain,
    totalScore,
    grade,
    percentile,
    lastCalculated: Date.now()
  };
}

/**
 * Generate reputation hash for on-chain storage
 */
export function generateReputationHash(components: ReputationComponents): string {
  const data = {
    score: components.totalScore,
    onChain: components.onChain,
    offChain: components.offChain,
    timestamp: components.lastCalculated
  };
  
  // Simple hash implementation (in production, use proper cryptographic hash)
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return `0x${Math.abs(hash).toString(16).padStart(8, '0')}`;
}

/**
 * Get reputation insights and recommendations
 */
export function getReputationInsights(components: ReputationComponents): {
  insights: string[];
  recommendations: string[];
} {
  const insights: string[] = [];
  const recommendations: string[] = [];

  // On-chain insights
  if (components.onChain.walletScore < 500) {
    insights.push('Your wallet is relatively new to the ecosystem');
    recommendations.push('Continue using your wallet for transactions to build history');
  }

  if (components.onChain.transactionHistory < 300) {
    insights.push('Limited transaction history detected');
    recommendations.push('Engage more with DeFi protocols and dApps');
  }

  if (components.onChain.balanceScore < 200) {
    insights.push('Wallet balance contributes minimally to reputation');
    recommendations.push('Consider maintaining a higher ETH balance');
  }

  // Off-chain insights
  if (components.offChain.githubScore < 400) {
    insights.push('GitHub activity is below average');
    recommendations.push('Increase your open-source contributions and project activity');
  }

  if (components.offChain.profileCompleteness < 700) {
    insights.push('Profile information is incomplete');
    recommendations.push('Complete your profile with bio, contact information, and social links');
  }

  if (components.offChain.socialPresence < 500) {
    insights.push('Limited social media presence');
    recommendations.push('Connect your social media accounts to boost credibility');
  }

  // Overall recommendations
  if (components.totalScore < 600) {
    recommendations.push('Focus on consistent activity across both on-chain and off-chain platforms');
  }

  return { insights, recommendations };
}

/**
 * Export reputation data for sharing or verification
 */
export function exportReputationData(
  address: string,
  components: ReputationComponents,
  format: 'json' | 'summary' = 'json'
): string {
  if (format === 'summary') {
    return `
OmniRep Score: ${components.totalScore}/1000 (Grade: ${components.grade})
Percentile: ${components.percentile}%

On-Chain Metrics:
- Wallet Score: ${components.onChain.walletScore}/1000
- Transaction History: ${components.onChain.transactionHistory}/1000
- Balance Score: ${components.onChain.balanceScore}/1000
- Diversity Score: ${components.onChain.diversityScore}/1000

Off-Chain Metrics:
- GitHub Score: ${components.offChain.githubScore}/1000
- Profile Completeness: ${components.offChain.profileCompleteness}/1000
- Social Presence: ${components.offChain.socialPresence}/1000

Generated: ${new Date(components.lastCalculated).toISOString()}
Verified for: ${address}
    `.trim();
  }

  return JSON.stringify({
    address,
    ...components,
    hash: generateReputationHash(components)
  }, null, 2);
}
