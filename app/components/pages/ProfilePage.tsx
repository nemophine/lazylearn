'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Settings, User, Bell, Lock, HelpCircle, LogOut, ChevronRight, Heart, Star, Zap } from 'lucide-react';

interface ProfilePageProps {
  onLogout?: () => void;
}

export function ProfilePage({ onLogout }: ProfilePageProps) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const userData = session?.user;

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut({ redirect: false });
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // If loading, show loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show login prompt
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your profile.</p>
          <button className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const userInitials = userData?.name ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
  const userPoints = 2450; // Default points, can be fetched from database later
  const userLevel = 5; // Default level, can be fetched from database later

  const stats = [
    { label: 'Courses', value: '24' },
    { label: 'Hours', value: '156' },
    { label: 'Rank', value: '#47' },
  ];

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Edit Profile', hasArrow: true },
        { icon: Bell, label: 'Notifications', hasToggle: true, enabled: true },
        { icon: Lock, label: 'Privacy & Security', hasArrow: true },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & Support', hasArrow: true },
        { icon: Settings, label: 'Settings', hasArrow: true },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-8">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-24 h-24 border-4 border-gray-600 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                    {userData?.image ? (
                      <img src={userData.image} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-3xl font-bold text-gray-200">{userInitials}</span>
                    )}
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-2xl font-bold text-white mb-2">{userData?.name || 'User'}</h2>
                    <p className="text-gray-300 text-sm mb-4">{userData?.email || 'user@example.com'}</p>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      <span className="bg-gray-600 text-gray-100 px-3 py-1 rounded-full text-sm">
                        Level {userLevel} Learner
                      </span>
                      <span className="bg-teal-500 text-white px-3 py-1 rounded-full text-sm">
                        {userPoints.toLocaleString()} pts
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-200 text-sm font-medium">Level Progress</span>
                      <span className="text-gray-100 text-sm">{Math.round((userPoints / (userLevel * 1000)) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-teal-400 to-teal-500 rounded-full h-3 transition-all duration-300"
                        style={{ width: `${Math.min((userPoints / (userLevel * 1000)) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pet Box */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-red-500" />
                  My Pet Companion
                </h3>
              </div>
              <div className="p-6">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-8 text-center">
                  <div className="text-6xl mb-4">🐱</div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Mochi</h4>
                  <div className="flex justify-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">Level 3</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-gray-600">Active</span>
                    </div>
                  </div>
                  <div className="w-full bg-white/70 rounded-full h-2 mb-4">
                    <div className="bg-gradient-to-r from-pink-400 to-purple-400 rounded-full h-2" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Happiness: 75%</p>
                  <div className="flex justify-center gap-2">
                    <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors">
                      <Star className="w-4 h-4" />
                    </button>
                    <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors">
                      <Zap className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Settings */}
          <div className="space-y-6">
            {/* Settings Sections */}
            {settingsSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">{section.title}</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {section.items.map((item, itemIndex) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={itemIndex}
                        className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-teal-600" />
                        </div>
                        <span className="flex-1 text-left text-gray-800 text-sm">{item.label}</span>
                        {item.value && (
                          <span className="text-xs text-gray-500">{item.value}</span>
                        )}
                        {item.hasToggle && (
                          <div className="relative">
                            <input
                              type="checkbox"
                              defaultChecked={item.enabled}
                              className="sr-only"
                            />
                            <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${
                              item.enabled ? 'bg-teal-500' : 'bg-gray-300'
                            }`}>
                              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                                item.enabled ? 'translate-x-5' : 'translate-x-0.5'
                              } mt-0.5`}></div>
                            </div>
                          </div>
                        )}
                        {item.hasArrow && (
                          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Recent Achievements</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  {['🏆', '⭐', '🔥', '🎯'].map((emoji, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
                <button className="w-full mt-3 text-center text-teal-600 hover:text-teal-700 text-sm font-medium">
                  View all achievements
                </button>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              {isLoading ? 'Signing Out...' : 'Log Out'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}