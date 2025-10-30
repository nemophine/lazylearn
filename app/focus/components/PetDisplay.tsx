'use client';

import { Pet, PetStatus as PetStatusType } from '../types/pet';
import PetStatus from './PetStatus';
import { PET_CONFIGS } from '../types/pet';

interface PetDisplayProps {
  pet: Pet;
  isActive?: boolean;
  message?: string;
}

export default function PetDisplay({ pet, isActive = true, message }: PetDisplayProps) {
  const config = PET_CONFIGS[pet.type];

  const getStatusData = (): PetStatusType[] => [
    {
      label: 'Health',
      value: pet.health,
      maxValue: 100,
      color: 'red',
      icon: '❤️'
    },
    {
      label: 'Hunger',
      value: pet.hunger,
      maxValue: 100,
      color: 'orange',
      icon: '🍖'
    },
    {
      label: 'Energy',
      value: pet.energy,
      maxValue: 100,
      color: 'yellow',
      icon: '⚡'
    },
    {
      label: 'Clean',
      value: pet.clean,
      maxValue: 100,
      color: 'blue',
      icon: '🧼'
    },
    {
      label: 'Happy',
      value: pet.happy,
      maxValue: 100,
      color: 'pink',
      icon: '😊'
    }
  ];

  const getPetMood = () => {
    const averageStatus = (pet.health + pet.hunger + pet.energy + pet.clean + pet.happy) / 5;
    if (averageStatus >= 80) return '😊';
    if (averageStatus >= 60) return '🙂';
    if (averageStatus >= 40) return '😐';
    return '😢';
  };

  const getLevelProgress = () => {
    const expForNextLevel = pet.level * 200;
    const progress = (pet.exp / expForNextLevel) * 100;
    return Math.min(100, progress);
  };

  const getPetMessage = () => {
    if (message) return message;

    if (!isActive) return "Zzz... I'm sleeping 💤";

    const averageStatus = (pet.health + pet.hunger + pet.energy + pet.clean + pet.happy) / 5;
    if (averageStatus >= 80) return "I'm so happy! Let's study together! ✨";
    if (averageStatus >= 60) return "Let's do our best! 💪";
    if (averageStatus >= 40) return "I need some care... 🥺";
    return "Please take care of me... 😢";
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      {/* Pet Header */}
      <div className="text-center mb-4">
        <div className="flex justify-center items-center space-x-4 mb-3">
          <div className="text-5xl animate-bounce">
            {config.emoji}
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-gray-800">{pet.name}</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Level {pet.level}</span>
              <span className="text-2xl">{getPetMood()}</span>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-600">Level Progress</span>
            <span className="text-xs text-gray-600">{pet.exp}/{pet.level * 200} XP</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-500"
              style={{ width: `${getLevelProgress()}%` }}
            />
          </div>
        </div>

        {/* Pet Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-800 italic">
            "{getPetMessage()}"
          </p>
        </div>
      </div>

      {/* Status Bars */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Pet Status</h4>
        {getStatusData().map((status, index) => (
          <PetStatus key={index} status={status} />
        ))}
      </div>

      {/* Focus Status Indicator */}
      {isActive && (
        <div className="mt-4 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Active Focus Session
          </span>
        </div>
      )}
    </div>
  );
}