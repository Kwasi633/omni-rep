/* eslint-disable prettier/prettier */
/**
 * GitHub API Integration Service
 * Fetches user activity data from GitHub for reputation scoring
 */

export interface GitHubUser {
  login: string;
  id: number;
  name: string;
  company: string | null;
  blog: string;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  avatar_url: string;
  html_url: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  size: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  topics: string[];
  open_issues_count: number;
}

export interface GitHubContributions {
  total: number;
  weeks: {
    contributionDays: {
      contributionCount: number;
      date: string;
    }[];
  }[];
}

// Removed duplicate/conflicting GitHubActivity interface to resolve type errors.

/**
 * Represents the main GitHub activity metrics used for reputation scoring.
 */
export interface GitHubActivity {
  commits: number;
  pullRequests: number;
  issues: number;
  contributions: number;
  repositories: number;
  stars: number;
  followers: number;
  accountAge: number;
}



/**
 * Get stored GitHub activity data from localStorage (legacy, consider removing if not used)
 */
export function getStoredGitHubActivityData(): GitHubActivity | null {
  try {
    const data = localStorage.getItem('github_user_data');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * Store GitHub data in localStorage
 */
export function storeGitHubData(data: GitHubActivity): void {
  localStorage.setItem('github_user_data', JSON.stringify(data));
}

class GitHubService {
  private baseUrl = 'https://api.github.com';
  private token?: string;

  constructor(token?: string) {
    this.token = token;
  }

  private async fetch(endpoint: string): Promise<any> {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'OmniRep-App'
    };

    if (this.token) {
      headers['Authorization'] = `token ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, { headers });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`GitHub user not found`);
        } else if (response.status === 403) {
          throw new Error(`GitHub API rate limit exceeded. Please try again later.`);
        } else if (response.status === 401) {
          throw new Error(`GitHub authentication failed. Please check your token.`);
        }
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Get user profile information
   */
  async getUserProfile(username: string): Promise<GitHubUser> {
    return await this.fetch(`/users/${username}`);
  }

  /**
   * Get user repositories
   */
  async getUserRepos(username: string, page = 1, per_page = 100): Promise<GitHubRepo[]> {
    return await this.fetch(`/users/${username}/repos?page=${page}&per_page=${per_page}&sort=updated`);
  }

  /**
   * Get user's contribution activity (estimated from available data)
   */
  async getUserContributions(username: string): Promise<GitHubContributions> {
    // GitHub doesn't provide a public contributions API
    // We'll estimate contributions from repos and other available data
    console.log('Estimating contributions from available public data');
    return this.estimateContributions(username);
  }

  /**
   * Estimate contributions from available public data
   */
  private async estimateContributions(username: string): Promise<GitHubContributions> {
    const repos = await this.getUserRepos(username);
    const user = await this.getUserProfile(username);
    
    // Simple estimation based on repos and account age
    const accountAge = Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24));
    const estimatedCommits = repos.reduce((total, repo) => {
      // Rough estimation: 1 commit per star, minimum 1 per repo
      return total + Math.max(1, repo.stargazers_count);
    }, 0);

    // Simulate weeks data to match GitHubContributions interface
    const weeks: { contributionDays: { contributionCount: number; date: string }[] }[] = [];
    const weeksInYear = 52;
    const commitsPerWeek = Math.ceil(estimatedCommits / Math.min(weeksInYear, Math.ceil(accountAge / 7)));

    for (let i = 0; i < Math.min(weeksInYear, Math.ceil(accountAge / 7)); i++) {
      weeks.push({
        contributionDays: [
          {
            contributionCount: commitsPerWeek,
            date: new Date(Date.now() - (i * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
          }
        ]
      });
    }

    return {
      total: estimatedCommits,
      weeks
    };
  }

  /**
   * Get comprehensive GitHub activity for reputation scoring
   */
  async getActivityData(username: string): Promise<GitHubActivity> {
    try {
      // First, validate the user exists
      const user = await this.getUserProfile(username);
      
      // Get repositories
      const repos = await this.getUserRepos(username);
      
      // Get estimated contributions
      const contributions = await this.getUserContributions(username);

      const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
      const accountAge = Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24));

      return {
        commits: contributions.total,
        pullRequests: this.estimatePullRequests(repos),
        issues: this.estimateIssues(repos),
        contributions: contributions.total,
        repositories: user.public_repos,
        stars: totalStars,
        followers: user.followers,
        accountAge
      };
    } catch (error) {
      console.error('Failed to get GitHub activity data:', error);
      
      // Check if it's a user not found error
      if (error instanceof Error && error.message.includes('GitHub user not found')) {
        throw error; // Re-throw user not found errors
      }
      
      // For other errors, return default values with some mock data
      return {
        commits: 0,
        pullRequests: 0,
        issues: 0,
        contributions: 0,
        repositories: 0,
        stars: 0,
        followers: 0,
        accountAge: 0
      };
    }
  }

  /**
   * Estimate pull requests from repo data
   */
  private estimatePullRequests(repos: GitHubRepo[]): number {
    // Rough estimation: more active repos likely have more PRs
    return repos.reduce((total, repo) => {
      if (repo.forks_count > 0 || repo.stargazers_count > 5) {
        return total + Math.ceil(repo.stargazers_count / 10);
      }
      return total;
    }, 0);
  }

  /**
   * Estimate issues from repo data
   */
  private estimateIssues(repos: GitHubRepo[]): number {
    return repos.reduce((total, repo) => total + repo.open_issues_count, 0);
  }

  /**
   * Calculate GitHub reputation score
   */
  calculateGitHubScore(activity: GitHubActivity): number {
    const weights = {
      commits: 1,
      pullRequests: 2,
      issues: 0.5,
      repositories: 3,
      stars: 0.5,
      followers: 1,
      accountAge: 0.1 // per day
    };

    const score = (
      activity.commits * weights.commits +
      activity.pullRequests * weights.pullRequests +
      activity.issues * weights.issues +
      activity.repositories * weights.repositories +
      activity.stars * weights.stars +
      activity.followers * weights.followers +
      activity.accountAge * weights.accountAge
    );

    // Normalize to 0-200 range for GitHub component
    return Math.min(200, Math.round(score / 10));
  }
}

export const gitHubService = new GitHubService();

/**
 * Mock data for development/demo purposes
 */
export const mockGitHubActivity: GitHubActivity = {
  commits: 1847,
  pullRequests: 156,
  issues: 89,
  contributions: 2134,
  repositories: 47,
  stars: 892,
  followers: 234,
  accountAge: 1247 // ~3.4 years
};

/**
 * Connect GitHub account and fetch activity data
 */
export async function connectGitHub(username: string, token?: string): Promise<{
  success: boolean;
  activity?: GitHubActivity;
  error?: string;
}> {
  try {
    if (!username || username.trim() === '') {
      return { 
        success: false, 
        error: 'GitHub username is required' 
      };
    }

    // Sanitize the username (GitHub usernames can only contain alphanumeric characters and hyphens)
    const sanitizedUsername = username.trim().toLowerCase();
    if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(sanitizedUsername)) {
      return {
        success: false,
        error: 'Invalid GitHub username format. Usernames can only contain alphanumeric characters and hyphens.'
      };
    }

    const service = new GitHubService(token);
    const activity = await service.getActivityData(sanitizedUsername);
    
    // Store in localStorage for persistence
    localStorage.setItem('omniRep_github_data', JSON.stringify({
      username: sanitizedUsername,
      activity,
      lastUpdated: Date.now(),
      connected: true
    }));

    return { success: true, activity };
  } catch (error) {
    console.error('Failed to connect GitHub:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return { 
      success: false, 
      error: errorMessage
    };
  }
}

/**
 * Get stored GitHub data
 */
export function getStoredGitHubData(): { username: string; activity: GitHubActivity; lastUpdated: number; connected: boolean } | null {
  try {
    const data = localStorage.getItem('omniRep_github_data');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * Check if GitHub is connected
 */
export function isGitHubConnected(): boolean {
  const data = getStoredGitHubData();
  return data?.connected === true;
}
