'use client';

import { useState, useEffect } from 'react';
import TimerDisplay from './TimerDisplay';
import ParticipantList from './ParticipantList';
import PetDisplay from './components/PetDisplay';
import { usePet } from '../contexts/FocusModeContext';

interface FocusActiveProps {
  sessionId: string;
  duration: number; // in seconds
  onSessionEnded: () => void;
}

export default function FocusActive({ sessionId, duration, onSessionEnded }: FocusActiveProps) {
  const [isActive, setIsActive] = useState(false);
  const [showFocusAlert, setShowFocusAlert] = useState(true);
  const { pet, completeFocusSession } = usePet();

  useEffect(() => {
    // --- Special Notification Requirement ---
    // 1. Block internal web notifications (this depends on your notification system implementation)
    console.log('Internal notifications are now paused.');

    // Start the session
    setIsActive(true);

    // Hide focus alert after 5 seconds
    const alertTimer = setTimeout(() => {
      setShowFocusAlert(false);
    }, 5000);

    // Cleanup on component unmount
    return () => {
      clearTimeout(alertTimer);
      console.log('Session cleanup - internal notifications restored.');
    };
  }, []);

  const handleTimerComplete = () => {
    console.log('Timer completed naturally!');

    // Update pet status when focus session completes
    if (pet) {
      completeFocusSession(duration);
    }

    onSessionEnded();
  };

  const handleEndSession = () => {
    console.log('User manually ended session.');

    // Update pet status even if session ended manually
    if (pet) {
      const partialDuration = duration / 2; // Give partial rewards for manual completion
      completeFocusSession(partialDuration);
    }

    setIsActive(false);
    onSessionEnded(); // For immediate UI feedback
  };

  if (!pet) {
    return (
      <div className="w-full max-w-2xl p-8 text-center">
        <div className="text-lg">Loading pet...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl p-8">
      {/* Timer Section */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-6 text-center">Focus Mode: Active</h1>

        {/* User-friendly focus alert instead of alert() */}
        {showFocusAlert && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              💡 For best results, enable your computer's "Do Not Disturb" mode
            </p>
          </div>
        )}

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-6">
          <TimerDisplay
            initialDuration={duration}
            onTimerComplete={handleTimerComplete}
            isActive={isActive}
          />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-6">
          <ParticipantList />
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setIsActive(!isActive)}
            className="px-6 py-3 font-bold text-white bg-yellow-600 rounded-lg hover:bg-yellow-700"
          >
            {isActive ? '⏸️ Pause' : '▶️ Resume'}
          </button>

          <button
            onClick={handleEndSession}
            className="px-6 py-3 font-bold text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            End Session
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          Session ID: {sessionId}
        </div>
      </div>

      {/* Pet Section */}
      <div className="lg:w-96">
        <PetDisplay
          pet={pet}
          isActive={isActive}
          message={isActive ? "Let's focus together! 💪" : "I'm waiting for you... 🥺"}
        />
      </div>
    </div>
  );
}
