'use client';

import React, { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

import { DesktopSidebar } from './components/DesktopSidebar';
import { DesktopHeader } from './components/DesktopHeader';
import { HomePage } from './components/pages/HomePage';

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
  const [currentPage, setCurrentPage] = useState<string>('home');

  const isAuthenticated = status === 'authenticated';
  const userData = session?.user;

  const handleNavigate = (page: string) => {
    console.log('Navigation from HomePage:', { page });
    setCurrentPage(page);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DesktopSidebar activePage={currentPage} />
      <div className="ml-64 flex-1 transition-all duration-300">
        <DesktopHeader
          userName={userData?.name || 'John Doe'}
          points={userData?.points || 2450}
          level={userData?.level || 5}
          userImage={userData?.image}
        />
        <main className="min-h-[calc(100vh-5rem)]">
          {renderPage(currentPage, handleNavigate)}
        </main>
      </div>
    </div>
  );
}
