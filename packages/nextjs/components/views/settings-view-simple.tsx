/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { User, Download, Trash2, Save, Wallet } from "lucide-react";
import { 
  getUserData, 
  updateUserProfile,
  deleteUserData,
  exportUserData,
  CompleteUserData,
  UserProfileData
} from "@/utils/userData";

export function SettingsView() {
  const { address, isConnected } = useAccount();
  const [userData, setUserData] = useState<CompleteUserData | null>(null);
  const [profileData, setProfileData] = useState<UserProfileData>({
    displayName: '',
    bio: '',
    website: '',
    twitter: '',
    github: '',
    email: '',
    theme: 'dark'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Load user data when wallet connects
  useEffect(() => {
    if (address && isConnected) {
      const data = getUserData(address);
      if (data) {
        setUserData(data);
        setProfileData(data.profile);
      }
    }
  }, [address, isConnected]);

  // Save profile data
  const handleSaveProfile = async () => {
    if (!address) return;
    
    setIsSaving(true);
    try {
      updateUserProfile(address, profileData);
      setSaveMessage('Profile updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch {
      setSaveMessage('Error saving profile. Please try again.');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Export data
  const handleExportData = (format: 'json' | 'csv', type: string) => {
    if (!address) return;
    
    const data = exportUserData(address, format);
    if (data) {
      const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `omniRep_${type}_${address.slice(0, 8)}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Delete account
  const handleDeleteAccount = () => {
    if (!address) return;
    
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      deleteUserData(address);
      window.location.reload();
    }
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          {/* @ts-ignore */}
          <Wallet className="h-16 w-16 text-gray-500 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-300">Connect Your Wallet</h2>
          <p className="text-gray-500">Please connect your wallet to access settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <div className="flex items-center gap-3">
          {userData?.onboardingCompleted && (
            <Badge variant="outline" className="border-teal-500/30 text-teal-400 bg-teal-500/10">
              Profile Complete
            </Badge>
          )}
          <div className="text-sm text-gray-400">
            {address && `${address.slice(0, 6)}...${address.slice(-4)}`}
          </div>
        </div>
      </div>

      {saveMessage && (
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
          <p className="text-green-400 text-sm">{saveMessage}</p>
        </div>
      )}

      {/* Profile Settings */}
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            {/* @ts-ignore */}
            <User className="h-5 w-5 text-teal-400" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Display Name
              </label>
              <Input 
                value={profileData.displayName}
                onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                className="bg-gray-800/50 border-gray-600 text-white" 
                placeholder="Enter your display name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Email Address
              </label>
              <Input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="bg-gray-800/50 border-gray-600 text-white"
                placeholder="your@email.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Website
              </label>
              <Input
                value={profileData.website}
                onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                className="bg-gray-800/50 border-gray-600 text-white"
                placeholder="https://yourwebsite.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Twitter
              </label>
              <Input
                value={profileData.twitter}
                onChange={(e) => setProfileData({ ...profileData, twitter: e.target.value })}
                className="bg-gray-800/50 border-gray-600 text-white"
                placeholder="@username"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                GitHub
              </label>
              <Input
                value={profileData.github}
                onChange={(e) => setProfileData({ ...profileData, github: e.target.value })}
                className="bg-gray-800/50 border-gray-600 text-white"
                placeholder="username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Bio
            </label>
            <Textarea
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              className="bg-gray-800/50 border-gray-600 text-white min-h-[100px]"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="flex items-center gap-3">
            <Button 
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  {/* @ts-ignore */}
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
            {userData?.identity?.ensName && (
              <div className="text-sm text-gray-400">
                ENS: {userData.identity.ensName}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            {/* @ts-ignore */}
            <Download className="h-5 w-5 text-blue-400" />
            Data Export & Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/30 border border-gray-700/30">
              <div>
                <p className="text-white font-medium">Profile Data</p>
                <p className="text-gray-400 text-sm">Export your complete profile and settings</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-gray-600 text-gray-300">
                  JSON
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportData('json', 'profile')}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                >
                  {/* @ts-ignore */}
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
            <div className="flex items-center gap-3 mb-2">
              {/* @ts-ignore */}
              <Trash2 className="h-5 w-5 text-red-400" />
              <p className="text-red-400 font-medium">Danger Zone</p>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button 
              variant="outline" 
              onClick={handleDeleteAccount}
              className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
