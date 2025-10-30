'use client';

import { useState } from 'react';
import { Bell, Coins, Search, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Progress } from './ui/progress';

interface DesktopHeaderProps {
  userName: string;
  points: number;
  level?: number;
  onNavigate?: (page: string) => void;
}

export function DesktopHeader({ userName, points, level = 5, onNavigate }: DesktopHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDailyHovered, setIsDailyHovered] = useState(false);
  const [isPetHovered, setIsPetHovered] = useState(false);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      onNavigate?.('search');
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
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[var(--teal-100)] rounded-md transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Daily Progress */}
        <div
          className="hidden lg:flex items-center gap-3 px-4 py-2 bg-[var(--teal-50)] rounded-2xl cursor-pointer"
          onMouseEnter={() => setIsDailyHovered(true)}
          onMouseLeave={() => setIsDailyHovered(false)}
        >
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">
                {isDailyHovered ? 'Daily Goal' : 'Daily'}
              </span>
              <span className="text-xs">3/5 lessons</span>
            </div>
            <div className="relative h-1.5 w-32 overflow-hidden">
              {isPetHovered ? (
                <div className="absolute inset-0 flex items-center justify-center text-2xl transition-all duration-300">
                  🐱
                </div>
              ) : (
                <Progress value={60} className="transition-all duration-300" />
              )}
            </div>
          </div>
          {/* Pet Icon Hover Area */}
          <div
            className="absolute -right-2 top-0 h-full w-8"
            onMouseEnter={() => setIsPetHovered(true)}
            onMouseLeave={() => setIsPetHovered(false)}
          />
        </div>

        {/* Points */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-[var(--yellow)] to-[var(--peach)] px-4 py-2 rounded-full">
          <Coins className="w-5 h-5 text-[var(--teal-600)]" />
          <span>{points.toLocaleString()}</span>
        </div>

        {/* Notifications */}
        <button className="relative p-3 hover:bg-[var(--teal-50)] rounded-xl transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--coral)] rounded-full"></span>
        </button>

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
