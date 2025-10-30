'use client';

import { Pet } from '../types/pet';
import { loadStatsData } from '../utils/localStorage';

interface FocusSummaryProps {
  sessionDuration: number;
  pet: Pet;
  onStartNewSession: () => void;
  onViewStats: () => void;
}

export default function FocusSummary({ sessionDuration, pet, onStartNewSession, onViewStats }: FocusSummaryProps) {
  const stats = loadStatsData();
  const minutes = Math.floor(sessionDuration / 60);
  const seconds = sessionDuration % 60;

  const calculateRewards = () => {
    return {
      expGained: Math.floor(sessionDuration / 60) * 10,
      hungerIncrease: 20,
      happyIncrease: 10,
      energyIncrease: 10,
      cleanIncrease: 15,
      healthIncrease: 5
    };
  };

  const rewards = calculateRewards();

  return (
    <div className="w-full max-w-4xl p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          🎉 Focus Session Complete! 🎉
        </h1>
        <p className="text-xl text-gray-700">
          Great job! You stayed focused for {minutes}:{String(seconds).padStart(2, '0')}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Session Results */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Session Results</h2>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-green-800 font-medium">⏱️ Focus Time</span>
              <span className="text-green-800 font-bold">{minutes} min {seconds} sec</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-800 font-medium">⭐ EXP Gained</span>
              <span className="text-blue-800 font-bold">+{rewards.expGained}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-purple-800 font-medium">🔥 Current Streak</span>
              <span className="text-purple-800 font-bold">{stats.currentStreak} days</span>
            </div>
          </div>
        </div>

        {/* Pet Rewards */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">🐾 Pet Rewards</h2>

          <div className="text-center mb-4">
            <div className="text-4xl mb-2">🐱</div>
            <p className="text-lg font-medium text-gray-700">{pet.name} is happy!</p>
            <p className="text-sm text-gray-600">Level {pet.level}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>🍖 Hunger</span>
              <span className="text-green-600 font-medium">+{rewards.hungerIncrease}%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>😊 Happy</span>
              <span className="text-green-600 font-medium">+{rewards.happyIncrease}%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>⚡ Energy</span>
              <span className="text-green-600 font-medium">+{rewards.energyIncrease}%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>🧼 Clean</span>
              <span className="text-green-600 font-medium">+{rewards.cleanIncrease}%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>❤️ Health</span>
              <span className="text-green-600 font-medium">+{rewards.healthIncrease}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200 mb-8">
        <h3 className="text-xl font-bold mb-4 text-gray-800">📊 Your Overall Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.floor(stats.totalFocusTime / 3600)}h
            </div>
            <div className="text-sm text-gray-600">Total Focus</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.sessionsCompleted}
            </div>
            <div className="text-sm text-gray-600">Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {stats.currentStreak}
            </div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {pet.level}
            </div>
            <div className="text-sm text-gray-600">Pet Level</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={onStartNewSession}
          className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
        >
          🎯 New Session
        </button>

        <button
          onClick={onViewStats}
          className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
        >
          📊 View Stats
        </button>
      </div>

      {/* Achievement Notification */}
      {pet.exp >= (pet.level * 200) - rewards.expGained && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <p className="text-yellow-800 font-bold">
            🏆 Achievement Unlocked: Pet reached Level {pet.level}! 🎉
          </p>
        </div>
      )}
    </div>
  );
}