'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface AudioTrack {
  title: string;
  duration: string;
  mood: string;
  file: string;
}

interface AudioPlayerProps {
  track: AudioTrack;
  isSelected: boolean;
  onSelect: () => void;
}

export default function AudioPlayer({ track, isSelected, onSelect }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Create a simple beep sound for testing
  const createTestAudio = () => {
    // Create a simple tone using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 440; // A4 note
    gainNode.gain.value = 0.1; // Low volume

    return { oscillator, gainNode, audioContext };
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;
    audio.loop = true; // Loop for focus sessions

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      // Only show error for real audio files, not for 'beep'
      if (track.file !== 'beep') {
        setError('Audio loading error');
      }
      setIsLoading(false);
      setIsPlaying(false);
    };
    const handleEnded = () => {
      // Audio will loop, so keep playing state
      if (!audio.loop) {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [volume, isMuted]);

  const togglePlayPause = async () => {
    try {
      if (isPlaying) {
        // Stop any playing audio
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setIsPlaying(false);
      } else {
        if (track.file === 'beep') {
          // Play test beep using Web Audio API
          const { oscillator, gainNode, audioContext } = createTestAudio();

          oscillator.start();
          setIsPlaying(true);

          // Play for 1 second then stop
          setTimeout(() => {
            oscillator.stop();
            audioContext.close();
            setIsPlaying(false);
          }, 1000);

          setError(null);
        } else {
          // Try to play audio file
          const audio = audioRef.current;
          if (!audio) return;

          // Load audio if not loaded
          if (audio.readyState === 0) {
            setIsLoading(true);
            await audio.load();
          }
          await audio.play();
          setIsPlaying(true);
          setError(null);
        }
      }
    } catch (err) {
      setError(`Failed to play audio: ${err}`);
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  // Stop playing when track is deselected
  useEffect(() => {
    if (!isSelected && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isSelected]);

  return (
    <div className="relative">
      <audio
        ref={audioRef}
        src={track.file}
        preload="metadata"
      />

      <div
        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
          isSelected
            ? 'border-teal-400 shadow-md bg-teal-50'
            : 'border-teal-200 hover:border-teal-300'
        }`}
        onClick={onSelect}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
              isSelected
                ? 'bg-teal-400 text-white'
                : 'bg-teal-100 text-teal-500'
            }`}
            disabled={!isSelected}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{track.title}</p>
            <p className="text-xs text-muted-foreground">{track.mood}</p>
            <p className="text-xs text-muted-foreground">{track.duration}</p>
          </div>

          {isSelected && (
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                className="p-1 rounded hover:bg-teal-100 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-teal-500" />
                ) : (
                  <Volume2 className="w-4 h-4 text-teal-500" />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 slider-thumb-left"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
        </div>

        {error && (
          <div className="mt-2 text-xs text-red-500">
            {error}
          </div>
        )}

        {!error && !isSelected && (
          <div className="text-xs text-gray-400 mt-1">
            Click to select this track
          </div>
        )}
      </div>
    </div>
  );
}