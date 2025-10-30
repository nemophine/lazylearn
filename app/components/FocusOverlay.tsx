'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, Lock, Unlock, Music, Clock, Volume2, X } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import ProfessionalAudioPlayer from './ProfessionalAudioPlayer';

interface FocusOverlayProps {
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

export default function FocusOverlay({
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
}: FocusOverlayProps) {
  const [showMusicControls, setShowMusicControls] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMinimized, setIsMinimized] = useState(false);

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    if (!isRunning) return;

    const timer = setTimeout(() => {
      setIsMinimized(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isRunning]);

  const handleMouseMove = () => {
    setIsMinimized(false);
  };

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
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
      onMouseMove={handleMouseMove}
    >
      {/* Main Focus Overlay */}
      <div
        className={`bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 transition-all duration-300 ${
          isMinimized ? 'scale-95 opacity-90' : 'scale-100 opacity-100'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <h2 className="text-lg font-bold text-gray-900">Focus Mode Active</h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isLocked ? "destructive" : "secondary"}>
              {isLocked ? "🔒 LOCKED" : "🔓 UNLOCKED"}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Timer Display */}
        <div className="text-center mb-6">
          <div className="text-5xl font-mono font-bold text-gray-900 mb-2">
            {timeDisplay}
          </div>
          <p className="text-sm text-gray-500">
            Stay focused and productive
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <Progress
            value={((25 * 60 - time) / (25 * 60)) * 100}
            className="h-3"
          />
        </div>

        {/* Quick Controls */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Button
            onClick={onPausePlay}
            className="flex items-center gap-2 justify-center"
            variant={isLocked ? "secondary" : "default"}
            disabled={isLocked}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="text-xs">{isRunning ? 'Pause' : 'Play'}</span>
          </Button>

          <Button
            onClick={onLockToggle}
            className={`flex items-center gap-2 justify-center ${
              isLocked ? 'bg-red-500 hover:bg-red-600' : 'bg-teal-500 hover:bg-teal-600'
            } text-white`}
          >
            {isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span className="text-xs">{isLocked ? 'Unlock' : 'Lock'}</span>
          </Button>

          <Button
            onClick={() => setShowMusicControls(!showMusicControls)}
            className={`flex items-center gap-2 justify-center ${
              showMusicControls ? 'bg-teal-500 hover:bg-teal-600' : 'bg-gray-500 hover:bg-gray-600'
            } text-white`}
          >
            <Music className="w-4 h-4" />
            <span className="text-xs">Music</span>
          </Button>
        </div>

        {/* Music Controls (shown when music button is clicked) */}
        {showMusicControls && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Ambient Music</h3>
            <div className="space-y-2">
              {focusTracks.map((track: any, index: number) => (
                <button
                  key={index}
                  onClick={() => onMusicSelect(index)}
                  className={`w-full text-left p-2 rounded-lg border transition-colors ${
                    selectedMusic === index
                      ? 'border-teal-400 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{track.title}</p>
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
              <div className="mt-4">
                <ProfessionalAudioPlayer
                  track={focusTracks[selectedMusic]}
                  isSelected={true}
                  onSelect={() => {}}
                />
              </div>
            )}
          </div>
        )}

        {/* Session Progress */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Session Progress</span>
            <span className="font-medium text-gray-900">
              {Math.round(((25 * 60 - time) / (25 * 60)) * 100)}%
            </span>
          </div>
        </div>

        {/* Focus Tips */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-800">
            💡 Tip: Take short breaks between focus sessions to maintain productivity
          </p>
        </div>

        {/* Enhanced Focus Mode Features */}
        {isLocked && (
          <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <h4 className="text-xs font-semibold text-red-800 mb-2">🛡️ Enhanced Focus Mode Active</h4>
            <ul className="text-xs text-red-700 space-y-1">
              <li>• Tab switching and navigation blocked</li>
              <li>• Copy/paste functions disabled</li>
              <li>• Context menu and shortcuts restricted</li>
              <li>• Page close protection enabled</li>
              <li>• Stay focused - you're doing great! 💪</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}