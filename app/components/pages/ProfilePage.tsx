'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { User, Bell, Lock, LogOut, ChevronRight, Heart, Sparkles, Star, Trophy, Zap, Target, Award, Crown, Gift, Coins, Medal } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import Link from 'next/link';
import PixelPet from '../PixelPet';

interface ProfilePageProps {
  onLogout?: () => void;
}

export function ProfilePage({ onLogout }: ProfilePageProps) {
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
      setProfileData({
        userName: updatedProfile.name || user?.name || '',
        userImage: updatedProfile.image || user?.image || ''
      });
    };

    // Listen for logout events
    const handleLogoutEvent = () => {
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
    window.addEventListener('userLoggedOut', handleLogoutEvent as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate as EventListener);
      window.removeEventListener('userLoggedOut', handleLogoutEvent as EventListener);
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

  // User badges - in a real app this would come from user data/database
  const userBadges = [
    { id: 'Level 5 Learner', icon: Star, color: 'bg-white/20 text-white border-0', name: 'Level 5 Learner' },
    { id: 'Premium Member', icon: Crown, color: 'bg-white/20 text-white border-0', name: 'Premium Member' },
  ];

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      // Clear localStorage and dispatch logout event
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userProfile');
        // Dispatch logout event for other components
        window.dispatchEvent(new CustomEvent('userLoggedOut', {}));
      }
      if (onLogout) {
        onLogout();
      }
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  const stats = [
    { label: 'Courses', value: '24' },
    { label: 'Hours', value: '156' },
    { label: 'Rank', value: '#47' },
  ];

  // Account settings section
  const settingsSections = [
    {
      title: 'Account Settings',
      items: [
        {
          icon: User,
          label: 'Edit Profile',
          hasArrow: true,
          href: '/edit-profile'
        },
        { icon: Bell, label: 'Notifications', hasToggle: true, enabled: true },
        { icon: Lock, label: 'Privacy & Security', hasArrow: true },
      ]
    },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Profile Header */}
      <Card className="mb-6 bg-gradient-to-br from-[var(--teal-400)] to-[var(--teal-300)] border-0 shadow-lg overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-20 h-20 border-4 border-white">
              {(profileData.userImage && profileData.userImage !== "") && <AvatarImage src={profileData.userImage} />}
              <AvatarFallback>
                {profileData.userName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-white mb-1">{profileData.userName || 'Guest User'}</h2>
              <p className="text-white/90 text-sm mb-2">{user?.email || 'Not logged in'}</p>
              <div className="flex items-center gap-2 flex-wrap">
                {userBadges.map((badge) => {
                  const Icon = badge.icon;
                  return (
                    <Badge key={badge.id} className={badge.color}>
                      <Icon className="w-3 h-3 mr-1" />
                      {badge.name}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/90 text-sm">Level Progress</span>
              <span className="text-white">2,450 / 3,000 pts</span>
            </div>
            <Progress value={82} className="h-2 bg-white/20" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                <p className="text-2xl text-white mb-1">{stat.value}</p>
                <p className="text-xs text-white/90">{stat.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pet Companion Section */}
      <Card className="mb-6 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Pet Companion</h3>
              <p className="text-sm text-muted-foreground">Your learning buddy</p>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500 fill-current" />
              <span className="text-sm font-medium text-red-500">85/100</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[var(--teal-50)] to-[var(--mint)] rounded-2xl p-6 mb-4">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-4xl">🐱</span>
              </div>
              <h4 className="font-semibold mb-2">Whiskers</h4>
              <p className="text-sm text-muted-foreground mb-4">Happy and ready to learn!</p>

              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-[var(--teal-400)] h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className="text-xs text-muted-foreground">Happiness</span>
              </div>

              <div className="flex justify-center gap-2">
                <button className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-lg">🍎</span>
                </button>
                <button className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-lg">🎾</span>
                </button>
                <button className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-lg">📚</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-[var(--teal-50)] rounded-xl p-3">
              <p className="text-2xl mb-1">🎯</p>
              <p className="text-xs text-muted-foreground">Focus</p>
            </div>
            <div className="bg-[var(--teal-50)] rounded-xl p-3">
              <p className="text-2xl mb-1">📈</p>
              <p className="text-xs text-muted-foreground">Progress</p>
            </div>
            <div className="bg-[var(--teal-50)] rounded-xl p-3">
              <p className="text-2xl mb-1">⭐</p>
              <p className="text-xs text-muted-foreground">Points</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Virtual Pet Section */}
      <Card className="mb-6 bg-gradient-to-br from-[var(--teal-50)] to-white border-[var(--teal-200)]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                <Heart className="w-5 h-5 text-[var(--teal-500)]" />
                Your Learning Companion
              </h3>
              <p className="text-sm text-muted-foreground">Your virtual pet grows as you learn!</p>
            </div>
            <Link href="/focus">
              <Button variant="outline" size="sm" className="border-[var(--teal-300)] text-[var(--teal-600)] hover:bg-[var(--teal-50)]">
                Visit Focus Mode
              </Button>
            </Link>
          </div>

          <div className="flex justify-center">
            <PixelPet
              isFocusActive={false}
              focusTime={0}
              onStatsUpdate={(stats) => {
                console.log('Pet stats updated in profile:', stats);
              }}
            />
          </div>

          <div className="text-center mt-4">
            <p className="text-xs text-muted-foreground">
              Your companion thrives when you're in focus mode! 🌱
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Section */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[var(--teal-500)]" />
                Achievements
              </h3>
              <p className="text-sm text-muted-foreground">Your learning milestones</p>
            </div>
            <button className="text-sm text-[var(--teal-500)] hover:text-[var(--teal-600)] transition-colors">
              View all
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-4">
            {[
              { title: 'First Course', desc: 'Complete your first course', unlocked: true },
              { title: '7-Day Streak', desc: 'Learn for 7 days straight', unlocked: true },
              { title: 'Quick Learner', desc: 'Finish 5 lessons in one day', unlocked: true },
              { title: 'Perfect Score', desc: 'Get 100% on a quiz', unlocked: false }
            ].map((achievement, index) => (
              <div
                key={index}
                className={`text-center group cursor-pointer transition-all ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-[var(--yellow)] to-[var(--peach)] shadow-md hover:shadow-lg hover:scale-105'
                    : 'bg-gray-100 opacity-50'
                } rounded-2xl p-4`}
              >
                <h4 className={`text-sm font-medium mb-1 ${
                  achievement.unlocked ? 'text-gray-800' : 'text-gray-500'
                }`}>
                  {achievement.title}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {achievement.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between p-4 bg-[var(--teal-50)] rounded-xl">
            <div>
              <p className="text-sm font-medium text-[var(--teal-700)]">Next Achievement</p>
              <p className="text-xs text-[var(--teal-600)]">Complete 3 more courses</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-[var(--teal-400)] h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <span className="text-xs text-[var(--teal-600)] ml-2">3/5</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Settings Section */}
      <Card className="mb-6">
        <CardContent className="p-0">
          {settingsSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <div className="p-4 border-b border-border">
                <h3 className="text-lg font-semibold">{section.title}</h3>
              </div>
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;

                return item.href ? (
                  <Link
                    key={itemIndex}
                    href={item.href}
                    className={`flex items-center gap-4 p-4 hover:bg-[var(--teal-50)] transition-colors cursor-pointer ${
                      itemIndex !== section.items.length - 1 ? 'border-b border-border' : ''
                    }`}
                  >
                    <div className="w-12 h-12 bg-[var(--teal-100)] rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-[var(--teal-600)]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.label}</h4>
                    </div>
                    {item.hasToggle && (
                      <Switch
                        checked={(item as any).enabled || false}
                        onCheckedChange={() => {}}
                      />
                    )}
                    {item.hasArrow && (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </Link>
                ) : (
                  <div
                    key={itemIndex}
                    className={`flex items-center gap-4 p-4 hover:bg-[var(--teal-50)] transition-colors cursor-pointer ${
                      itemIndex !== section.items.length - 1 ? 'border-b border-border' : ''
                    }`}
                  >
                    <div className="w-12 h-12 bg-[var(--teal-100)] rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-[var(--teal-600)]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.label}</h4>
                      {(item as any).description && (
                        <p className="text-sm text-muted-foreground">{(item as any).description}</p>
                      )}
                    </div>
                    {item.hasToggle && (
                      <Switch
                        checked={(item as any).enabled || false}
                        onCheckedChange={() => {}}
                      />
                    )}
                    {item.hasArrow && (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Logout Button */}
      <Button
        variant="outline"
        className="w-full rounded-2xl h-12 text-destructive border-destructive/30 hover:bg-destructive/10"
        onClick={handleLogout}
      >
        <LogOut className="w-5 h-5 mr-2" />
        Log Out
      </Button>
    </div>
  );
}
