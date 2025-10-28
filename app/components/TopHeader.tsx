'use client';

import { Bell, Menu, Coins } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface TopHeaderProps {
  userName: string;
  points: number;
  level?: number;
  showMenu?: boolean;
  onMenuClick?: () => void;
}

export function TopHeader({ userName, points, level = 5, showMenu = true, onMenuClick }: TopHeaderProps) {
  return (
    <div className="bg-white border-b border-border px-4 py-3">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center gap-3">
          {showMenu && (
            <button 
              onClick={onMenuClick}
              className="p-2 hover:bg-[var(--teal-50)] rounded-xl transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
          <Avatar className="w-10 h-10 border-2 border-[var(--teal-400)]">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
            <AvatarFallback>{userName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm">{userName}</p>
            <p className="text-xs text-muted-foreground">Level {level}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gradient-to-r from-[var(--yellow)] to-[var(--peach)] px-3 py-1.5 rounded-full">
            <Coins className="w-4 h-4 text-[var(--teal-600)]" />
            <span className="text-sm">{points.toLocaleString()}</span>
          </div>
          <button className="p-2 hover:bg-[var(--teal-50)] rounded-xl transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--coral)] rounded-full"></span>
          </button>
        </div>
      </div>
    </div>
  );
}
