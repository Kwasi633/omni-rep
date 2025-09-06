/* eslint-disable prettier/prettier */
"use client";

import React, { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  Wallet, 
  User, 
  Globe, 
  ArrowRight, 
  ArrowLeft,
  Loader2,
  Shield,
  Sparkles,
  Trophy,
  Users,
  ExternalLink,
  Github,
  Twitter,
  Link as LinkIcon,
  AlertCircle,
  Check
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type OnboardingStep = 'welcome' | 'connect' | 'profile' | 'identity' | 'complete';

interface ProfileData {
  displayName: string;
  bio: string;
  website: string;
  twitter: string;
  github: string;
  email: string;
}

interface IdentityData {
  ensOption: 'create' | 'existing' | 'skip';
  preferredUsername: string;
  existingEnsName: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { isConnected, address } = useAccount();

  // Onboarding state
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: '',
    bio: '',
    website: '',
    twitter: '',
    github: '',
    email: ''
  });

  const [identityData, setIdentityData] = useState<IdentityData>({
    ensOption: 'create',
    preferredUsername: '',
    existingEnsName: ''
  });

  // Progress calculation
  const steps: OnboardingStep[] = ['welcome', 'connect', 'profile', 'identity', 'complete'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  // Auto-advance from welcome to connect, and from connect to profile
  useEffect(() => {
    if (currentStep === 'welcome') {
      // Auto advance from welcome after a short delay
      const timer = setTimeout(() => {
        setCurrentStep('connect');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  useEffect(() => {
    if (isConnected && currentStep === 'connect') {
      setCurrentStep('profile');
    }
  }, [isConnected, currentStep]);

  // Validation functions
  const validateProfile = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!profileData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    }
    
    if (profileData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (profileData.website && !profileData.website.startsWith('http')) {
      newErrors.website = 'Website must start with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateIdentity = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (identityData.ensOption === 'create' && !identityData.preferredUsername.trim()) {
      newErrors.preferredUsername = 'Username is required for ENS creation';
    }
    
    if (identityData.ensOption === 'existing' && !identityData.existingEnsName.trim()) {
      newErrors.existingEnsName = 'ENS name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step handlers
  const handleProfileNext = () => {
    if (validateProfile()) {
      setCurrentStep('identity');
    }
  };

  const handleIdentityNext = async () => {
    if (!validateIdentity()) return;
    
    setIsLoading(true);
    try {
      // Simulate ENS setup process
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCurrentStep('complete');
    } catch (error) {
      console.error('Identity setup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Simulate onboarding completion
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store onboarding completion and user data
      localStorage.setItem('omniRep_onboarded', 'true');
      localStorage.setItem('omniRep_profile', JSON.stringify(profileData));
      localStorage.setItem('omniRep_identity', JSON.stringify(identityData));
      
      // Redirect to dashboard
      router.push('/');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  // Render step components
  const renderWelcomeStep = () => (
    <div className="text-center space-y-8 max-w-2xl mx-auto">
      <div className="space-y-4">
        <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto">
          {/* @ts-ignore */}
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
          Welcome to OmniRep
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          Your decentralized reputation platform for the multi-chain future
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 py-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          {/* @ts-ignore */}
          <Shield className="w-8 h-8 text-teal-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Decentralized Identity</h3>
          <p className="text-gray-400 text-sm">Own your reputation data across all blockchain networks</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          {/* @ts-ignore */}
          <Trophy className="w-8 h-8 text-purple-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Cross-Chain Reputation</h3>
          <p className="text-gray-400 text-sm">Build reputation that follows you everywhere</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          {/* @ts-ignore */}
          <Users className="w-8 h-8 text-orange-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Community Driven</h3>
          <p className="text-gray-400 text-sm">Earn trust through meaningful interactions</p>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-400">
          {/* @ts-ignore */}
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Starting your journey...</span>
        </div>
      </div>
    </div>
  );

  const renderConnectStep = () => (
    <div className="text-center space-y-8 max-w-lg mx-auto">
      <div className="space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto">
          {/* @ts-ignore */}
          <Wallet className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white">Connect Your Wallet</h2>
        <p className="text-gray-300">
          Connect your wallet to create your decentralized identity and start building your reputation
        </p>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50">
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <ConnectButton />
          </div>
          
          {isConnected && address && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-green-400">
                {/* @ts-ignore */}
                <Check className="w-5 h-5" />
                <span className="font-medium">Wallet Connected!</span>
              </div>
              <p className="text-green-300 text-sm mt-2">
                {address.slice(0, 6)}...{address.slice(-4)}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="text-xs text-gray-500">
        <p>We support MetaMask, WalletConnect, and other popular wallets</p>
      </div>
    </div>
  );

  const renderProfileStep = () => (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto">
          {/* @ts-ignore */}
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white">Create Your Profile</h2>
        <p className="text-gray-300">
          Tell the community about yourself and build trust through transparency
        </p>
      </div>

      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white">Profile Information</CardTitle>
          <CardDescription className="text-gray-400">
            This information will be publicly visible on your reputation profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Display Name *
              </label>
              <Input
                value={profileData.displayName}
                onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                placeholder="Enter your display name"
                className="bg-gray-900/50 border-gray-600 text-white placeholder-gray-400"
              />
              {errors.displayName && (
                <p className="text-red-400 text-xs flex items-center space-x-1">
                  {/* @ts-ignore */}
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.displayName}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Email
              </label>
              <Input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                placeholder="your@email.com"
                className="bg-gray-900/50 border-gray-600 text-white placeholder-gray-400"
              />
              {errors.email && (
                <p className="text-red-400 text-xs flex items-center space-x-1">
                  {/* @ts-ignore */}
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Bio
            </label>
            <Textarea
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              className="bg-gray-900/50 border-gray-600 text-white placeholder-gray-400 min-h-[100px]"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                {/* @ts-ignore */}
                <LinkIcon className="w-4 h-4" />
                <span>Website</span>
              </label>
              <Input
                value={profileData.website}
                onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                placeholder="https://yourwebsite.com"
                className="bg-gray-900/50 border-gray-600 text-white placeholder-gray-400"
              />
              {errors.website && (
                <p className="text-red-400 text-xs flex items-center space-x-1">
                  {/* @ts-ignore */}
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.website}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                {/* @ts-ignore */}
                <Twitter className="w-4 h-4" />
                <span>Twitter</span>
              </label>
              <Input
                value={profileData.twitter}
                onChange={(e) => setProfileData({ ...profileData, twitter: e.target.value })}
                placeholder="@username"
                className="bg-gray-900/50 border-gray-600 text-white placeholder-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                {/* @ts-ignore */}
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </label>
              <Input
                value={profileData.github}
                onChange={(e) => setProfileData({ ...profileData, github: e.target.value })}
                placeholder="username"
                className="bg-gray-900/50 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack} className="border-gray-600 text-gray-300">
          {/* @ts-ignore */}
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleProfileNext} className="bg-gradient-to-r from-teal-500 to-purple-500">
          Continue
          {/* @ts-ignore */}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderIdentityStep = () => (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mx-auto">
          {/* @ts-ignore */}
          <Globe className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white">Setup Your Identity</h2>
        <p className="text-gray-300">
          Choose how you want to be identified in the decentralized web
        </p>
      </div>

      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white">ENS & Identity Options</CardTitle>
          <CardDescription className="text-gray-400">
            Select your preferred identity method for the OmniRep ecosystem
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div 
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                identityData.ensOption === 'create' 
                  ? 'border-teal-500 bg-teal-500/10' 
                  : 'border-gray-600 bg-gray-900/20'
              }`}
              onClick={() => setIdentityData({ ...identityData, ensOption: 'create' })}
            >
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full border-2 border-teal-500 flex items-center justify-center mt-0.5">
                  {identityData.ensOption === 'create' && <div className="w-2 h-2 bg-teal-500 rounded-full" />}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">Create New ENS Subname</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Get a free subdomain like username.omnirep.eth for your identity
                  </p>
                  {identityData.ensOption === 'create' && (
                    <div className="mt-4">
                      <Input
                        value={identityData.preferredUsername}
                        onChange={(e) => setIdentityData({ ...identityData, preferredUsername: e.target.value })}
                        placeholder="Choose your username"
                        className="bg-gray-900/50 border-gray-600 text-white placeholder-gray-400"
                      />
                      {errors.preferredUsername && (
                        <p className="text-red-400 text-xs flex items-center space-x-1 mt-2">
                          {/* @ts-ignore */}
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.preferredUsername}</span>
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Your ENS will be: {identityData.preferredUsername || 'username'}.omnirep.eth
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div 
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                identityData.ensOption === 'existing' 
                  ? 'border-purple-500 bg-purple-500/10' 
                  : 'border-gray-600 bg-gray-900/20'
              }`}
              onClick={() => setIdentityData({ ...identityData, ensOption: 'existing' })}
            >
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full border-2 border-purple-500 flex items-center justify-center mt-0.5">
                  {identityData.ensOption === 'existing' && <div className="w-2 h-2 bg-purple-500 rounded-full" />}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">Use Existing ENS</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Connect an ENS name you already own
                  </p>
                  {identityData.ensOption === 'existing' && (
                    <div className="mt-4">
                      <Input
                        value={identityData.existingEnsName}
                        onChange={(e) => setIdentityData({ ...identityData, existingEnsName: e.target.value })}
                        placeholder="yourname.eth"
                        className="bg-gray-900/50 border-gray-600 text-white placeholder-gray-400"
                      />
                      {errors.existingEnsName && (
                        <p className="text-red-400 text-xs flex items-center space-x-1 mt-2">
                          {/* @ts-ignore */}
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.existingEnsName}</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div 
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                identityData.ensOption === 'skip' 
                  ? 'border-gray-500 bg-gray-500/10' 
                  : 'border-gray-600 bg-gray-900/20'
              }`}
              onClick={() => setIdentityData({ ...identityData, ensOption: 'skip' })}
            >
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full border-2 border-gray-500 flex items-center justify-center mt-0.5">
                  {identityData.ensOption === 'skip' && <div className="w-2 h-2 bg-gray-500 rounded-full" />}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">Skip for Now</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Use your wallet address as identity (you can set up ENS later)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack} className="border-gray-600 text-gray-300">
          {/* @ts-ignore */}
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={handleIdentityNext} 
          disabled={isLoading}
          className="bg-gradient-to-r from-purple-500 to-pink-500"
        >
          {/* @ts-ignore */}
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isLoading ? 'Setting up...' : 'Continue'}
          {/* @ts-ignore */}
          {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="text-center space-y-8 max-w-lg mx-auto">
      <div className="space-y-4">
        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto">
          {/* @ts-ignore */}
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white">Welcome to OmniRep!</h2>
        <p className="text-gray-300">
          Your decentralized reputation profile has been created successfully
        </p>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Profile Summary</h3>
          <div className="space-y-3 text-left">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Display Name:</span>
              <span className="text-white font-medium">{profileData.displayName}</span>
            </div>
            {profileData.email && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Email:</span>
                <span className="text-white">{profileData.email}</span>
              </div>
            )}
            {identityData.ensOption !== 'skip' && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">ENS Identity:</span>
                <span className="text-white">
                  {identityData.ensOption === 'create' 
                    ? `${identityData.preferredUsername}.omnirep.eth`
                    : identityData.existingEnsName
                  }
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Wallet:</span>
              <span className="text-white font-mono text-sm">
                {address?.slice(0, 8)}...{address?.slice(-6)}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">What&apos;s Next?</h3>
          <div className="grid gap-3">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
              <span className="text-gray-300">Explore your reputation dashboard</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-gray-300">Connect with other users and communities</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span className="text-gray-300">Start building your cross-chain reputation</span>
            </div>
          </div>
        </div>
      </div>

      <Button 
        onClick={handleComplete} 
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3"
        size="lg"
      >
        {/* @ts-ignore */}
        {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
        {isLoading ? 'Setting up your dashboard...' : 'Enter OmniRep Dashboard'}
        {/* @ts-ignore */}
        {!isLoading && <ExternalLink className="w-5 h-5 ml-2" />}
      </Button>

      <div className="text-xs text-gray-500">
        <p>You can always update your profile settings from the dashboard</p>
      </div>
    </div>
  );

  const renderProgressIndicator = () => (
    <div className="w-full bg-gray-800/30 rounded-full h-2 mb-8">
      <div 
        className="bg-gradient-to-r from-teal-500 to-purple-500 h-2 rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Indicator */}
        {renderProgressIndicator()}

        {/* Step Content */}
        <div className="relative">
          {currentStep === 'welcome' && renderWelcomeStep()}
          {currentStep === 'connect' && renderConnectStep()}
          {currentStep === 'profile' && renderProfileStep()}
          {currentStep === 'identity' && renderIdentityStep()}
          {currentStep === 'complete' && renderCompleteStep()}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Need help? Check out our{' '}
            <Link href="/docs" className="text-teal-400 hover:text-teal-300 underline">
              documentation
            </Link>{' '}
            or{' '}
            <Link href="/support" className="text-teal-400 hover:text-teal-300 underline">
              contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
