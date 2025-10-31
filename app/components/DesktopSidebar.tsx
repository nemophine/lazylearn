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

import { useFocusMode } from '../state/focus-mode-context';

interface SidebarItem {
  id: string;
  icon: typeof Home;
  label: string;
  disabledInFocusMode?: boolean;
}

interface NavItemButtonProps {
  item: SidebarItem;
  isExpanded: boolean;
  isActive: boolean;
  isFocusMode: boolean;
  onNavigate: (page: string) => void;
}

function NavItemButton({
  item,
  isExpanded,
  isActive,
  isFocusMode,
  onNavigate,
}: NavItemButtonProps) {
  const Icon = item.icon;
  const isDisabled = isFocusMode && item.disabledInFocusMode;

  return (
    <button
      onClick={() => {
        if (isDisabled) return;
        onNavigate(item.id);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
        isDisabled
          ? 'text-muted-foreground cursor-not-allowed bg-[var(--teal-50)]'
          : isActive
          ? 'bg-[var(--teal-400)] text-white shadow-md'
          : 'text-foreground hover:bg-[var(--teal-50)]'
      }`}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      title={isDisabled ? 'Focus Mode is on. Community is paused.' : undefined}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
      {isExpanded && <span className="truncate">{item.label}</span>}
    </button>
  );
}

interface NavSectionProps {
  title: string;
  items: SidebarItem[];
  isExpanded: boolean;
  isFocusMode: boolean;
  activePage: string;
  onNavigate: (page: string) => void;
}

function NavSection({
  title,
  items,
  isExpanded,
  isFocusMode,
  activePage,
  onNavigate,
}: NavSectionProps) {
  return (
    <div className="mb-6">
      {isExpanded && (
        <h4 className="px-4 mb-2 text-xs text-muted-foreground uppercase tracking-wide">
          {title}
        </h4>
      )}
      <div className="space-y-1">
        {items.map((item) => (
          <NavItemButton
            key={item.id}
            item={item}
            isExpanded={isExpanded}
            isActive={activePage === item.id}
            isFocusMode={isFocusMode}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
}

interface DesktopSidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export function DesktopSidebar({ activePage, onNavigate }: DesktopSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { isFocusMode } = useFocusMode();

  const mainNavItems: SidebarItem[] = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'focus', icon: Focus, label: 'Focus Mode' },
    { id: 'mission', icon: Target, label: 'Missions' },
    { id: 'reward', icon: Gift, label: 'Rewards' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  const learningItems: SidebarItem[] = [
    { id: 'courses', icon: Video, label: 'Courses' },
    { id: 'game', icon: Gamepad2, label: 'Games & Quiz' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'teacher', icon: GraduationCap, label: 'Line Teacher' },
  ];

  const communityItems: SidebarItem[] = [
    {
      id: 'community',
      icon: MessageSquare,
      label: 'Community',
      disabledInFocusMode: true,
    },
    { id: 'cartoon', icon: Smile, label: 'Cartoon Corner' },
  ];

  const otherItems: SidebarItem[] = [
    { id: 'analysis', icon: BarChart3, label: 'Analysis' },
    { id: 'certificate', icon: Award, label: 'Certificates' },
    { id: 'interaction', icon: Calendar, label: 'My Schedule' },
    { id: 'donation', icon: DollarSign, label: 'Support Us' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

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
        <NavSection
          title="Main"
          items={mainNavItems}
          isExpanded={isExpanded}
          isFocusMode={isFocusMode}
          activePage={activePage}
          onNavigate={onNavigate}
        />
        <NavSection
          title="Learning"
          items={learningItems}
          isExpanded={isExpanded}
          isFocusMode={isFocusMode}
          activePage={activePage}
          onNavigate={onNavigate}
        />
        <NavSection
          title="Community"
          items={communityItems}
          isExpanded={isExpanded}
          isFocusMode={isFocusMode}
          activePage={activePage}
          onNavigate={onNavigate}
        />
        <NavSection
          title="More"
          items={otherItems}
          isExpanded={isExpanded}
          isFocusMode={isFocusMode}
          activePage={activePage}
          onNavigate={onNavigate}
        />
      </div>
    </aside>
  );
}
