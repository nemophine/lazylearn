'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Lock, Unlock, Users, RefreshCw, ChevronDown, Flame, Music } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

export function FocusPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [selectedMusic, setSelectedMusic] = useState(0);
  const [petMood, setPetMood] = useState('happy');
  const [isLocked, setIsLocked] = useState(false);
  const [selectedPet, setSelectedPet] = useState({ emoji: '🐱', name: 'Whiskers', level: 5, mood: 'Happy' });
  const [showInviteFriends, setShowInviteFriends] = useState(false);
  const [showRelaxMode, setShowRelaxMode] = useState(false);
  const [unlockClicks, setUnlockClicks] = useState(0);

  const relaxSongs = [
    { title: 'Ocean Waves', duration: '15:00', mood: 'Calm & Peaceful' },
    { title: 'Forest Rain', duration: '20:00', mood: 'Relaxing Nature' },
    { title: 'Piano Meditation', duration: '12:00', mood: 'Deep Focus' },
    { title: 'Soft Jazz', duration: '18:00', mood: 'Creative Flow' },
    { title: 'White Noise', duration: '30:00', mood: 'Background Focus' },
    { title: 'Nature Sounds', duration: '25:00', mood: 'Peaceful Study' },
  ];

  const availablePets = [
    { emoji: '🐱', name: 'Whiskers', level: 5, mood: 'Happy' },
    { emoji: '🐶', name: 'Buddy', level: 3, mood: 'Playful' },
    { emoji: '🦊', name: 'Firefox', level: 4, mood: 'Curious' },
    { emoji: '🐻', name: 'Teddy', level: 2, mood: 'Sleepy' },
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
    if (isRunning && !isLocked) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isLocked]);

  useEffect(() => {
    if (time > 1800) setPetMood('excited');
    else if (time > 600) setPetMood('happy');
    else if (time > 0) setPetMood('content');
    else setPetMood('sleepy');
  }, [time]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPetAnimation = () => {
    switch (petMood) {
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
                <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[var(--teal-400)] to-[var(--teal-300)] rounded-2xl text-white hover:shadow-lg hover:scale-105 transition-all duration-200">
                  <Flame className="w-5 h-5" />
                  <span>{streakDays} days</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-white border-[var(--teal-200)] shadow-lg">
                <div className="text-center p-2">
                  <p className="mb-1">🔥 Day {streakDays} Streak!</p>
                  <p className="text-sm text-muted-foreground">{totalFocusMinutes} mins total</p>
                  <p className="text-xs text-muted-foreground mt-1">Keep it up!</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Pet Icon with Hover & Quick Actions */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[var(--teal-300)] to-[var(--teal-200)] rounded-2xl">
                  <span className="text-2xl">{selectedPet.emoji}</span>
                  <span className="text-foreground">{selectedPet.name}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-white border-[var(--teal-200)] shadow-lg">
                <div className="text-center p-2">
                  <p className="mb-1">{selectedPet.name}</p>
                  <p className="text-sm text-muted-foreground">Level {selectedPet.level}</p>
                  <p className="text-sm text-muted-foreground">Mood: {selectedPet.mood}</p>
                  <p className="text-xs text-muted-foreground mt-1">Click dropdown for actions</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-[var(--teal-300)] to-[var(--teal-200)] rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200">
                <ChevronDown className="w-4 h-4 text-foreground" />
              </button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-48 bg-white border-[var(--teal-200)] rounded-2xl shadow-lg">
              <DropdownMenuItem className="rounded-xl cursor-pointer">
                <span className="mr-2">🍖</span> Feed Pet
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl cursor-pointer">
                <span className="mr-2">🎾</span> Play
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl cursor-pointer">
                <span className="mr-2">🔄</span> Change Pet
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Course Progress Mini Card */}
      <Card className="mb-6 bg-gradient-to-r from-[var(--teal-50)] to-white border-[var(--teal-200)]">
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

      <div className="grid grid-cols-3 gap-6">
        {/* Main Focus Area */}
        <div className="col-span-2 space-y-6">
          {/* Focus Timer with Lock Visual Feedback */}
          <Card className={`bg-gradient-to-br from-[var(--teal-50)] to-white border-[var(--teal-200)] shadow-lg overflow-hidden transition-all duration-300 ${isLocked ? 'ring-4 ring-[var(--teal-400)]' : ''}`}>
            <CardContent className="p-8 relative">
              {isLocked && (
                <div className="absolute inset-0 bg-[var(--teal-400)]/5 backdrop-blur-[1px] pointer-events-none z-10" />
              )}
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-muted-foreground">
                    {isLocked ? '🔒 Focus Mode Active - Locked' : isRunning ? 'Focus Active' : 'Ready to Focus'}
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

              {/* Timer Circle */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative w-80 h-80 mx-auto mb-8 cursor-help">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="50%"
                          cy="50%"
                          r="45%"
                          stroke="var(--teal-200)"
                          strokeWidth="12"
                          fill="none"
                        />
                        <circle
                          cx="50%"
                          cy="50%"
                          r="45%"
                          stroke="var(--teal-400)"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${(time / 3600) * (2 * Math.PI * 45)} ${2 * Math.PI * 45}`}
                          className="transition-all duration-1000"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-5xl mb-2">{formatTime(time)}</p>
                          <p className="text-sm text-muted-foreground">Time focused</p>
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

              {/* Timer Controls with Add Friend */}
              <div className="flex justify-center items-center gap-4 mb-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Button
                          size="lg"
                          onClick={() => !isLocked && setIsRunning(!isRunning)}
                          className="rounded-full w-20 h-20 bg-[var(--teal-400)] hover:bg-[var(--teal-500)] disabled:opacity-50"
                          disabled={isLocked}
                        >
                          {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{isRunning ? 'Pause focus' : 'Start focus session'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Button
                          size="lg"
                          variant="outline"
                          onClick={() => { setTime(0); setIsRunning(false); }}
                          className="rounded-full w-20 h-20 border-[var(--teal-200)]"
                          disabled={isLocked}
                        >
                          <RotateCcw className="w-8 h-8" />
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Reset timer</p>
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
                              className="rounded-full w-20 h-20 border-[var(--teal-400)] text-[var(--teal-400)] hover:bg-[var(--teal-50)]"
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
                      <DialogDescription>Select friends to join your focus session and grow pets together</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 mt-4">
                      {friendsInFocus.map((friend, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-[var(--teal-50)] rounded-2xl hover:bg-[var(--teal-100)] transition-colors cursor-pointer"
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
                            <Avatar className="w-12 h-12 border-2 border-[var(--teal-400)]">
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
                              className={invitedFriends.some(f => f.name === friend.name) ? 'bg-[var(--teal-400)] text-white' : 'bg-[var(--teal-100)]'}
                            >
                              {invitedFriends.some(f => f.name === friend.name) ? 'Invited' : 'Invite'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button
                      className="w-full mt-4 rounded-2xl bg-[var(--teal-400)] hover:bg-[var(--teal-500)]"
                      onClick={() => setShowInviteFriends(false)}
                    >
                      Start Group Focus ({invitedFriends.length} friends)
                    </Button>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Friend Avatars Below Timer */}
              {invitedFriends.length > 0 && (
                <div className="flex justify-center items-center gap-3">
                  <p className="text-sm text-muted-foreground">Focusing with:</p>
                  <div className="flex -space-x-2">
                    {invitedFriends.map((friend, index) => (
                      <div key={index} className="relative group">
                        <Avatar className="w-10 h-10 border-2 border-white ring-2 ring-[var(--teal-400)] hover:scale-110 transition-transform">
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
                <div className="mt-6 p-4 bg-[var(--teal-100)] rounded-2xl text-center">
                  <p className="text-sm text-foreground">🔒 Tap "Unlock" once more to exit focus mode</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shared Pet Growth Section */}
          {invitedFriends.length > 0 && (
            <Card className="bg-gradient-to-br from-[var(--teal-100)] to-[var(--teal-50)] border-[var(--teal-300)]">
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
                      <p className="text-xs">Group sessions earn 2x XP</p>
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
                        className="w-full rounded-2xl border-[var(--teal-200)] hover:bg-[var(--teal-50)] py-6"
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
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>🎵 Relax Mode - Ambient Playlist</DialogTitle>
                <DialogDescription>Choose background music to enhance your focus</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {relaxSongs.map((song, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all border ${
                      selectedMusic === index
                        ? 'border-[var(--teal-400)] shadow-md bg-[var(--teal-50)]'
                        : 'border-[var(--teal-200)] hover:border-[var(--teal-300)]'
                    }`}
                    onClick={() => setSelectedMusic(index)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            selectedMusic === index
                              ? 'bg-[var(--teal-400)]'
                              : 'bg-[var(--teal-100)]'
                          }`}
                        >
                          <Music
                            className={`w-5 h-5 ${
                              selectedMusic === index ? 'text-white' : 'text-[var(--teal-500)]'
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm mb-0.5 truncate">{song.title}</p>
                          <p className="text-xs text-muted-foreground">{song.mood}</p>
                          <p className="text-xs text-muted-foreground">{song.duration}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Right Sidebar - Simplified */}
        <div className="space-y-6">
          {/* Virtual Pet Display */}
          <Card className="overflow-hidden border-[var(--teal-200)]">
            <CardContent className="p-6 bg-gradient-to-br from-[var(--teal-300)] to-[var(--teal-200)] text-center">
              <h4 className="text-foreground mb-3">Your Focus Buddy</h4>
              <div className={`text-8xl mb-4 ${getPetAnimation()}`}>{selectedPet.emoji}</div>
              <p className="text-foreground mb-2">{selectedPet.name}</p>
              <Badge variant="secondary" className="bg-white/60 text-foreground border-0 mb-4">
                Level {selectedPet.level} • {selectedPet.mood}
              </Badge>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-foreground">Growth</span>
                  <span className="text-sm text-foreground">65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-gradient-to-br from-[var(--teal-400)] to-[var(--teal-300)] border-0">
              <CardContent className="p-4 text-center">
                <p className="text-white/90 text-xs mb-1">Today</p>
                <h3 className="text-white">{formatTime(time)}</h3>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-[var(--teal-300)] to-[var(--teal-200)] border-0">
              <CardContent className="p-4 text-center">
                <p className="text-foreground/80 text-xs mb-1">Sessions</p>
                <h3 className="text-foreground">24</h3>
              </CardContent>
            </Card>
          </div>

          {/* Focus Tips */}
          <Card className="bg-[var(--teal-50)] border-[var(--teal-200)]">
            <CardContent className="p-5">
              <h4 className="mb-3">💡 Focus Tips</h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>• Take breaks every 25 minutes</li>
                <li>• Stay hydrated during sessions</li>
                <li>• Keep workspace organized</li>
                <li>• Avoid multitasking</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
