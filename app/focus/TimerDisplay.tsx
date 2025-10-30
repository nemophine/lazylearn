
'use client';

import { useState, useEffect } from 'react';

interface TimerDisplayProps {
  initialDuration: number; // in seconds
  onTimerComplete?: () => void;
  isActive?: boolean;
}

export default function TimerDisplay({ initialDuration, onTimerComplete, isActive = true }: TimerDisplayProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialDuration);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isActive || secondsLeft <= 0) {
      if (secondsLeft <= 0 && !isComplete && onTimerComplete) {
        setIsComplete(true);
        onTimerComplete();
      }
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          setIsComplete(true);
          if (onTimerComplete) {
            onTimerComplete();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, isActive, onTimerComplete, isComplete]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (secondsLeft <= 60) return 'text-red-600'; // Last minute
    if (secondsLeft <= 300) return 'text-orange-500'; // Last 5 minutes
    return 'text-gray-800';
  };

  return (
    <div className="my-6">
      <p className={`text-8xl font-mono font-bold ${getTimerColor()} transition-colors duration-300`}>
        {formatTime(secondsLeft)}
      </p>
      <p className="text-lg text-gray-500">
        {isComplete ? "🎉 Focus session complete!" :
         secondsLeft <= 60 ? "Almost there! 💪" :
         "Time to focus! 🎯"}
      </p>
    </div>
  );
}
