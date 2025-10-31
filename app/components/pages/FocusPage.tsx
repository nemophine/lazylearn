'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Lock, Unlock, Users, RefreshCw, ChevronDown, Flame, Music, Clock, Headphones } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

// Import Audio Player
import AudioPlayer from '../AudioPlayer';
import ProfessionalAudioPlayer from '../ProfessionalAudioPlayer';
import FocusFloatingButton from '../FocusFloatingButton';
import PixelPet from '../PixelPet';

// Simple Pet interface instead of import
interface Pet {
  id: string;
  name: string;
  type: string;
  level: number;
  health: number;
  hunger: number;
  energy: number;
  clean: number;
  happy: number;
  exp: number;
  lastFed: string;
}

// Simple pet functions instead of imports
const loadPetData = (): Pet | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem('focusPet');
  return data ? JSON.parse(data) : null;
};

const savePetData = (pet: Pet): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('focusPet', JSON.stringify(pet));
};

const createDefaultPet = (): Pet => ({
  id: 'pet-' + Date.now(),
  name: 'Buddy',
  type: 'cat',
  level: 1,
  health: 100,
  hunger: 100,
  energy: 100,
  clean: 100,
  happy: 100,
  exp: 0,
  lastFed: new Date().toISOString()
});

const updateFocusStats = (pet: Pet, timeMinutes: number): Pet => ({
  ...pet,
  exp: pet.exp + Math.floor(timeMinutes / 10)
});

