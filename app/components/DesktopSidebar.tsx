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
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useFocusMode } from '../state/focus-mode-context';

interface SidebarItem {
  id: string;
  icon: typeof Home;
  label: string;
  href: string;
  disabledInFocusMode?: boolean;
}

interface NavItemButtonProps {
  item: SidebarItem;
  isExpanded: boolean;
  isActive: boolean;
  isFocusMode: boolean;
}

function NavItemButton({
  item,
  isExpanded,
  isActive,
  isFocusMode,
}: NavItemButtonProps) {
  const Icon = item.icon;
  const isDisabled = isFocusMode && item.disabledInFocusMode;

  if (isDisabled) {
    return (
      <div
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-muted-foreground cursor-not-allowed bg-[var(--teal-50)]`}
        title="Focus Mode is on. Community is paused."
      >
        <Icon className="w-5 h-5 flex-shrink-0 stroke-2" />
        {isExpanded && <span className="truncate">{item.label}</span>}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
        isActive
          ? 'bg-[var(--teal-400)] text-white shadow-md'
          : 'text-foreground hover:bg-[var(--teal-50)]'
      }`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
      {isExpanded && <span className="truncate">{item.label}</span>}
    </Link>
  );
}

interface NavSectionProps {
  title: string;
  items: SidebarItem[];
  isExpanded: boolean;
  isFocusMode: boolean;
  activePathname: string;
}

function NavSection({
  title,
  items,
  isExpanded,
  isFocusMode,
  activePathname,
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
            isActive={activePathname === item.href}
            isFocusMode={isFocusMode}
          />
        ))}
      </div>
    </div>
  );
}

interface DesktopSidebarProps {
  activePage: string;
}

export function DesktopSidebar({ activePage }: DesktopSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { isFocusMode } = useFocusMode();
  const pathname = usePathname();

  const mainNavItems: SidebarItem[] = [
    { id: 'home', icon: Home, label: 'Home', href: '/' },
    { id: 'focus', icon: Focus, label: 'Focus Mode', href: '/focus' },
    { id: 'mission', icon: Target, label: 'Missions', href: '/missions' },
    { id: 'reward', icon: Gift, label: 'Rewards', href: '/rewards' },
    { id: 'profile', icon: User, label: 'Profile', href: '/profile' },
  ];

  const learningItems: SidebarItem[] = [
    { id: 'courses', icon: Video, label: 'Courses', href: '/courses' },
    { id: 'game', icon: Gamepad2, label: 'Games & Quiz', href: '/game' },
    { id: 'search', icon: Search, label: 'Search', href: '/search' },
    { id: 'teacher', icon: GraduationCap, label: 'Line Teacher', href: '/teacher' },
  ];

  const communityItems: SidebarItem[] = [
    {
      id: 'community',
      icon: MessageSquare,
      label: 'Community',
      href: '/community',
      disabledInFocusMode: true,
    },
    { id: 'cartoon', icon: Smile, label: 'Cartoon Corner', href: '/cartoon' },
  ];

  const otherItems: SidebarItem[] = [
    { id: 'analysis', icon: BarChart3, label: 'Analysis', href: '/analysis' },
    { id: 'certificate', icon: Award, label: 'Certificates', href: '/certificates' },
    { id: 'interaction', icon: Calendar, label: 'My Schedule', href: '/schedule' },
    { id: 'donation', icon: DollarSign, label: 'Support Us', href: '/donation' },
    { id: 'settings', icon: Settings, label: 'Settings', href: '/settings' },
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
          activePathname={pathname}
        />
        <NavSection
          title="Learning"
          items={learningItems}
          isExpanded={isExpanded}
          isFocusMode={isFocusMode}
          activePathname={pathname}
        />
        <NavSection
          title="Community"
          items={communityItems}
          isExpanded={isExpanded}
          isFocusMode={isFocusMode}
          activePathname={pathname}
        />
        <NavSection
          title="More"
          items={otherItems}
          isExpanded={isExpanded}
          isFocusMode={isFocusMode}
          activePathname={pathname}
        />
      </div>
    </aside>
  );
}
