'use client';

import { useState } from 'react';

import { DesktopSidebar } from './components/DesktopSidebar';
import { DesktopHeader } from './components/DesktopHeader';
import { HomePage } from './components/pages/HomePage';
import { FocusPage } from './components/pages/FocusPage';
import { MissionPage } from './components/pages/MissionPage';
import { RewardPage } from './components/pages/RewardPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { KnowledgePage } from './components/pages/KnowledgePage';
import { GameQuizPage } from './components/pages/GameQuizPage';
import { SearchPage } from './components/pages/SearchPage';
import { TeacherPage } from './components/pages/TeacherPage';
import { CommunityPage } from './components/pages/CommunityPage';
import { AnalysisPage } from './components/pages/AnalysisPage';
import { CertificatePage } from './components/pages/CertificatePage';
import { InteractionPage } from './components/pages/InteractionPage';
import { DonationPage } from './components/pages/DonationPage';
import { CartoonPage } from './components/pages/CartoonPage';

const DEFAULT_PAGE = 'home';

function renderPage(
  page: string,
  onNavigate: (next: string) => void,
): JSX.Element {
  switch (page) {
    case 'home':
      return <HomePage onNavigate={onNavigate} />;
    case 'focus':
      return <FocusPage />;
    case 'mission':
      return <MissionPage />;
    case 'reward':
      return <RewardPage />;
    case 'profile':
      return <ProfilePage />;
    case 'knowledge':
      return <KnowledgePage />;
    case 'game':
      return <GameQuizPage />;
    case 'search':
      return <SearchPage />;
    case 'teacher':
      return <TeacherPage />;
    case 'community':
      return <CommunityPage />;
    case 'analysis':
      return <AnalysisPage />;
    case 'certificate':
      return <CertificatePage />;
    case 'interaction':
      return <InteractionPage />;
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

  return (
    <div className="flex min-h-screen bg-background">
      <DesktopSidebar activePage={currentPage} onNavigate={setCurrentPage} />
      <div className="ml-64 flex-1 transition-all duration-300">
        <DesktopHeader userName="John Doe" points={2450} level={5} />
        <main className="min-h-[calc(100vh-5rem)]">
          {renderPage(currentPage, setCurrentPage)}
        </main>
      </div>
    </div>
  );
}