export function FocusPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(25 * 60); // Default 25 minutes in seconds
  const [selectedDuration, setSelectedDuration] = useState(25); // minutes
  const [isDraggingTimer, setIsDraggingTimer] = useState(false);
  const [showTimeSelector, setShowTimeSelector] = useState(false);
  const timerRef = useRef<HTMLDivElement>(null);

  // Pomodoro cycle state
  const [pomodoroType, setPomodoroType] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [currentCycle, setCurrentCycle] = useState(1);
  const [totalCycles, setTotalCycles] = useState(4);
  const [isDragging, setIsDragging] = useState(false);
  const [isSetupMode, setIsSetupMode] = useState(true);
  const [selectedMusic, setSelectedMusic] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [currentPet, setCurrentPet] = useState<Pet | null>(null);
  const [todaySessions, setTodaySessions] = useState<{completed: boolean, duration: number}[]>([]);
  const [showInviteFriends, setShowInviteFriends] = useState(false);
  const [showRelaxMode, setShowRelaxMode] = useState(false);
  const [unlockClicks, setUnlockClicks] = useState(0);

  // Load pet and stats on mount
  useEffect(() => {
    let pet = loadPetData();
    if (!pet) {
      pet = createDefaultPet();
    }
    setCurrentPet(pet);

    // Load today's sessions
    const today = new Date().toISOString().split('T')[0];
    const storedData = localStorage.getItem('today_sessions');

    if (storedData) {
      const data = JSON.parse(storedData);
      if (data.date === today) {
        setTodaySessions(data.sessions);
      } else {
        localStorage.removeItem('today_sessions');
        setTodaySessions([]);
      }
    } else {
      setTodaySessions([]);
    }
  }, []);

  // Update pet display based on real pet data
  const getPetDisplay = () => {
    if (!currentPet) {
      return { emoji: '🐱', name: 'Buddy', level: 1, mood: 'Happy' };
    }

    // Simple pet configuration instead of PET_CONFIGS
    const averageStatus = (currentPet.health + currentPet.hunger + currentPet.energy + currentPet.clean + currentPet.happy) / 5;

    let mood = 'Happy';
    if (averageStatus >= 80) mood = 'Excited';
    else if (averageStatus >= 60) mood = 'Happy';
    else if (averageStatus >= 40) mood = 'Content';
    else mood = 'Sleepy';

    // Simple emoji mapping based on pet type
    const petEmojis = {
      cat: '🐱',
      dog: '🐶',
      fox: '🦊',
      bear: '🐻',
      rabbit: '🐰',
      default: '🐱'
    };

    return {
      emoji: petEmojis[currentPet.type as keyof typeof petEmojis] || petEmojis.default,
      name: currentPet.name,
      level: currentPet.level,
      mood
    };
  };

  const selectedPet = getPetDisplay();

  const focusTracks = [
    {
      id: 1,
      title: 'Ocean Choir Meditation 🌊',
      duration: '8:23',
      mood: 'Calm & Peaceful',
      category: 'Nature',
      bpm: '60',
      file: '/audio/focus/ocean-choir-meditation-8234.mp3',
      source: 'Local File',
      status: 'Ready to Play'
    },
    {
      id: 2,
      title: 'Relax Meditation Music 🎵',
      duration: '4:24',
      mood: 'Deep Focus',
      category: 'Meditation',
      bpm: '72',
      file: '/audio/focus/relax-meditation-music-424572.mp3',
      source: 'Local File',
      status: 'Ready to Play'
    },
    {
      id: 3,
      title: 'Lo-Fi Ambient with Rain 🌧️',
      duration: '3:45',
      mood: 'Concentration',
      category: 'Lo-Fi',
      bpm: '85',
      file: '/audio/focus/lo-fi-ambient-music-with-gentle-rain-sounds-377059.mp3',
      source: 'Local File',
      status: 'Ready to Play'
    },
    {
      id: 4,
      title: 'Forest Rain Ambient 🌲',
      duration: '3:52',
      mood: 'Relaxing Nature',
      category: 'Nature',
      bpm: '68',
      file: '/audio/focus/ambient-forest-rain-375365.mp3',
      source: 'Local File',
      status: 'Ready to Play'
    },
    {
      id: 5,
      title: 'Perfect Beauty 🎶',
      duration: '4:51',
      mood: 'Peaceful',
      category: 'Classical',
      bpm: '76',
      file: '/audio/focus/perfect-beauty-191271.mp3',
      source: 'Local File',
      status: 'Ready to Play'
    },
    {
      id: 6,
      title: 'Traditional Chinese Music 🎋',
      duration: '2:35',
      mood: 'Cultural Focus',
      category: 'World',
      bpm: '80',
      file: '/audio/focus/smooth-as-silk-full-version-traditional-chinese-music-383307.mp3',
      source: 'Local File',
      status: 'Ready to Play'
    }
  ];

  const friendsInFocus = [
    { name: 'Emma', pet: '🐱', time: '00:45:30', selected: false },
    { name: 'Alex', pet: '🐶', time: '00:32:15', selected: false },
    { name: 'Sarah', pet: '🦊', time: '01:12:00', selected: false },
  ];

  const [invitedFriends, setInvitedFriends] = useState<typeof friendsInFocus>([]);

  const currentCourse = {
    title: 'Advanced JavaScript Patterns',
    progress: 68,
    timeRemaining: '45 mins'
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !isLocked && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            // Timer completed! Use Pomodoro handler
            handlePomodoroComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isLocked, time, pomodoroType, currentCycle, totalCycles, selectedDuration]);

  // Timer drag handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleTimerDrag(e.clientX);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, selectedDuration]);

  // Calculate total time (always returns 0)
  const getTodayTotalTime = () => {
    return 0; // Always return 0 to display 00:00:00
  };

  // Get today's completed session count
  const getTodaySessionCount = () => {
    return todaySessions.filter(s => s.completed).length;
  };

  const handleSessionComplete = () => {
    setIsRunning(false);
    setIsLocked(false);

    // Add completed timer cycle as a session
    const sessionData = { completed: true, duration: selectedDuration * 60 };
    setTodaySessions(prev => [...prev, sessionData]);

    // Save to localStorage
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('today_sessions', JSON.stringify({
      date: today,
      sessions: [...todaySessions, sessionData]
    }));

    console.log('✅ Session completed!');
  };

  // Handle timer start/pause
  const handleToggleTimer = () => {
    setIsRunning(!isRunning);
  };

  // Handle back to setup mode
  const handleBackToSetup = () => {
    setIsSetupMode(true);
    setIsRunning(false);
    // Reset Pomodoro state
    setPomodoroType('focus');
    setCurrentCycle(1);
    setTime(selectedDuration * 60); // Use selected duration
  };

  const petMood = () => {
    if (time > 1800) return 'excited';
    if (time > 600) return 'happy';
    if (time > 0) return 'content';
    return 'sleepy';
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Pomodoro helper functions
  const getPomodoroDuration = (type: 'focus' | 'shortBreak' | 'longBreak') => {
    switch (type) {
      case 'focus': return selectedDuration * 60;
      case 'shortBreak': return 5 * 60; // 5 minutes
      case 'longBreak': return 15 * 60; // 15 minutes
      default: return 25 * 60;
    }
  };

  const getTotalSessionTime = () => {
    // Calculate total time for Pomodoro cycles (focus + breaks)
    let totalTime = 0;
    for (let i = 1; i <= totalCycles; i++) {
      totalTime += getPomodoroDuration('focus');
      if (i < totalCycles) {
        // Add break time (long break after 3rd cycle)
        totalTime += getPomodoroDuration(i % 4 === 0 ? 'longBreak' : 'shortBreak');
      }
    }
    return totalTime;
  };

  const getCurrentSessionProgress = () => {
    const currentSessionDuration = getPomodoroDuration(pomodoroType);
    const elapsed = currentSessionDuration - time;
    return (elapsed / currentSessionDuration) * 100;
  };

  const getTotalProgress = () => {
    // Calculate progress through entire Pomodoro session
    const totalSessionTime = getTotalSessionTime();
    const completedTime = (currentCycle - 1) * (getPomodoroDuration('focus') + getPomodoroDuration(currentCycle > 1 && (currentCycle - 1) % 4 === 0 ? 'longBreak' : 'shortBreak'));
    const currentElapsed = getPomodoroDuration(pomodoroType) - time;
    return ((completedTime + currentElapsed) / totalSessionTime) * 100;
  };

  const handlePomodoroComplete = () => {
    setIsRunning(false);

    // Add completed session
    const sessionData = { completed: true, duration: getPomodoroDuration(pomodoroType) };
    setTodaySessions(prev => [...prev, sessionData]);

    // Save to localStorage
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('today_sessions', JSON.stringify({
      date: today,
      sessions: [...todaySessions, sessionData]
    }));

    // Move to next session or break
    if (pomodoroType === 'focus') {
      if (currentCycle < totalCycles) {
        // Go to break
        const isLongBreak = currentCycle % 4 === 0;
        setPomodoroType(isLongBreak ? 'longBreak' : 'shortBreak');
        setTime(getPomodoroDuration(isLongBreak ? 'longBreak' : 'shortBreak'));
      } else {
        // All cycles complete
        setPomodoroType('focus');
        setCurrentCycle(1);
        setTime(getPomodoroDuration('focus'));
      }
    } else {
      // Break complete, go to next focus session
      setPomodoroType('focus');
      setCurrentCycle(prev => prev + 1);
      setTime(getPomodoroDuration('focus'));
    }
  };

  const handleTimeChange = (newTime: number) => {
    if (!isRunning) {
      setTime(newTime);
    }
  };

  const handleTimerDrag = (clientX: number) => {
    if (!timerRef.current || isRunning) return;

    const rect = timerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));

    // Set time based on percentage of selected duration
    const newTime = Math.round(percentage * selectedDuration * 60);
    handleTimeChange(newTime);
  };

  // Create timeDisplay for the overlay
  const timeDisplay = formatTime(time);

  const getPetAnimation = () => {
    switch (petMood()) {
      case 'excited': return 'animate-bounce';
      case 'happy': return 'animate-pulse';
      case 'content': return '';
      default: return '';
    }
  };

  const handleUnlock = () => {
    if (isLocked) {
      setUnlockClicks(prev => prev + 1);
      if (unlockClicks >= 1) {
        setIsLocked(false);
        setUnlockClicks(0);
      }
    } else {
      setIsLocked(true);
      setUnlockClicks(0);
    }
  };

  const totalFocusMinutes = Math.floor(time / 60) + (7 * 150); // 7 days streak * 150 mins avg
  const streakDays = 7;
  const sharedXP = invitedFriends.length > 0 ? 750 : 0;
  const sharedXPMax = 1000;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Top Section with Interactive Icons */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="mb-1">Focus Mode 🎯</h2>
          <p className="text-sm text-muted-foreground">Stay focused with your virtual pet and relaxing ambience</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Streak Icon with Hover */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--teal-400)] hover:bg-[var(--teal-500)] text-white hover:shadow-lg hover:scale-105 transition-all duration-200">
                  <Flame className="w-5 h-5" />
                  <span>{streakDays} days</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-white border-teal-200 shadow-lg">
                <div className="text-center p-2">
                  <p className="mb-1">🔥 Day {streakDays} Streak!</p>
                  <p className="text-sm text-muted-foreground">{totalFocusMinutes} mins total</p>
                  <p className="text-xs text-muted-foreground mt-1">Keep it up!</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          </div>
      </div>

      {/* Course Progress Mini Card */}
      <Card className="mb-6 bg-gradient-to-r from-teal-50 to-white border-teal-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Last studied</p>
              <p className="mb-2">{currentCourse.title}</p>
              <div className="flex items-center gap-3">
                <Progress value={currentCourse.progress} className="h-2 flex-1" />
                <span className="text-sm text-muted-foreground whitespace-nowrap">{currentCourse.progress}% • {currentCourse.timeRemaining} left</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        {/* Main Focus Area */}
        <div className="space-y-6">
          {/* Focus Timer with Lock Visual Feedback */}
          <Card className={`bg-gradient-to-br from-teal-50 to-white border-teal-200 shadow-lg overflow-hidden transition-all duration-300 ${isLocked ? 'ring-4 ring-teal-400' : ''}`}>
            <CardContent className="p-8 relative">
              {isLocked && (
                <div className="absolute inset-0 bg-[rgba(20,184,166,0.05)] backdrop-blur-sm pointer-events-none z-10" />
              )}

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-muted-foreground">
                    {isLocked ? '🔒 Focus Mode Active - Locked' : isRunning ? 'Focus Active' : (isSetupMode ? 'Set Timer' : 'Ready to Focus')}
                  </span>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={handleUnlock}
                      >
                        {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        <span className="ml-2">{isLocked ? 'Locked' : 'Unlocked'}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{isLocked ? 'Double-tap to unlock' : 'Click to lock focus mode'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Timer Setup Mode */}
              {isSetupMode ? (
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Pomodoro Timer Setup</h3>
                  <p className="text-sm text-muted-foreground mb-6">Configure your focus sessions and breaks</p>

                  {/* Pomodoro Cycle Display */}
                  <div className="mb-6 bg-teal-50 rounded-lg p-4 border border-teal-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-teal-700">Session Cycles</span>
                      <div className="flex gap-1">
                        {Array.from({ length: totalCycles }, (_, i) => (
                          <div
                            key={i}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                              i === 0
                                ? 'bg-teal-500 text-white'
                                : i % 4 === 3
                                ? 'bg-purple-500 text-white'
                                : 'bg-blue-500 text-white'
                            }`}
                          >
                            {i + 1}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                        <span>Focus</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>Short Break</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span>Long Break</span>
                      </div>
                    </div>
                  </div>

                  {/* Professional Draggable Timer */}
                  <div className="mb-8 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <label className="block text-sm font-medium text-foreground mb-4">
                      Focus Duration: {formatTime(time)}
                    </label>

                    {/* Timer Progress Bar - Super Simple with Dragging */}
                    <div
                      ref={timerRef}
                      style={{
                        position: 'relative',
                        height: '48px',
                        backgroundColor: '#e5e7eb',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        cursor: !isRunning ? 'pointer' : 'default'
                      }}
                      onMouseDown={(e) => {
                        if (!isRunning) {
                          setIsDragging(true);
                          handleTimerDrag(e.clientX);
                        }
                      }}
                    >
                      {/* Progress Fill */}
                      <div
                        style={{
                          width: `${(time / (selectedDuration * 60)) * 100}%`,
                          height: '100%',
                          backgroundColor: '#14b8a6',
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          borderRadius: '8px'
                        }}
                      />

                      {/* Draggable Thumb */}
                      {!isRunning && (
                        <div
                          style={{
                            position: 'absolute',
                            width: '20px',
                            height: '20px',
                            backgroundColor: 'white',
                            border: '2px solid #14b8a6',
                            borderRadius: '50%',
                            left: `${(time / (selectedDuration * 60)) * 100}%`,
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            cursor: 'grab',
                            zIndex: 10
                          }}
                        />
                      )}

                      {/* Time Display */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          color: '#374151',
                          pointerEvents: 'none'
                        }}
                      >
                        {Math.ceil(time / 60)} min
                      </div>
                    </div>

                    {/* Quick Time Buttons */}
                    <div className="flex justify-center gap-2 mb-4">
                      {[15, 25, 45, 60].map((minutes) => (
                        <button
                          key={minutes}
                          onClick={() => {
                            setSelectedDuration(minutes);
                            setTime(minutes * 60);
                          }}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                            selectedDuration === minutes
                              ? 'bg-teal-500 text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {minutes}m
                        </button>
                      ))}
                    </div>

                    {/* Visual Timeline */}
                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                      {Array.from({ length: totalCycles }, (_, i) => {
                        const sessionWidth = 100 / totalCycles;
                        const isLongBreak = i % 4 === 3 && i < totalCycles - 1;
                        return (
                          <div key={i} className="absolute h-full flex">
                            <div
                              className="bg-teal-400"
                              style={{ width: `${sessionWidth * 0.8}%` }}
                            ></div>
                            {i < totalCycles - 1 && (
                              <div
                                className={`bg-${isLongBreak ? 'purple' : 'blue'}-400`}
                                style={{ width: `${sessionWidth * 0.2}%` }}
                              ></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      setTime(selectedDuration * 60);
                      setPomodoroType('focus');
                      setCurrentCycle(1);
                      setIsSetupMode(false);
                    }}
                    className="w-full max-w-xs rounded-2xl bg-teal-400 hover:bg-teal-500 py-6 font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Start Pomodoro Session
                  </Button>
                </div>
              ) : (
                /* Timer Circle */
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative w-80 h-80 mx-auto mb-8 cursor-help">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="50%"
                            cy="50%"
                            r="45%"
                            stroke={
                              pomodoroType === 'focus' ? '#14b8a6' :
                              pomodoroType === 'shortBreak' ? '#3b82f6' : '#a855f7'
                            }
                            strokeWidth="8"
                            fill="none"
                            opacity="0.2"
                          />
                          <circle
                            cx="50%"
                            cy="50%"
                            r="45%"
                            stroke={
                              pomodoroType === 'focus' ? '#14b8a6' :
                              pomodoroType === 'shortBreak' ? '#3b82f6' : '#a855f7'
                            }
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${getCurrentSessionProgress() * (2 * Math.PI * 45) / 100} ${2 * Math.PI * 45}`}
                            className="transition-all duration-1000"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="text-center">
                            {/* Session Type Badge */}
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                              pomodoroType === 'focus' ? 'bg-teal-100 text-teal-700' :
                              pomodoroType === 'shortBreak' ? 'bg-blue-100 text-blue-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {pomodoroType === 'focus' ? '🎯 Focus' :
                               pomodoroType === 'shortBreak' ? '☕ Short Break' : '🌟 Long Break'}
                            </div>

                            {/* Timer Display */}
                            <p className="text-5xl font-bold mb-2">{formatTime(time)}</p>

                            {/* Cycle Progress */}
                            <div className="text-xs text-muted-foreground mb-2">
                              Cycle {currentCycle} of {totalCycles}
                            </div>

                            {/* Session Status */}
                            <p className="text-sm text-muted-foreground">
                              {time === 0 ? "Session Complete!" :
                               isRunning ? `${pomodoroType === 'focus' ? 'Focus' : 'Break'} in progress` :
                               `${pomodoroType === 'focus' ? 'Focus' : 'Break'} paused`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Your focus timer</p>
                      <p className="text-xs text-muted-foreground">Stay focused to grow your pet</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {/* Timer Controls */}
              {!isSetupMode && (
                <div className="flex justify-center items-center gap-4 mb-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Button
                            size="lg"
                            onClick={() => !isLocked && handleToggleTimer()}
                            className="rounded-full w-20 h-20 bg-teal-400 hover:bg-teal-500 disabled:opacity-50"
                            disabled={isLocked || time === 0}
                          >
                            {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                          </Button>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{isRunning ? 'Pause focus' : 'Start focus timer'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Reset Time Button */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Button
                            size="lg"
                            variant="outline"
                            onClick={() => {
                              setTime(0);
                              setIsRunning(false);
                              setIsSetupMode(true);
                            }}
                            className="rounded-full w-20 h-20 border-teal-400 text-teal-400 hover:bg-teal-50"
                            disabled={isLocked}
                          >
                            <RefreshCw className="w-8 h-8" />
                          </Button>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Reset & go back</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Add Friend Button */}
                  <Dialog open={showInviteFriends} onOpenChange={setShowInviteFriends}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <DialogTrigger asChild>
                              <Button
                                size="lg"
                                variant="outline"
                                className="rounded-full w-20 h-20 border-teal-400 text-teal-400 hover:bg-teal-50"
                                disabled={isLocked}
                              >
                                <Users className="w-8 h-8" />
                              </Button>
                            </DialogTrigger>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Invite friends to focus together</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Invite Friends to Focus Together</DialogTitle>
                        <DialogDescription>Select friends to join your focus timer and grow pets together</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3 mt-4">
                        {friendsInFocus.map((friend, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-teal-50 rounded-2xl hover:bg-teal-100 transition-colors cursor-pointer"
                            onClick={() => {
                              const isInvited = invitedFriends.some(f => f.name === friend.name);
                              if (isInvited) {
                                setInvitedFriends(invitedFriends.filter(f => f.name !== friend.name));
                              } else {
                                setInvitedFriends([...invitedFriends, friend]);
                              }
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="w-12 h-12 border-2 border-teal-400">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.name}`} />
                                <AvatarFallback>{friend.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="mb-0.5">{friend.name}</p>
                                <p className="text-sm text-muted-foreground">Focus time: {friend.time}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{friend.pet}</span>
                              <Badge
                                variant="secondary"
                                className={invitedFriends.some(f => f.name === friend.name) ? 'bg-teal-400 text-white' : 'bg-teal-100'}
                              >
                                {invitedFriends.some(f => f.name === friend.name) ? 'Invited' : 'Invite'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button
                        className="w-full mt-4 rounded-2xl bg-teal-400 hover:bg-teal-500"
                        onClick={() => setShowInviteFriends(false)}
                      >
                        Start Group Focus ({invitedFriends.length} friends)
                      </Button>
                    </DialogContent>
                  </Dialog>

                </div>
              )}

              {/* Friend Avatars Below Timer */}
              {invitedFriends.length > 0 && (
                <div className="flex justify-center items-center gap-3">
                  <p className="text-sm text-muted-foreground">Focusing with:</p>
                  <div className="flex -space-x-2">
                    {invitedFriends.map((friend, index) => (
                      <div key={index} className="relative group">
                        <Avatar className="w-10 h-10 border-2 border-white ring-2 ring-teal-400 hover:scale-110 transition-transform">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.name}`} />
                          <AvatarFallback>{friend.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="absolute -bottom-1 -right-1 text-sm">{friend.pet}</span>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {friend.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isLocked && unlockClicks === 1 && (
                <div className="mt-6 p-4 bg-teal-100 rounded-2xl text-center">
                  <p className="text-sm text-foreground">🔒 Tap "Unlock" once more to exit focus mode</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shared Pet Growth Section */}
          {invitedFriends.length > 0 && (
            <Card className="bg-gradient-to-br from-teal-100 to-teal-50 border-teal-300">
              <CardContent className="p-6">
                <h3 className="mb-4">🌱 Group Pet Garden</h3>
                <div className="flex justify-center gap-3 mb-4">
                  <span className="text-4xl">{selectedPet.emoji}</span>
                  {invitedFriends.map((friend, index) => (
                    <span key={index} className="text-4xl">{friend.pet}</span>
                  ))}
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="cursor-help">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm">Shared XP Progress</h4>
                          <span className="text-sm text-muted-foreground">{sharedXP} / {sharedXPMax} XP</span>
                        </div>
                        <Progress value={(sharedXP / sharedXPMax) * 100} className="h-3 mb-2" />
                        <p className="text-xs text-center text-muted-foreground">
                          Focusing together helps pets grow faster! 🌟
                        </p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Group focus earns 2x XP</p>
                      <p className="text-xs text-muted-foreground">Keep focusing together!</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardContent>
            </Card>
          )}

          {/* Relax Mode Button */}
          <Dialog open={showRelaxMode} onOpenChange={setShowRelaxMode}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full rounded-2xl border-teal-200 hover:bg-teal-50 py-6"
                      >
                        <Music className="w-5 h-5 mr-2" />
                        <span>Relax Mode - Ambient Playlist</span>
                      </Button>
                    </DialogTrigger>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Choose ambient music for focus</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-gray-900">🎵 Choose Music</DialogTitle>
                <DialogDescription className="text-gray-600">Select background music for focus</DialogDescription>
              </DialogHeader>

              {/* Track List - Better Single Column */}
              <div className="mt-4 max-h-80 overflow-y-auto">
                {focusTracks.map((track, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedMusic(index)}
                    className={`cursor-pointer transition-all border rounded-lg mb-2 ${
                      selectedMusic === index
                        ? 'selected-track shadow-md border-teal-400'
                        : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="p-3">
                      <div className="flex items-center gap-3">
                        {/* Track Number */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all flex-shrink-0 ${
                            selectedMusic === index
                              ? 'track-number'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {index + 1}
                        </div>

                        {/* Track Info */}
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm ${
                            selectedMusic === index ? 'track-title' : 'text-gray-900'
                          }`}>
                            {track.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className={`text-xs ${
                              selectedMusic === index ? 'track-info' : 'text-gray-500'
                            }`}>
                              {track.duration}
                            </span>
                            <span className={`text-xs ${
                              selectedMusic === index ? 'track-info' : 'text-gray-500'
                            }`}>
                              {track.mood}
                            </span>
                          </div>
                        </div>

                        {/* Selection Indicator */}
                        {selectedMusic === index && (
                          <Music className="w-4 h-4 track-icon flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  {selectedMusic + 1} of {focusTracks.length} selected
                </p>
                <Button
                  className="rounded-full bg-teal-400 hover:bg-teal-500 px-6 py-2 text-white"
                  onClick={() => setShowRelaxMode(false)}
                >
                  Start Focus
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Professional Audio Player */}
          <div className="space-y-3">
            <ProfessionalAudioPlayer
              track={focusTracks[selectedMusic]}
              isSelected={true}
              onSelect={() => {}}
              onPreviousTrack={() => setSelectedMusic(Math.max(0, selectedMusic - 1))}
              onNextTrack={() => setSelectedMusic(Math.min(focusTracks.length - 1, selectedMusic + 1))}
              hasPreviousTrack={selectedMusic > 0}
              hasNextTrack={selectedMusic < focusTracks.length - 1}
            />
          </div>
        </div>

        {/* Right Sidebar - Simplified */}
        <div className="space-y-6">
          {/* Virtual Pet Display - Pixel Pet */}
          <PixelPet
            isFocusActive={isRunning && !isLocked}
            focusTime={time}
            onStatsUpdate={(stats) => {
              // Optional: Handle pet stats updates if needed
              console.log('Pet stats updated:', stats);
            }}
          />

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-gradient-to-br from-teal-400 to-teal-300 border-0">
              <CardContent className="p-4 text-center">
                <p className="text-white/90 text-xs mb-1">Total Times (Today)</p>
                <h3 className="text-white">{formatTime(getTodayTotalTime())}</h3>
                <p className="text-white/70 text-xs mt-1">
                  Completed Cycles
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-teal-300 to-teal-200 border-0">
              <CardContent className="p-4 text-center">
                <p className="text-foreground/80 text-xs mb-1">Sessions</p>
                <h3 className="text-foreground">{getTodaySessionCount()}</h3>
                <p className="text-foreground/60 text-xs mt-1">
                  {getTodaySessionCount() === 0 ? 'No videos completed' : 'Videos completed'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Focus Tips */}
          <Card className="bg-teal-50 border-teal-200">
            <CardContent className="p-5">
              <h4 className="mb-3">💡 Focus Tips</h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>• Take breaks every 25 minutes</li>
                <li>• Stay hydrated during focus time</li>
                <li>• Keep workspace organized</li>
                <li>• Avoid multitasking</li>
              </ul>
            </CardContent>
          </Card>

          </div>
      </div>

      {/* Focus Floating Button - appears when timer is running */}
      <FocusFloatingButton
        isRunning={isRunning}
        time={time}
        timeDisplay={timeDisplay}
        selectedMusic={selectedMusic}
        focusTracks={focusTracks}
        isLocked={isLocked}
        onPausePlay={handleToggleTimer}
        onUnlock={() => {
          setIsLocked(false);
          setUnlockClicks(0);
        }}
        onMusicSelect={setSelectedMusic}
        onLockToggle={() => {
          if (isLocked) {
            setUnlockClicks(unlockClicks + 1);
            if (unlockClicks + 1 >= 2) {
              setIsLocked(false);
              setUnlockClicks(0);
            }
          } else {
            setIsLocked(true);
            setUnlockClicks(0);
          }
        }}
      />
    </div>
  );
}