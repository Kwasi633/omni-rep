/* eslint-disable prettier/prettier */
/**
 * GitHub API Integration
 * Fetches user activity data from GitHub to contribute to reputation score
 */

export interface GitHubUserData {
  login: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  avatar_url: string;
  html_url: string;
}

export interface GitHubRepository {
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  created_at: string;
  updated_at: string;
  html_url: string;
  topics: string[];
}

export interface GitHubContributions {
  totalCommits: number;
  totalPullRequests: number;
  totalStars: number;
  totalForks: number;
  languagesUsed: string[];
  recentActivity: number; // commits in last 30 days
  accountAge: number; // days since account creation
}

export interface GitHubReputationData {
  user: GitHubUserData;
  repositories: GitHubRepository[];
  contributions: GitHubContributions;
  reputationScore: number;
  lastUpdated: number;
}

/**
 * Fetch GitHub user data
 */
export async function fetchGitHubUser(username: string): Promise<GitHubUserData | null> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching GitHub user:', error);
    return null;
  }
}

/**
 * Fetch user's repositories
 */
export async function fetchGitHubRepositories(username: string): Promise<GitHubRepository[]> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    return [];
  }
}

/**
 * Fetch user's commit activity for the last year
 */
export async function fetchGitHubCommitActivity(username: string): Promise<number> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/events?per_page=100`);
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const events = await response.json();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentCommits = events.filter((event: any) => 
      event.type === 'PushEvent' && 
      new Date(event.created_at) > thirtyDaysAgo
    );
    
    return recentCommits.reduce((total: number, event: any) => 
      total + (event.payload?.commits?.length || 0), 0
    );
  } catch (error) {
    console.error('Error fetching GitHub commit activity:', error);
    return 0;
  }
}

/**
 * Calculate contributions summary
 */
export function calculateGitHubContributions(
  user: GitHubUserData, 
  repositories: GitHubRepository[],
  recentActivity: number
): GitHubContributions {
  const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0);
  
  // Extract unique languages
  const languagesUsed = [...new Set(
    repositories
      .map(repo => repo.language)
      .filter(lang => lang !== null)
  )];
  
  // Calculate account age in days
  const accountAge = Math.floor(
    (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Estimate total commits (GitHub doesn't provide this easily via API)
  // We use a heuristic based on repos, recent activity, and account age
  const estimatedCommits = Math.floor(
    repositories.length * 10 + // ~10 commits per repo average
    recentActivity * 12 + // extrapolate recent activity
    Math.min(accountAge / 30, 50) // bonus for account age (max 50)
  );
  
  // Estimate pull requests (another heuristic)
  const estimatedPRs = Math.floor(repositories.length * 2 + totalStars / 10);
  
  return {
    totalCommits: estimatedCommits,
    totalPullRequests: estimatedPRs,
    totalStars,
    totalForks,
    languagesUsed,
    recentActivity,
    accountAge
  };
}

/**
 * Calculate GitHub reputation score (0-1000)
 */
export function calculateGitHubReputationScore(contributions: GitHubContributions): number {
  const weights = {
    commits: 0.3,
    pullRequests: 0.2,
    stars: 0.2,
    followers: 0.1,
    recentActivity: 0.1,
    accountAge: 0.05,
    languages: 0.05
  };
  
  // Normalize values to 0-100 scale
  const normalizedScores = {
    commits: Math.min(contributions.totalCommits / 10, 100), // 1000 commits = 100 points
    pullRequests: Math.min(contributions.totalPullRequests / 2, 100), // 200 PRs = 100 points
    stars: Math.min(contributions.totalStars / 5, 100), // 500 stars = 100 points
    recentActivity: Math.min(contributions.recentActivity * 2, 100), // 50 recent commits = 100 points
    accountAge: Math.min(contributions.accountAge / 10, 100), // 1000 days = 100 points
    languages: Math.min(contributions.languagesUsed.length * 5, 100) // 20 languages = 100 points
  };
  
  // Calculate weighted score
  const score = Object.entries(weights).reduce((total, [key, weight]) => {
    const normalizedKey = key as keyof typeof normalizedScores;
    return total + (normalizedScores[normalizedKey] * weight);
  }, 0);
  
  return Math.round(score * 10); // Scale to 0-1000
}

/**
 * Fetch complete GitHub reputation data
 */
export async function fetchGitHubReputationData(username: string): Promise<GitHubReputationData | null> {
  try {
    console.log(`[GitHub] Fetching reputation data for: ${username}`);
    
    const [user, repositories, recentActivity] = await Promise.all([
      fetchGitHubUser(username),
      fetchGitHubRepositories(username),
      fetchGitHubCommitActivity(username)
    ]);
    
    if (!user) {
      console.error('[GitHub] User not found');
      return null;
    }
    
    const contributions = calculateGitHubContributions(user, repositories, recentActivity);
    const reputationScore = calculateGitHubReputationScore(contributions);
    
    const reputationData: GitHubReputationData = {
      user,
      repositories,
      contributions,
      reputationScore,
      lastUpdated: Date.now()
    };
    
    console.log(`[GitHub] Reputation score calculated: ${reputationScore}/1000`);
    return reputationData;
    
  } catch (error) {
    console.error('[GitHub] Error fetching reputation data:', error);
    return null;
  }
}

/**
 * Cache GitHub data in localStorage
 */
export function cacheGitHubData(address: string, data: GitHubReputationData): void {
  try {
    const key = `omniRep_github_${address.toLowerCase()}`;
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error caching GitHub data:', error);
  }
}

/**
 * Get cached GitHub data
 */
export function getCachedGitHubData(address: string): GitHubReputationData | null {
  try {
    const key = `omniRep_github_${address.toLowerCase()}`;
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const data = JSON.parse(cached);
    
    // Check if data is fresh (less than 1 hour old)
    const oneHour = 60 * 60 * 1000;
    if (Date.now() - data.lastUpdated > oneHour) {
      return null; // Data is stale
    }
    
    return data;
  } catch (error) {
    console.error('Error getting cached GitHub data:', error);
    return null;
  }
}
