'use client';

import { PetStatus as PetStatusType } from '../types/pet';

interface PetStatusProps {
  status: PetStatusType;
}

export default function PetStatus({ status }: PetStatusProps) {
  const percentage = Math.min(100, Math.max(0, (status.value / status.maxValue) * 100));

  const getStatusColor = () => {
    if (percentage >= 70) return 'bg-green-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTextColor = () => {
    if (percentage >= 70) return 'text-green-700';
    if (percentage >= 40) return 'text-yellow-700';
    return 'text-red-700';
  };

  return (
    <div className="mb-2">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{status.icon}</span>
          <span className="text-sm font-medium text-gray-700">{status.label}</span>
        </div>
        <span className={`text-xs font-medium ${getTextColor()}`}>
          {status.value}/{status.maxValue}
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full ${getStatusColor()} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}