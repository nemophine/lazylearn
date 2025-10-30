'use client';

<<<<<<< HEAD
import { Bell, Coins, Lock, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { useFocusMode } from '../state/focus-mode-context';
=======
import { useState } from 'react';
import { Bell, Coins, Search, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { getDirectNavigation } from '../utils/searchData';
>>>>>>> schedule-feature

interface DesktopHeaderProps {
  userName: string;
  points: number;
  level?: number;
  onNavigate?: (page: string, searchQuery?: string) => void;
}

<<<<<<< HEAD
export function DesktopHeader({ userName, points, level = 5 }: DesktopHeaderProps) {
  const { isFocusMode } = useFocusMode();
=======
export function DesktopHeader({ userName, points, level = 5, onNavigate }: DesktopHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      // Check for direct navigation first
      const directRoute = getDirectNavigation(searchQuery);

      if (directRoute) {
        // Navigate directly to the page
        onNavigate?.(directRoute);
      } else {
        // No direct match, go to search page with results
        onNavigate?.('search', searchQuery);
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };
>>>>>>> schedule-feature

  return (
    <div className="h-20 bg-white border-b border-border px-8 flex items-center justify-between">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            placeholder="Search lessons, courses, teachers..."
            className="pl-10 pr-10 bg-[var(--teal-50)] border-0 rounded-2xl h-12"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 hover:bg-[var(--teal-100)] rounded-md transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Daily Progress */}
        <div className="hidden lg:flex">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onNavigate?.('missions')}
                  className="flex items-center gap-3 px-4 py-2 bg-[var(--teal-50)] rounded-2xl text-foreground hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  <span className="text-sm font-medium">Daily Goal</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-white border-[var(--teal-200)] shadow-lg">
                <div className="text-center p-2">
                  <p className="mb-2 text-sm font-medium">Today's Progress</p>
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-xs text-muted-foreground mr-2">60%</span>
                    <Progress value={60} className="h-2 w-20" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">Complete 2 more lessons to reach your daily goal!</p>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-lg">🐱</span>
                    <span className="text-xs text-muted-foreground">Your pet is waiting for you!</span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
        <button
          onClick={() => onNavigate?.('profile')}
          className="flex items-center gap-3 pl-4 border-l border-border hover:bg-[var(--teal-50)] rounded-xl transition-colors pr-4 py-2"
        >
          <div className="text-right">
            <p className="text-sm">{userName}</p>
            <p className="text-xs text-muted-foreground">Level {level}</p>
          </div>
          <Avatar className="w-10 h-10 border-2 border-[var(--teal-400)]">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
            <AvatarFallback>{userName[0]}</AvatarFallback>
          </Avatar>
        </button>
      </div>
    </div>
  );
}
