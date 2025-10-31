'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  User,
  Bell,
  Lock,
  HelpCircle,
  Settings as SettingsIcon,
  Palette,
  Globe,
  Moon,
  Database,
  Download,
  Trash2,
  Shield,
  FileText,
  MessageSquare,
  ChevronRight,
  Camera,
  X,
  Check,
  Star,
  Trophy,
  Zap,
  Target,
  Award,
  Crown,
  Sparkles,
  Gift,
  Coins,
  Medal,
  Heart
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Input } from '../ui/input';
import Link from 'next/link';

interface SettingsPageProps {
  onLogout: () => void;
}

export function SettingsPage({ onLogout }: SettingsPageProps) {
  const { data: session } = useSession();
  const user = session?.user;

  // State for dynamically updated profile data
  const [profileData, setProfileData] = useState({ userName: user?.name || '', userImage: user?.image || '' });

  // Load profile data from localStorage and listen for updates
  useEffect(() => {
    // Load initial profile data
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        try {
          const profile = JSON.parse(savedProfile);
          setProfileData({
            userName: profile.name || user?.name || '',
            userImage: profile.image || user?.image || ''
          });
        } catch (error) {
          console.error('Error loading profile from localStorage:', error);
        }
      }
    }

    // Listen for profile updates
    const handleProfileUpdate = (event: CustomEvent) => {
      const updatedProfile = event.detail;
      console.log('SettingsPage received profileUpdated event:', updatedProfile);
      setProfileData({
        userName: updatedProfile.name || user?.name || '',
        userImage: updatedProfile.image || user?.image || ''
      });
    };

    // Listen for logout events
    const handleLogout = () => {
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userProfile');
      }
      // Reset to guest state
      setProfileData({
        userName: '',
        userImage: ''
      });
    };

    // Add event listeners
    window.addEventListener('profileUpdated', handleProfileUpdate as EventListener);
    window.addEventListener('userLoggedOut', handleLogout as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate as EventListener);
      window.removeEventListener('userLoggedOut', handleLogout as EventListener);
    };
  }, [user?.name, user?.image]);

  // Reset to guest when session changes
  useEffect(() => {
    if (!session) {
      setProfileData({
        userName: '',
        userImage: ''
      });
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userProfile');
      }
    }
  }, [session]);

  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    darkMode: false,
    language: 'English',
    autoPlay: true,
    dataSaver: false,
    twoFactor: false,
    marketingEmails: false
  });

  // User badges for display
  const userBadges = [
    { id: 'Level 5 Learner', icon: Star, color: 'bg-white/20 text-white border-0', name: 'Level 5 Learner' },
    { id: 'Premium Member', icon: Crown, color: 'bg-white/20 text-white border-0', name: 'Premium Member' },
  ];

  const settingsSections = [
    {
      title: 'Account Settings',
      items: [
        {
          icon: User,
          label: 'Edit Profile',
          description: 'Update your personal information and profile picture',
          hasArrow: true
        },
        {
          icon: Bell,
          label: 'Notifications',
          description: 'Manage push notifications and alerts',
          hasToggle: true,
          enabled: settings.notifications,
          key: 'notifications'
        },
        {
          icon: Lock,
          label: 'Privacy & Security',
          description: 'Two-factor authentication and privacy settings',
          hasArrow: true
        },
      ]
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: Palette,
          label: 'Theme & Color',
          description: 'Customize the app appearance',
          value: settings.darkMode ? 'Dark' : 'Light',
          hasArrow: true
        },
        {
          icon: Globe,
          label: 'Language',
          description: 'Choose your preferred language',
          value: settings.language,
          hasArrow: true
        },
        {
          icon: Moon,
          label: 'Dark Mode',
          description: 'Toggle dark theme',
          hasToggle: true,
          enabled: settings.darkMode,
          key: 'darkMode'
        },
      ]
    },
    {
      title: 'Learning Settings',
      items: [
        {
          icon: Database,
          label: 'Auto-play Videos',
          description: 'Automatically play videos when opening',
          hasToggle: true,
          enabled: settings.autoPlay,
          key: 'autoPlay'
        },
        {
          icon: Download,
          label: 'Download Quality',
          description: 'Set default download quality for offline content',
          value: 'High',
          hasArrow: true
        },
        {
          icon: Shield,
          label: 'Data Saver Mode',
          description: 'Reduce data usage for mobile connections',
          hasToggle: true,
          enabled: settings.dataSaver,
          key: 'dataSaver'
        },
      ]
    },
    {
      title: 'Data & Storage',
      items: [
        {
          icon: Database,
          label: 'Storage Usage',
          description: 'Manage your downloaded content and cache',
          value: '2.4 GB',
          hasArrow: true
        },
        {
          icon: Download,
          label: 'Export Data',
          description: 'Download your personal data',
          hasArrow: true
        },
        {
          icon: Trash2,
          label: 'Clear Cache',
          description: 'Remove temporary files and free up space',
          hasArrow: true
        },
      ]
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help & Support',
          description: 'Get help with common issues',
          hasArrow: true
        },
        {
          icon: FileText,
          label: 'Terms of Service',
          description: 'Read our terms and conditions',
          hasArrow: true
        },
        {
          icon: Shield,
          label: 'Privacy Policy',
          description: 'Learn how we protect your data',
          hasArrow: true
        },
        {
          icon: MessageSquare,
          label: 'Send Feedback',
          description: 'Help us improve the app',
          hasArrow: true
        },
      ]
    }
  ];

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences</p>
      </div>

      {/* Profile Card */}
      <Card className="mb-8 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 border-4 border-[var(--teal-200)]">
              {(profileData.userImage && profileData.userImage !== "") && <AvatarImage src={profileData.userImage} />}
              <AvatarFallback>
                {profileData.userName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-1">{profileData.userName || 'Guest User'}</h2>
              <p className="text-muted-foreground mb-3">{user?.email || 'Not logged in'}</p>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className="bg-blue-100 text-blue-700 border-blue-300">Level 5 Learner</Badge>
                <Badge className="bg-purple-100 text-purple-700 border-purple-300">Premium Member</Badge>
              </div>
            </div>
            <Link href="/edit-profile">
              <Button variant="outline" className="rounded-xl">
                <User className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Settings Sections */}
      {settingsSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-8">
          <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
          <Card>
            <CardContent className="p-0">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <div
                    key={itemIndex}
                    className={`flex items-center gap-4 p-4 hover:bg-[var(--teal-50)] transition-colors ${
                      itemIndex !== section.items.length - 1 ? 'border-b border-border' : ''
                    } ${!(item as any).hasToggle ? 'cursor-pointer' : ''}`}
                  >
                    <div className="w-12 h-12 bg-[var(--teal-100)] rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-[var(--teal-600)]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{item.label}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    {(item as any).value && (
                      <span className="text-sm text-muted-foreground mr-3">{(item as any).value}</span>
                    )}
                    {(item as any).hasToggle && (item as any).key && (
                      <Switch
                        checked={Boolean(settings[(item as any).key as keyof typeof settings])}
                        onCheckedChange={() => handleToggle((item as any).key as keyof typeof settings)}
                      />
                    )}
                    {(item as any).hasArrow && (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      ))}

      {/* Danger Zone */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-red-600">Danger Zone</h3>
        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium mb-1">Delete Account</h4>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive" className="rounded-xl">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logout Button */}
      <div className="text-center">
        <Button
          variant="outline"
          className="rounded-xl h-12 text-destructive border-destructive/30 hover:bg-destructive/10 px-8"
          onClick={() => {
            // Clear localStorage and dispatch logout event
            if (typeof window !== 'undefined') {
              localStorage.removeItem('userProfile');
              window.dispatchEvent(new CustomEvent('userLoggedOut', {}));
            }
            onLogout();
          }}
        >
          <SettingsIcon className="w-5 h-5 mr-2" />
          Sign Out
        </Button>
      </div>

      {/* App Version */}
      <div className="text-center mt-8">
        <p className="text-sm text-muted-foreground">
          LazyLearn Version 1.0.0 • Build 2024.10.31
        </p>
      </div>
    </div>
  );
}