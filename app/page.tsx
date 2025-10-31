'use client';

import React, { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

import { DesktopSidebar } from './components/DesktopSidebar';
import { DesktopHeader } from './components/DesktopHeader';
import { HomePage } from './components/pages/HomePage';
import { useSidebar } from './contexts/SidebarContext';

function renderPage(
  page: string,
  onNavigate: (next: string, params?: any) => void,
): JSX.Element {
  switch (page) {
    case 'home':
      return <HomePage onNavigate={onNavigate} />;
    default:
      return <HomePage onNavigate={onNavigate} />;
  }
}

export default function Page() {
  const { data: session, status } = useSession();
  const { isExpanded } = useSidebar();
  const [currentPage, setCurrentPage] = useState<string>('home');

  const isAuthenticated = status === 'authenticated';
  const userData = session?.user as any; // Type assertion to handle additional properties

  const handleNavigate = (page: string) => {
    console.log('Navigation from HomePage:', { page });
    setCurrentPage(page);
  };

  const handleLogin = () => {
    // Navigate to login page or open login modal
    window.location.href = '/login';
  };

  const handleRegister = () => {
    // Navigate to register page or open register modal
    window.location.href = '/login';
  };

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
        <DesktopSidebar activePage={currentPage} />
        <main
          className={`min-h-[calc(100vh-5rem)] flex-1 transition-all duration-300 ${
            isExpanded ? 'ml-64' : 'ml-20'
          }`}
        >
          <div className={`max-w-7xl mx-auto w-full transition-all duration-300 ${
            isExpanded ? 'px-8 py-6' : 'px-8 py-6'
          }`}>
            {renderPage(currentPage, handleNavigate)}
          </div>
        </main>
      </div>
    </div>
  );
}
