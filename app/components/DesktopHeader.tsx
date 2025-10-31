'use client';

import React, { useState, useEffect } from 'react';
import { Bell, BookOpen, Coins, Lock, Search, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { useFocusMode } from '../state/focus-mode-context';
import { useSidebar } from '../contexts/SidebarContext';

interface DesktopHeaderProps {
  userName: string;
  points: number;
  level?: number;
  userImage?: string;
  isAuthenticated?: boolean;
  onLogin?: () => void;
  onRegister?: () => void;
}

export function DesktopHeader({ userName, points, level = 5, userImage, isAuthenticated = true, onLogin, onRegister }: DesktopHeaderProps) {
  const { isFocusMode } = useFocusMode();
  const { isExpanded } = useSidebar();
  const [isHovering, setIsHovering] = useState(false);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);

  // State for dynamically updated profile data
  const [profileData, setProfileData] = useState({ userName, userImage });

  // Load profile data from localStorage and listen for updates
  useEffect(() => {
    // Load initial profile data
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        try {
          const profile = JSON.parse(savedProfile);
          setProfileData({
            userName: profile.name || userName,
            userImage: profile.image || userImage
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
        userName: updatedProfile.name || userName,
        userImage: updatedProfile.image || userImage
      });
    };

    // Add event listener
    window.addEventListener('profileUpdated', handleProfileUpdate as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate as EventListener);
    };
  }, [userName, userImage]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showGuestDropdown) {
        const target = event.target as Element;
        if (!target.closest('.guest-dropdown-container')) {
          setShowGuestDropdown(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showGuestDropdown]);

  return (
    <div className="h-20 bg-white border-b border-border px-8 flex items-center">
      {/* Left Section - Logo */}
      <div className={`flex items-center gap-3 mr-8 transition-all duration-300 ${
        isExpanded ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
      }`}>
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-gradient-to-br from-[var(--teal-400)] to-[var(--teal-300)] rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">LearnHub</span>
        </Link>
      </div>

      {/* Center Section - Search Bar */}
      <div className="flex-1 max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search lessons, courses, teachers..."
            className="pl-10 bg-[var(--teal-50)] border border-[var(--teal-200)] rounded-2xl h-12 w-full"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Daily Progress */}
        <div className="hidden lg:flex relative group">
          <Link
            href="/missions"
            className="flex items-center gap-2 px-3 py-2 bg-[var(--teal-50)] rounded-2xl cursor-pointer hover:bg-[var(--teal-100)] transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[var(--teal-500)] rounded-full"></div>
              <span className="text-sm font-medium">Daily Goal</span>
            </div>
            <span className="text-xs text-muted-foreground ml-2">60%</span>
          </Link>

          {/* Hover Details */}
          <div className="absolute top-full right-0 mt-2 w-64 p-4 bg-white border border-[var(--teal-200)] rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
            <h4 className="font-semibold mb-3 text-sm">Today's Missions</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Complete 2 Math lessons</span>
                </div>
                <span className="text-green-600">✓</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Read Chapter 3</span>
                </div>
                <span className="text-green-600">✓</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Practice Python coding</span>
                </div>
                <span className="text-green-600">✓</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[var(--teal-500)] rounded-full"></div>
                  <span>Review Science notes</span>
                </div>
                <span className="text-[var(--teal-600)]">In progress</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span>Complete History quiz</span>
                </div>
                <span className="text-gray-400">○</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-[var(--teal-100)]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-[var(--teal-600)]">3 of 5 completed</span>
              </div>
              <Progress value={60} className="h-2 mt-2" />
            </div>
          </div>
        </div>

        {/* Points */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-[var(--yellow)] to-[var(--peach)] px-4 py-2 rounded-full">
          <Coins className="w-5 h-5 text-[var(--teal-600)]" />
          <span>{points.toLocaleString()}</span>
        </div>

        {/* Notifications */}
        {isFocusMode ? (
          <div
            className="relative p-3 rounded-xl bg-[var(--teal-50)] text-muted-foreground cursor-not-allowed"
            title="Focus Mode active. Notifications are paused."
            aria-disabled
          >
            <Bell className="w-5 h-5" />
          </div>
        ) : (
          <button className="relative p-3 hover:bg-[var(--teal-50)] rounded-xl transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--coral)] rounded-full"></span>
          </button>
        )}

        {isFocusMode && (
          <div className="flex items-center gap-2 px-4 py-2 bg-[var(--teal-100)] text-[var(--teal-700)] rounded-full">
            <Lock className="w-4 h-4" />
            <span className="text-sm">Focus Mode On</span>
          </div>
        )}

        {/* User Profile / Guest */}
        {isAuthenticated ? (
          <Link
            href="/profile"
            className="flex items-center gap-3 pl-4 border-l border-border hover:bg-[var(--teal-50)] rounded-2xl px-3 py-2 transition-all cursor-pointer group"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="relative">
              <Avatar className="w-10 h-10 border-2 border-[var(--teal-400)]">
                {(profileData.userImage && profileData.userImage !== "") && <AvatarImage src={profileData.userImage} />}
                <AvatarFallback>{profileData.userName[0]}</AvatarFallback>
              </Avatar>
              {/* Settings Icon Overlay - appears on hover */}
              <div className={`absolute -bottom-1 -right-1 bg-[var(--teal-500)] text-white rounded-full p-1 transition-all duration-200 ${
                isHovering ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}>
                <Settings className="w-3 h-3" />
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium group-hover:text-[var(--teal-700)] transition-colors">{profileData.userName}</p>
              <p className="text-xs text-muted-foreground">Level {level}</p>
            </div>
          </Link>
        ) : (
          <div className="relative guest-dropdown-container">
            <div
              className="flex items-center gap-3 pl-4 border-l border-border hover:bg-[var(--teal-50)] rounded-2xl px-3 py-2 transition-all cursor-pointer group"
              onClick={() => setShowGuestDropdown(!showGuestDropdown)}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="relative">
                <Avatar className="w-10 h-10 border-2 border-[var(--teal-400)]">
                  <AvatarFallback className="bg-[var(--teal-100)] text-[var(--teal-600)]">
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium group-hover:text-[var(--teal-700)] transition-colors">Guest</p>
                <p className="text-xs text-muted-foreground">Click to login</p>
              </div>
            </div>

            {/* Guest Dropdown */}
            {showGuestDropdown && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-[var(--teal-200)] rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="p-2">
                  <button
                    onClick={() => {
                      onLogin?.();
                      setShowGuestDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[var(--teal-50)] rounded-lg transition-colors text-left"
                  >
                    <div className="w-8 h-8 bg-[var(--teal-100)] rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-[var(--teal-600)]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Login</p>
                      <p className="text-xs text-muted-foreground">Access your account</p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      onRegister?.();
                      setShowGuestDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[var(--teal-50)] rounded-lg transition-colors text-left"
                  >
                    <div className="w-8 h-8 bg-[var(--teal-100)] rounded-full flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-[var(--teal-600)]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Register</p>
                      <p className="text-xs text-muted-foreground">Create new account</p>
                    </div>
                  </button>
                </div>
                <div className="border-t border-[var(--teal-100)] p-2">
                  <div className="text-xs text-muted-foreground px-3 py-1">
                    Join to track progress and earn rewards!
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
