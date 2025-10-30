
'use client';

import { useState } from 'react';

interface FocusSetupProps {
  onSessionCreated: (sessionId: string, duration: number) => void;
}

export default function FocusSetup({ onSessionCreated }: FocusSetupProps) {
  const [duration, setDuration] = useState(25); // Default duration in minutes

  const handleStartSession = async () => {
    // In a real application, you would make an API call to the backend
    // const response = await fetch('/api/focus/session', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ durationSet: duration * 60, friends: [] }),
    // });
    // const data = await response.json();
    // const newSessionId = data.sessionId;

    // For demonstration purposes, we'll use a mock session ID
    const mockSessionId = `mock-session-${Date.now()}`;
    console.log(`Starting session with duration: ${duration} minutes.`);
    
    onSessionCreated(mockSessionId, duration * 60);
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center text-gray-800">Setup Focus Session</h1>
      <div className="space-y-2">
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
          Focus Duration (minutes)
        </label>
        <input
          id="duration"
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          min="5"
          max="180"
        />
      </div>
      {/* Placeholder for inviting friends */}
      <div>
        <h3 className="text-lg font-medium text-gray-700">Invite Friends (Optional)</h3>
        <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-md text-center">
          <p className="text-sm text-gray-500">Friend invitation feature coming soon.</p>
        </div>
      </div>
      <button
        onClick={handleStartSession}
        className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Start Focusing
      </button>
    </div>
  );
}
