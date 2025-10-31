'use client';

import {
  Home,
  Focus,
  Target,
  Gift,
  User,
  Search,
  Video,
  Gamepad2,
  GraduationCap,
  MessageSquare,
  BarChart3,
  Award,
  BookOpen,
  DollarSign,
  Calendar,
  Smile,
  Settings,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

interface DesktopSidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export function DesktopSidebar({ activePage, onNavigate }: DesktopSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const mainNavItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'focus', icon: Focus, label: 'Focus Mode' },
    { id: 'missions', icon: Target, label: 'Missions' },
    { id: 'reward', icon: Gift, label: 'Rewards' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  const learningItems = [
    { id: 'courses', icon: BookOpen, label: 'Courses' },
    { id: 'game', icon: Gamepad2, label: 'Games & Quiz' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'teacher', icon: GraduationCap, label: 'Line Teacher' },
  ];

  const communityItems = [
    { id: 'community', icon: MessageSquare, label: 'Community' },
    { id: 'cartoon', icon: Smile, label: 'Cartoon Corner' },
  ];

  const otherItems = [
    { id: 'analysis', icon: BarChart3, label: 'Analysis' },
    { id: 'certificate', icon: Award, label: 'Certificates' },
    { id: 'interaction', icon: Calendar, label: 'Schedule' },
    { id: 'donation', icon: DollarSign, label: 'Support Us' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const NavItem = ({ item }: { item: typeof mainNavItems[0] }) => {
    const Icon = item.icon;
    const isActive = activePage === item.id;

    return (
      <button
        onClick={() => onNavigate(item.id)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
          isActive
            ? 'bg-[var(--teal-400)] text-white shadow-md'
            : 'text-foreground hover:bg-[var(--teal-50)]'
        }`}
      >
        <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
        {isExpanded && <span className="truncate">{item.label}</span>}
      </button>
    );
  };

  const NavSection = ({ title, items }: { title: string; items: typeof mainNavItems }) => (
    <div className="mb-6">
      {isExpanded && (
        <h4 className="px-4 mb-2 text-xs text-muted-foreground uppercase tracking-wide">
          {title}
        </h4>
      )}
      <div className="space-y-1">
        {items.map((item) => (
          <NavItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r border-border flex flex-col transition-all duration-300 z-40 ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
    >
      {/* Logo/Brand */}
      <div className="h-20 border-b border-border flex items-center justify-between px-4">
        {isExpanded ? (
          <>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--teal-400)] to-[var(--teal-300)] rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg">LearnHub</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 hover:bg-[var(--teal-50)] rounded-xl transition-colors"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsExpanded(true)}
            className="p-2 hover:bg-[var(--teal-50)] rounded-xl transition-colors mx-auto"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-3">
        <NavSection title="Main" items={mainNavItems} />
        <NavSection title="Learning" items={learningItems} />
        <NavSection title="Community" items={communityItems} />
        <NavSection title="More" items={otherItems} />
      </div>
    </aside>
  );
}