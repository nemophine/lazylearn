'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, Lock, Unlock, Music, Clock, Volume2, X } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import ProfessionalAudioPlayer from './ProfessionalAudioPlayer';

interface FocusFloatingButtonProps {
  isRunning: boolean;
  time: number;
  timeDisplay: string;
  selectedMusic: number;
  focusTracks: any[];
  isLocked: boolean;
  onPausePlay: () => void;
  onUnlock: () => void;
  onMusicSelect: (index: number) => void;
  onLockToggle: () => void;
}

export default function FocusFloatingButton({
  isRunning,
  time,
  timeDisplay,
  selectedMusic,
  focusTracks,
  isLocked,
  onPausePlay,
  onUnlock,
  onMusicSelect,
  onLockToggle,
}: FocusFloatingButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMusicControls, setShowMusicControls] = useState(false);

  // Enhanced distraction prevention when locked
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if (isLocked) {
        e.preventDefault();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLocked) {
        // Allow only focus-related keys
        const allowedKeys = ['Space', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        if (!allowedKeys.includes(e.code) && !e.ctrlKey && !e.altKey && !e.metaKey) {
          e.preventDefault();
        }

        // Prevent common distractions
        if (e.code === 'KeyF' && e.ctrlKey && e.shiftKey) e.preventDefault(); // Ctrl+Shift+F (search)
        if (e.code === 'KeyT' && e.ctrlKey) e.preventDefault(); // Ctrl+T (new tab)
        if (e.code === 'KeyW' && e.ctrlKey) e.preventDefault(); // Ctrl+W (close tab)
        if (e.code === 'KeyL' && e.ctrlKey) e.preventDefault(); // Ctrl+L (address bar)
        if (e.code === 'KeyH' && e.ctrlKey) e.preventDefault(); // Ctrl+H (history)
        if (e.code === 'KeyJ' && e.ctrlKey) e.preventDefault(); // Ctrl+J (downloads)
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isLocked && isRunning) {
        e.preventDefault();
        e.returnValue = 'Focus session is active. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    const handleVisibilityChange = () => {
      if (isLocked && isRunning && document.hidden) {
        // User tried to switch tabs/windows
        document.title = '🔒 FOCUS MODE ACTIVE - Return to your session!';
      } else {
        document.title = 'LazyLearn - Focus & Learn';
      }
    };

    const handleCopy = (e: ClipboardEvent) => {
      if (isLocked) {
        e.preventDefault();
      }
    };

    const handleCut = (e: ClipboardEvent) => {
      if (isLocked) {
        e.preventDefault();
      }
    };

    const handlePaste = (e: ClipboardEvent) => {
      if (isLocked) {
        e.preventDefault();
      }
    };

    // Add event listeners for enhanced focus mode
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);
    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('paste', handlePaste);
      document.title = 'LazyLearn - Focus & Learn';
    };
  }, [isLocked, isRunning]);

  if (!isRunning) return null;

  return (
    <>
      {/* Floating Button */}
      <div
        className={`fixed left-4 top-1/2 -translate-y-1/2 z-50 transition-all duration-300 ${
          isExpanded ? 'scale-100' : 'scale-100 hover:scale-105'
        }`}
      >
        {!isExpanded ? (
          <div
            onClick={() => setIsExpanded(true)}
            className="bg-teal-500 hover:bg-teal-600 text-white rounded-full p-4 shadow-lg cursor-pointer transition-all duration-300"
          >
            <div className="flex flex-col items-center gap-2">
              <Clock className="w-6 h-6" />
              <span className="text-xs font-bold">{timeDisplay}</span>
              {isLocked && <Lock className="w-4 h-4 text-red-300" />}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl p-4 w-80">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <h3 className="font-bold text-gray-900">Focus Mode</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>

            {/* Timer Display */}
            <div className="text-center mb-4">
              <div className="text-3xl font-mono font-bold text-gray-900 mb-1">
                {timeDisplay}
              </div>
              <Progress
                value={((25 * 60 - time) / (25 * 60)) * 100}
                className="h-2"
              />
            </div>

            {/* Quick Controls */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <Button
                onClick={onPausePlay}
                className="flex items-center gap-1 justify-center p-2"
                variant={isLocked ? "secondary" : "default"}
                disabled={isLocked}
                size="sm"
              >
                {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </Button>

              <Button
                onClick={onLockToggle}
                className={`flex items-center gap-1 justify-center p-2 ${
                  isLocked ? 'bg-red-500 hover:bg-red-600' : 'bg-teal-500 hover:bg-teal-600'
                } text-white`}
                size="sm"
              >
                {isLocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
              </Button>

              <Button
                onClick={() => setShowMusicControls(!showMusicControls)}
                className={`flex items-center gap-1 justify-center p-2 ${
                  showMusicControls ? 'bg-teal-500 hover:bg-teal-600' : 'bg-gray-500 hover:bg-gray-600'
                } text-white`}
                size="sm"
              >
                <Music className="w-3 h-3" />
              </Button>
            </div>

            {/* Music Controls */}
            {showMusicControls && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Music</h4>
                <div className="space-y-1">
                  {focusTracks.map((track: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => onMusicSelect(index)}
                      className={`w-full text-left p-2 rounded border transition-colors ${
                        selectedMusic === index
                          ? 'border-teal-400 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-gray-900 truncate">{track.title}</p>
                          <p className="text-xs text-gray-500">{track.mood}</p>
                        </div>
                        {track.status === 'Ready to Play' && (
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Professional Audio Player for selected track */}
                {selectedMusic !== null && (
                  <div className="mt-3">
                    <ProfessionalAudioPlayer
                      track={focusTracks[selectedMusic]}
                      isSelected={true}
                      onSelect={() => {}}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Status */}
            <div className="flex items-center justify-between text-xs">
              <Badge variant={isLocked ? "destructive" : "secondary"} className="text-xs">
                {isLocked ? "🔒 LOCKED" : "🔓 UNLOCKED"}
              </Badge>
              <span className="text-gray-500">
                {Math.round(((25 * 60 - time) / (25 * 60)) * 100)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Lock mode overlay */}
      {isLocked && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 pointer-events-none" />
      )}
    </>
  );
}