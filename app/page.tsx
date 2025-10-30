'use client';

import React, { useState, useEffect } from 'react';

import { DesktopSidebar } from './components/DesktopSidebar';
import { DesktopHeader } from './components/DesktopHeader';
import { HomePage } from './components/pages/HomePage';
import { FocusPage } from './components/pages/FocusPage';
import { MissionPage } from './components/pages/MissionPage';
import { RewardPage } from './components/pages/RewardPage';
import { ProfilePage } from './components/pages/ProfilePage';
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
import { apiService } from './services/api';

const DEFAULT_PAGE = 'home';

function renderPage(
  page: string,
  onNavigate: (next: string, query?: string) => void,
  isAuthenticated: boolean,
  onLoginSuccess: () => void,
  onLogout: () => void,
  isFirstTimeUser: boolean,
  searchQuery?: string,
): React.ReactElement {
  switch (page) {
    case 'home':
      return <HomePage onNavigate={onNavigate} />;
    case 'focus':
      return <FocusPage />;
    case 'missions':
      return <MissionPage />;
    case 'reward':
      return <RewardPage />;
    case 'profile':
      return isAuthenticated ? <ProfilePage onLogout={onLogout} /> : <LoginPage onNavigate={onNavigate} onLoginSuccess={onLoginSuccess} isFirstTimeUser={isFirstTimeUser} />;
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
  const [currentPage, setCurrentPage] = useState<string>(DEFAULT_PAGE);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken');
      setIsAuthenticated(!!token);
    };

    checkAuthStatus();
  }, []);

  // Check if user has visited before (first-time vs returning user)
  const [isFirstTimeUser, setIsFirstTimeUser] = useState<boolean>(() => {
    // Check localStorage to see if user has visited before
    if (typeof window !== 'undefined') {
      const hasVisited = localStorage.getItem('hasVisitedBefore');
      return !hasVisited; // Returns true if no record found (first time)
    }
    return true; // Default to first-time user for safety
  });

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    // Mark user as having visited before
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  };

  const handleLogout = async () => {
    try {
      // Call API service logout method
      await apiService.logout();

      // Update authentication state
      setIsAuthenticated(false);

      // Navigate to home page
      setCurrentPage('home');

      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);

      // Even if API call fails, still remove token locally and update state
      apiService.removeAuthToken();
      setIsAuthenticated(false);
      setCurrentPage('home');
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

  // Hide sidebar and header when on login page
  const shouldShowLayout = isAuthenticated || currentPage !== 'profile';

  return (
    <div className="flex min-h-screen bg-background">
      {shouldShowLayout && <DesktopSidebar activePage={currentPage} onNavigate={handleNavigate} />}
      <div className={`${shouldShowLayout ? 'ml-64' : ''} flex-1 transition-all duration-300`}>
        {shouldShowLayout && <DesktopHeader userName="John Doe" points={2450} level={5} onNavigate={handleNavigate} />}
        <main className={`${shouldShowLayout ? 'min-h-[calc(100vh-5rem)]' : 'min-h-screen'}`}>
          {renderPage(currentPage, handleNavigate, isAuthenticated, handleLoginSuccess, handleLogout, isFirstTimeUser, searchQuery)}
        </main>
      </div>
    </div>
  );
}
