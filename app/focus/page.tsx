
'use client';

import { useState } from 'react';
import FocusSetup from './FocusSetup';
import FocusActive from './FocusActive';
import FocusSummary from './components/FocusSummary';
import { usePet } from '../contexts/FocusModeContext';

export type FocusState = 'setup' | 'active' | 'summary';

export default function FocusPage() {
  const [focusState, setFocusState] = useState<FocusState>('setup');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [duration, setDuration] = useState(25 * 60); // Default to 25 mins
  const { pet, loadOrCreatePet } = usePet();

  const handleSessionCreated = (newSessionId: string, newDuration: number) => {
    setSessionId(newSessionId);
    setDuration(newDuration);
    setFocusState('active');
  };

  const handleSessionEnded = () => {
    setFocusState('summary');
  };

  const handleStartNewSession = () => {
    setSessionId(null);
    setDuration(25 * 60);
    setFocusState('setup');
  };

  const handleViewStats = () => {
    // TODO: Navigate to stats page or open stats modal
    console.log('Navigate to stats page');
  };

  // Ensure pet is loaded
  if (!pet) {
    return (
      <div className="container mx-auto p-4 h-full flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading your pet...</h1>
          <button
            onClick={() => loadOrCreatePet()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Initialize Pet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 h-full flex flex-col items-center justify-center min-h-screen">
      {focusState === 'setup' && <FocusSetup onSessionCreated={handleSessionCreated} />}

      {focusState === 'active' && sessionId && (
        <FocusActive
          sessionId={sessionId}
          duration={duration}
          onSessionEnded={handleSessionEnded}
        />
      )}

      {focusState === 'summary' && (
        <FocusSummary
          sessionDuration={duration}
          pet={pet}
          onStartNewSession={handleStartNewSession}
          onViewStats={handleViewStats}
        />
      )}
    </div>
  );
}
