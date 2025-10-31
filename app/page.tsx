'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

import { DesktopSidebar } from './components/DesktopSidebar';
import { DesktopHeader } from './components/DesktopHeader';
import { HomePage } from './components/pages/HomePage';
import { FocusPage } from './components/pages/FocusPage';
import { MissionPage } from './components/pages/MissionPage';
import { RewardPage } from './components/pages/RewardPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { SettingsPage } from './components/pages/SettingsPage';
import { KnowledgePage } from './components/pages/KnowledgePage';
import { CoursePage } from './components/pages/CoursePage';
import { GameQuizPage } from './components/pages/GameQuizPage';
import { SearchPage } from './components/pages/SearchPage';
import { TeacherPage } from './components/pages/TeacherPage';
import { CommunityPage } from './components/pages/CommunityPage';
import { AnalysisPage } from './components/pages/AnalysisPage';
import { CertificatePage } from './components/pages/CertificatePage';
import { InteractionPage } from './components/pages/InteractionPage';
import { SchedulePage } from './components/pages/SchedulePage';
import { DonationPage } from './components/pages/DonationPage';
import { CartoonPage } from './components/pages/CartoonPage';
import { LoginPage } from './components/pages/LoginPage';

const DEFAULT_PAGE = 'home';

function renderPage(
  page: string,
  onNavigate: (next: string, query?: string) => void,
  isAuthenticated: boolean,
  onLoginSuccess: () => void,
  onLogout: () => void,
  onGoogleSignIn: () => void,
  onLineSignIn: () => void,
  isFirstTimeUser: boolean,
  searchQuery?: string,
): JSX.Element {
  switch (page) {
    case 'home':
      return <HomePage onNavigate={onNavigate} />;
    case 'focus':
      return <FocusPage />;
    case 'missions':
      return <MissionPage />;
    case 'reward':
      return <RewardPage />;
    case 'login':
      return <LoginPage onNavigate={onNavigate} onLoginSuccess={onLoginSuccess} onGoogleSignIn={onGoogleSignIn} onLineSignIn={onLineSignIn} isFirstTimeUser={false} />;
    case 'register':
      return <LoginPage onNavigate={onNavigate} onLoginSuccess={onLoginSuccess} onGoogleSignIn={onGoogleSignIn} onLineSignIn={onLineSignIn} isFirstTimeUser={true} />;
    case 'profile':
      return isAuthenticated ? <ProfilePage onLogout={onLogout} /> : <LoginPage onNavigate={onNavigate} onLoginSuccess={onLoginSuccess} onGoogleSignIn={onGoogleSignIn} onLineSignIn={onLineSignIn} isFirstTimeUser={isFirstTimeUser} />;
    case 'settings':
      return isAuthenticated ? <SettingsPage onLogout={onLogout} /> : <LoginPage onNavigate={onNavigate} onLoginSuccess={onLoginSuccess} onGoogleSignIn={onGoogleSignIn} onLineSignIn={onLineSignIn} isFirstTimeUser={isFirstTimeUser} />;
    case 'knowledge':
      return <KnowledgePage />;
    case 'courses':
      return <CoursePage onNavigate={onNavigate} />;
    case 'game':
      return <GameQuizPage />;
    case 'search':
      return <SearchPage initialQuery={searchQuery} onNavigate={onNavigate} />;
    case 'teacher':
      return <TeacherPage />;
    case 'community':
      return <CommunityPage />;
    case 'analysis':
      return <AnalysisPage />;
    case 'certificate':
      return <CertificatePage />;
    case 'interaction':
      return <SchedulePage onNavigate={onNavigate} />;
    case 'donation':
      return <DonationPage />;
    case 'cartoon':
      return <CartoonPage />;
    default:
      return <HomePage onNavigate={onNavigate} />;
  }
}

export default function Page() {
  const { data: session, status } = useSession();
  const [currentPage, setCurrentPage] = useState<string>(DEFAULT_PAGE);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const isAuthenticated = status === 'authenticated';
  const userData = session?.user;

  // Check if user has visited before (first-time vs returning user)
  const [isFirstTimeUser, setIsFirstTimeUser] = useState<boolean>(() => {
    // Check localStorage to see if user has visited before
    if (typeof window !== 'undefined') {
      const hasVisited = localStorage.getItem('hasVisitedBefore');
      return !hasVisited; // Returns true if no record found (first time)
    }
    return true; // Default to first-time user for safety
  });

  const handleLoginSuccess = async () => {
    // Mark user as having visited before
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      setCurrentPage('home');
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      console.error('Google sign in failed:', error);
    }
  };

  const handleLineSignIn = async () => {
    try {
      await signIn('line', { callbackUrl: '/' });
    } catch (error) {
      console.error('LINE sign in failed:', error);
    }
  };

  const handleNavigate = (page: string, query?: string) => {
    console.log('Main navigation called:', { page, query });
    setCurrentPage(page);
    if (query) {
      setSearchQuery(query);
    } else {
      // Clear search query when navigating without a query
      setSearchQuery('');
    }
  };

  // Hide sidebar and header when on auth pages
  const shouldShowLayout = isAuthenticated || (currentPage !== 'profile' && currentPage !== 'login' && currentPage !== 'register' && currentPage !== 'settings');

  return (
    <div className="flex min-h-screen bg-background">
      {shouldShowLayout && <DesktopSidebar activePage={currentPage} onNavigate={handleNavigate} />}
      <div className={`${shouldShowLayout ? 'ml-64' : ''} flex-1 transition-all duration-300`}>
        {shouldShowLayout && <DesktopHeader
          userName={userData?.name || 'John Doe'}
          points={userData?.points || 2450}
          level={userData?.level || 5}
          isAuthenticated={isAuthenticated}
          onNavigate={handleNavigate}
        />}
        <main className={`${shouldShowLayout ? 'min-h-[calc(100vh-5rem)]' : 'min-h-screen'}`}>
          {renderPage(currentPage, handleNavigate, isAuthenticated, handleLoginSuccess, handleLogout, handleGoogleSignIn, handleLineSignIn, isFirstTimeUser, searchQuery)}
        </main>
      </div>
    </div>
  );
}
