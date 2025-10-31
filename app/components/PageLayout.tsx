'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { DesktopSidebar } from './DesktopSidebar';
import { DesktopHeader } from './DesktopHeader';

interface PageLayoutProps {
  children: React.ReactNode;
  showLayout?: boolean;
}

export function PageLayout({ children, showLayout = true }: PageLayoutProps) {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const userData = session?.user;

  if (!showLayout) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DesktopSidebar activePage="" />
      <div className="ml-64 flex-1 transition-all duration-300">
        <DesktopHeader
          userName={userData?.name || 'John Doe'}
          points={userData?.points || 2450}
          level={userData?.level || 5}
          isAuthenticated={isAuthenticated}
          onNavigate={() => {}}
        />
        <main className="min-h-[calc(100vh-5rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}