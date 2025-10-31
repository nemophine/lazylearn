'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { DesktopSidebar } from './DesktopSidebar';
import { DesktopHeader } from './DesktopHeader';
import { useSidebar } from '../contexts/SidebarContext';

interface PageLayoutProps {
  children: React.ReactNode;
  showLayout?: boolean;
  activePage?: string;
}

export function PageLayout({ children, showLayout = true, activePage = '' }: PageLayoutProps) {
  const { data: session } = useSession();
  const { isExpanded } = useSidebar();
  const isAuthenticated = !!session?.user;
  const userData = session?.user as any; // Type assertion to handle additional properties

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleRegister = () => {
    window.location.href = '/login';
  };

  if (!showLayout) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Full-Width Header */}
      <DesktopHeader
        userName={userData?.name || 'John Doe'}
        points={userData?.points || 2450}
        level={userData?.level || 5}
        userImage={userData?.image}
        isAuthenticated={isAuthenticated}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />

      {/* Main Content Area with Sidebar */}
      <div className="flex relative">
        <DesktopSidebar activePage={activePage} />
        <main
          className={`min-h-[calc(100vh-5rem)] flex-1 transition-all duration-300 ${
            isExpanded ? 'ml-64' : 'ml-20'
          }`}
        >
          <div className={`max-w-7xl mx-auto w-full transition-all duration-300 ${
            isExpanded ? 'px-8 py-6' : 'px-8 py-6'
          }`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}