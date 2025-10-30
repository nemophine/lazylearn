'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Repeat } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface AudioTrack {
  title: string;
  duration: string;
  mood: string;
  file: string;
  status: string;
}

interface ProfessionalAudioPlayerProps {
  track: AudioTrack;
  isSelected: boolean;
  onSelect: () => void;
}

export default function ProfessionalAudioPlayer({ track, isSelected, onSelect }: ProfessionalAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Update audio properties
    audio.volume = isMuted ? 0 : volume;
    audio.loop = isLooping;

    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleLoadedMetadata = () => {
      console.log('Audio loaded metadata:', {
        duration: audio.duration,
        src: audio.src,
        readyState: audio.readyState
      });
      if (audio.duration) {
        setDuration(audio.duration);
      }
    };

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      setError('Unable to load audio. Try selecting another track.');
      setIsLoading(false);
      setIsPlaying(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      if (!audio.loop) {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setError(null);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    // Add event listeners
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('error', handleError);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [isLooping, track.file]);

  // Separate useEffect for volume/mute changes to avoid dependency issues
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Add interval to update currentTime more frequently for smooth thumb movement
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && audioRef.current) {
      interval = setInterval(() => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      }, 100); // Update every 100ms for smooth movement
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying]);

  // Function to create ambient sounds based on track type
  const createAmbientSound = (trackType: string) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Set different frequencies for different track types
    switch (trackType) {
      case 'ocean-waves':
        oscillator.frequency.value = 200; // Low frequency for ocean waves
        oscillator.type = 'sine';
        gainNode.gain.value = 0.1;
        break;
      case 'forest-rain':
        oscillator.frequency.value = 400; // Medium frequency for rain
        oscillator.type = 'triangle';
        gainNode.gain.value = 0.08;
        break;
      case 'meditation-music':
        oscillator.frequency.value = 528; // Healing frequency
        oscillator.type = 'sine';
        gainNode.gain.value = 0.12;
        break;
      case 'soft-piano':
        oscillator.frequency.value = 440; // A4 note
        oscillator.type = 'sine';
        gainNode.gain.value = 0.1;
        break;
      default:
        oscillator.frequency.value = 440;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.1;
    }

    return { oscillator, gainNode, audioContext };
  };

  // Stop generated sound
  const stopGeneratedSound = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch (e) {
        // Ignore errors when stopping
      }
      oscillatorRef.current = null;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const togglePlayPause = async () => {
    try {
      if (isPlaying) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setIsPlaying(false);
      } else {
        const audio = audioRef.current;
        if (!audio) return;

        setIsLoading(true);
        setError(null);

        // Reset audio to start
        audio.currentTime = 0;

        // Try to play
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (playError) {
          console.error('Play error:', playError);
          setError('Unable to play audio. Click try again.');
          setIsPlaying(false);
        } finally {
          setIsLoading(false);
        }
      }
    } catch (err) {
      console.error('Toggle error:', err);
      setError(`Playback error: ${err}`);
      setIsPlaying(false);
      setIsLoading(false);
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
    // Immediately update audio element volume
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVolume;
    }
  };

  
  const toggleLoop = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.loop = !isLooping;
      setIsLooping(!isLooping);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const skipForward = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.min(audio.currentTime + 10, audio.duration);
    }
  };

  const skipBackward = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.max(audio.currentTime - 10, 0);
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
    <div className={`bg-white rounded-lg shadow-lg border ${
      isSelected ? 'border-teal-400' : 'border-gray-200'
    }`}>
      <div className="p-4">
        {/* Track Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlayPause}
              className="text-teal-600 hover:text-teal-700 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>
            <div>
              <h3 className="font-semibold text-gray-900">{track.title}</h3>
              <p className="text-sm text-gray-500">{track.mood}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={skipBackward}
              className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
              title="Skip back 10s"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={skipForward}
              className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
              title="Skip forward 10s"
            >
              <SkipForward className="w-4 h-4" />
            </button>
            <button
              onClick={toggleLoop}
              className={`p-1 transition-colors ${
                isLooping ? 'text-teal-600' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Toggle loop"
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="text-left">{formatTime(currentTime)}</span>
            <span className="text-right">{formatTime(duration)}</span>
          </div>
          <Progress
            value={duration > 0 ? (currentTime / duration) * 100 : 0}
            className="h-2"
          />
          {/* Interactive Progress Bar - Click to seek */}
          <div
            className="relative w-full h-2 bg-gray-200 rounded-lg cursor-pointer group hover:bg-gray-300 transition-colors"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const percentage = Math.max(0, Math.min(1, x / rect.width));
              const audio = audioRef.current;
              if (audio && duration > 0) {
                const newTime = percentage * duration;
                audio.currentTime = newTime;
                setCurrentTime(newTime);
              }
            }}
            title={`${formatTime(currentTime)} / ${formatTime(duration)}`}
          >
            {/* Progress fill */}
            <div
              className="absolute left-0 top-0 h-full bg-teal-500 rounded-lg transition-all duration-100"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
            {/* Invisible thumb for accessibility - completely hidden */}
            {(duration > 0) && (
              <div
                className="absolute w-1 h-1 opacity-0 pointer-events-none"
                style={{
                  left: `${duration > 0 ? Math.max(0, Math.min(100, (currentTime / duration) * 100)) : 0}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
                aria-hidden="true"
              />
            )}
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb-left"
          />
          <span className="text-xs text-gray-500 w-8 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>

        {/* Status */}
        {error && (
          <div className="mt-2 text-xs text-red-500">
            {error}
          </div>
        )}
        {isLoading && (
          <div className="mt-2 text-xs text-gray-500">
            Loading...
          </div>
        )}
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={track.file}
        preload="metadata"
        loop
      />
    </div>
  );
}