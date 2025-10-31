'use client';

import { Bell, Coins, Lock, Search, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { useFocusMode } from '../state/focus-mode-context';

interface DesktopHeaderProps {
  userName: string;
  points: number;
  level?: number;
  userImage?: string;
}

export function DesktopHeader({ userName, points, level = 5, userImage }: DesktopHeaderProps) {
  const { isFocusMode } = useFocusMode();
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="h-20 bg-white border-b border-border px-8 flex items-center justify-between">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search lessons, courses, teachers..."
            className="pl-10 bg-[var(--teal-50)] border-0 rounded-2xl h-12"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Daily Progress */}
        <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-[var(--teal-50)] rounded-2xl">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Daily Goal</span>
              <span className="text-xs">3/5 lessons</span>
            </div>
            <Progress value={60} className="h-1.5 w-32" />
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

        {/* User Profile */}
        <Link
          href="/profile"
          className="flex items-center gap-3 pl-4 border-l border-border hover:bg-[var(--teal-50)] rounded-2xl px-3 py-2 transition-all cursor-pointer group"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="relative">
            <Avatar className="w-10 h-10 border-2 border-[var(--teal-400)]">
              {(userImage && userImage !== "") && <AvatarImage src={userImage} />}
              <AvatarFallback>{userName[0]}</AvatarFallback>
            </Avatar>
            {/* Settings Icon Overlay - appears on hover */}
            <div className={`absolute -bottom-1 -right-1 bg-[var(--teal-500)] text-white rounded-full p-1 transition-all duration-200 ${
              isHovering ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}>
              <Settings className="w-3 h-3" />
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium group-hover:text-[var(--teal-700)] transition-colors">{userName}</p>
            <p className="text-xs text-muted-foreground">Level {level}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
