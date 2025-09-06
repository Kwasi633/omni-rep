/* eslint-disable prettier/prettier */
/**
 * User Data Management System
 * Manages user profile data tied to wallet addresses
 */

export interface UserProfileData {
  displayName: string;
  bio: string;
  website: string;
  twitter: string;
  github: string;
  email: string;
  avatar?: string;
  theme?: 'dark' | 'light' | 'auto';
}

export interface UserIdentityData {
  ensOption: 'create' | 'existing' | 'skip';
  preferredUsername: string;
  existingEnsName: string;
  ensName?: string; // Resolved ENS name
}

export interface UserPrivacySettings {
  publicProfile: boolean;
  activityTracking: boolean;
  dataAnalytics: boolean;
  marketingCommunications: boolean;
}

export interface UserSecuritySettings {
  twoFactorAuth: boolean;
  sessionMonitoring: boolean;
  loginNotifications: boolean;
  apiAccess: boolean;
}

export interface CompleteUserData {
  address: string;
  profile: UserProfileData;
  identity: UserIdentityData;
  privacy: UserPrivacySettings;
  security: UserSecuritySettings;
  onboardingCompleted: boolean;
  lastUpdated: number;
  createdAt: number;
}

// Default settings for new users
const DEFAULT_PRIVACY_SETTINGS: UserPrivacySettings = {
  publicProfile: false,
  activityTracking: true,
  dataAnalytics: true,
  marketingCommunications: false,
};

const DEFAULT_SECURITY_SETTINGS: UserSecuritySettings = {
  twoFactorAuth: false,
  sessionMonitoring: true,
  loginNotifications: true,
  apiAccess: false,
};

/**
 * Get user data for a specific wallet address
 */
export function getUserData(address: string): CompleteUserData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const data = localStorage.getItem(`omniRep_userData_${address.toLowerCase()}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading user data:', error);
    return null;
  }
}

/**
 * Save user data for a specific wallet address
 */
export function saveUserData(address: string, userData: Partial<CompleteUserData>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const existingData = getUserData(address);
    const now = Date.now();
    
    const completeData: CompleteUserData = {
      address: address.toLowerCase(),
      profile: {
        displayName: '',
        bio: '',
        website: '',
        twitter: '',
        github: '',
        email: '',
        theme: 'dark',
        ...existingData?.profile,
        ...userData.profile,
      },
      identity: {
        ensOption: 'create',
        preferredUsername: '',
        existingEnsName: '',
        ...existingData?.identity,
        ...userData.identity,
      },
      privacy: {
        ...DEFAULT_PRIVACY_SETTINGS,
        ...existingData?.privacy,
        ...userData.privacy,
      },
      security: {
        ...DEFAULT_SECURITY_SETTINGS,
        ...existingData?.security,
        ...userData.security,
      },
      onboardingCompleted: userData.onboardingCompleted ?? existingData?.onboardingCompleted ?? false,
      lastUpdated: now,
      createdAt: existingData?.createdAt ?? now,
    };

    localStorage.setItem(`omniRep_userData_${address.toLowerCase()}`, JSON.stringify(completeData));
    
    // Also update the global completion flag for quick checks
    if (completeData.onboardingCompleted) {
      localStorage.setItem('omniRep_onboarded', 'true');
    }
  } catch (error) {
    console.error('Error saving user data:', error);
  }
}

/**
 * Check if a user has completed onboarding
 */
export function hasCompletedOnboarding(address: string): boolean {
  const userData = getUserData(address);
  return userData?.onboardingCompleted ?? false;
}

/**
 * Get all user addresses that have data stored
 */
export function getAllUserAddresses(): string[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const keys = Object.keys(localStorage);
    return keys
      .filter(key => key.startsWith('omniRep_userData_'))
      .map(key => key.replace('omniRep_userData_', ''));
  } catch (error) {
    console.error('Error getting user addresses:', error);
    return [];
  }
}

/**
 * Delete user data for a specific address
 */
export function deleteUserData(address: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(`omniRep_userData_${address.toLowerCase()}`);
    
    // Check if this was the last user data
    const remainingUsers = getAllUserAddresses();
    if (remainingUsers.length === 0) {
      localStorage.removeItem('omniRep_onboarded');
    }
  } catch (error) {
    console.error('Error deleting user data:', error);
  }
}

/**
 * Update specific profile data
 */
export function updateUserProfile(address: string, profileData: Partial<UserProfileData>): void {
  const currentData = getUserData(address);
  saveUserData(address, { 
    profile: { 
      ...currentData?.profile,
      ...profileData 
    } 
  });
}

/**
 * Update privacy settings
 */
export function updatePrivacySettings(address: string, privacySettings: Partial<UserPrivacySettings>): void {
  const currentData = getUserData(address);
  saveUserData(address, { 
    privacy: { 
      ...currentData?.privacy,
      ...privacySettings 
    } 
  });
}

/**
 * Update security settings
 */
export function updateSecuritySettings(address: string, securitySettings: Partial<UserSecuritySettings>): void {
  const currentData = getUserData(address);
  saveUserData(address, { 
    security: { 
      ...currentData?.security,
      ...securitySettings 
    } 
  });
}

/**
 * Mark onboarding as completed for a user
 */
export function completeOnboarding(address: string, profileData: UserProfileData, identityData: UserIdentityData): void {
  saveUserData(address, {
    profile: profileData,
    identity: identityData,
    onboardingCompleted: true,
  });
}

/**
 * Export user data in various formats
 */
export function exportUserData(address: string, format: 'json' | 'csv' = 'json'): string | null {
  const userData = getUserData(address);
  if (!userData) return null;

  try {
    if (format === 'json') {
      return JSON.stringify(userData, null, 2);
    } else if (format === 'csv') {
      // Simple CSV export for basic profile data
      const profile = userData.profile;
      const headers = ['Field', 'Value'];
      const rows = [
        ['Address', userData.address],
        ['Display Name', profile.displayName],
        ['Email', profile.email],
        ['Bio', profile.bio],
        ['Website', profile.website],
        ['Twitter', profile.twitter],
        ['GitHub', profile.github],
        ['ENS Name', userData.identity.ensName || 'Not set'],
        ['Created At', new Date(userData.createdAt).toISOString()],
        ['Last Updated', new Date(userData.lastUpdated).toISOString()],
      ];

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(field => `"${field}"`).join(','))
      ].join('\n');

      return csvContent;
    }
  } catch (error) {
    console.error('Error exporting user data:', error);
  }

  return null;
}
