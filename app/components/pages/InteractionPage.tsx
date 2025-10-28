'use client';

import { useState } from 'react';
import { ArrowLeft, UserPlus, MessageCircle, Play, Search, Users } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface InteractionPageProps {
  onNavigate?: (page: string) => void;
}

export function InteractionPage({ onNavigate }: InteractionPageProps) {
  const [showAddFriend, setShowAddFriend] = useState(false);

  const friends = [
    { 
      name: 'Emma Wilson', 
      pet: { emoji: '🐱', name: 'Whiskers', level: 6, streak: 12 }, 
      online: true,
      currentCourse: 'JavaScript Basics',
      focusTime: '2h 45m'
    },
    { 
      name: 'Alex Chen', 
      pet: { emoji: '🐶', name: 'Buddy', level: 5, streak: 8 }, 
      online: true,
      currentCourse: 'UI Design',
      focusTime: '1h 30m'
    },
    { 
      name: 'Sarah Johnson', 
      pet: { emoji: '🦊', name: 'Firefox', level: 7, streak: 15 }, 
      online: true,
      currentCourse: 'Python 101',
      focusTime: '3h 20m'
    },
    { 
      name: 'Mike Brown', 
      pet: { emoji: '🐻', name: 'Teddy', level: 4, streak: 5 }, 
      online: false,
      currentCourse: 'Data Science',
      focusTime: '1h 15m'
    },
  ];

  const groupFocusMembers = [
    { name: 'Emma Wilson', pet: '🐱', time: '00:45:30' },
    { name: 'Alex Chen', pet: '🐶', time: '00:45:30' },
    { name: 'You', pet: '🐱', time: '00:45:30' },
  ];

  const suggestedFriends = [
    { name: 'Lisa Park', courses: 5, level: 4 },
    { name: 'Tom Davis', courses: 8, level: 6 },
    { name: 'Nina Patel', courses: 3, level: 3 },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          {onNavigate && (
            <button onClick={() => onNavigate('home')} className="p-2 hover:bg-[var(--teal-50)] rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex-1">
            <h2 className="mb-1">Learn with Friends</h2>
            <p className="text-sm text-muted-foreground">Stay focused and grow your pets together</p>
          </div>
          <Dialog open={showAddFriend} onOpenChange={setShowAddFriend}>
            <DialogTrigger asChild>
              <Button className="rounded-2xl bg-[var(--teal-400)] hover:bg-[var(--teal-500)]">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Friend
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Friend</DialogTitle>
                <DialogDescription>Search by name or invite code to connect with friends</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or code..."
                    className="pl-10 rounded-xl"
                  />
                </div>
                <div>
                  <h4 className="text-sm mb-3">Suggested Friends</h4>
                  <div className="space-y-2">
                    {suggestedFriends.map((friend, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-[var(--teal-50)] rounded-xl">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 border-2 border-[var(--teal-400)]">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.name}`} />
                            <AvatarFallback>{friend.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm">{friend.name}</p>
                            <p className="text-xs text-muted-foreground">{friend.courses} courses • Level {friend.level}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="rounded-full">
                          Invite
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowAddFriend(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1 rounded-xl bg-[var(--teal-400)] hover:bg-[var(--teal-500)]">
                    Done
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Friend List Panel */}
        <div className="col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3>Your Friends ({friends.filter(f => f.online).length} online)</h3>
          </div>
          
          <div className="space-y-3">
            {friends.map((friend, index) => (
              <Card 
                key={index} 
                className={`transition-all hover:shadow-md ${
                  friend.online 
                    ? 'border-[var(--teal-400)] border-2' 
                    : 'border-[var(--teal-200)]'
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Avatar with Pet */}
                    <div className="relative">
                      <Avatar className="w-14 h-14 border-2 border-[var(--teal-400)]">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.name}`} />
                        <AvatarFallback>{friend.name[0]}</AvatarFallback>
                      </Avatar>
                      {friend.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>

                    {/* Friend Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="truncate">{friend.name}</p>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button className="text-2xl hover:scale-110 transition-transform">
                                    {friend.pet.emoji}
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="text-center">
                                    <p className="mb-1">{friend.pet.name}</p>
                                    <p className="text-xs text-muted-foreground">Level {friend.pet.level}</p>
                                    <p className="text-xs text-muted-foreground">🔥 {friend.pet.streak} day streak</p>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{friend.currentCourse}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs bg-[var(--teal-100)] border-0">
                              {friend.focusTime}
                            </Badge>
                            {friend.online && (
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-0">
                                Online
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        className="rounded-full bg-[var(--teal-400)] hover:bg-[var(--teal-500)]"
                        disabled={!friend.online}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Focus
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full border-[var(--teal-200)]"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Shared Focus & Pet Collaboration Zone */}
        <div className="space-y-6">
          {/* Current Group Focus */}
          <Card className="bg-gradient-to-br from-[var(--teal-50)] to-white border-[var(--teal-200)]">
            <CardContent className="p-6">
              <h4 className="mb-4">Current Group Focus</h4>
              
              {/* Shared Timer */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-[var(--teal-400)] to-[var(--teal-300)] mb-3">
                  <div className="text-center">
                    <p className="text-2xl text-white mb-0">00:45:30</p>
                    <p className="text-xs text-white/80">Shared Timer</p>
                  </div>
                </div>
                
                {/* Member Avatars */}
                <div className="flex justify-center gap-2 mb-4">
                  {groupFocusMembers.map((member, index) => (
                    <div key={index} className="relative">
                      <Avatar className="w-12 h-12 border-2 border-[var(--teal-400)]">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="absolute -bottom-2 -right-2 text-lg">
                        {member.pet}
                      </span>
                    </div>
                  ))}
                </div>
                
                <p className="text-sm text-muted-foreground mb-1">{groupFocusMembers.length} members focusing</p>
              </div>

              {/* Pet Collaboration Progress */}
              <div className="bg-white rounded-2xl p-4 border border-[var(--teal-200)]">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="cursor-help">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm">Pet Collaboration XP</h4>
                          <span className="text-xs text-muted-foreground">750 / 1000</span>
                        </div>
                        <Progress value={75} className="h-2 mb-2" />
                        <p className="text-xs text-center text-muted-foreground">
                          Keep focusing together! 🐾
                        </p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Earn more XP by focusing together!</p>
                      <p className="text-xs text-muted-foreground">Shared sessions give 2x XP</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Button className="w-full mt-4 rounded-2xl bg-[var(--teal-400)] hover:bg-[var(--teal-500)]">
                <Users className="w-4 h-4 mr-2" />
                Join Group Focus
              </Button>
            </CardContent>
          </Card>

          {/* Mini Chat / Reactions */}
          <Card className="border-[var(--teal-200)]">
            <CardContent className="p-5">
              <h4 className="mb-3">Quick Reactions</h4>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {['👏', '💪', '🌱', '🐾'].map((emoji, index) => (
                  <button
                    key={index}
                    className="aspect-square rounded-xl bg-[var(--teal-50)] hover:bg-[var(--teal-100)] transition-colors flex items-center justify-center text-2xl"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              
              {/* Motivational Messages */}
              <div className="space-y-2">
                <div className="bg-[var(--teal-50)] rounded-xl p-3">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">🐱</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-1">Whiskers</p>
                      <p className="text-sm">Keep it up! 💪</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[var(--teal-50)] rounded-xl p-3">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">🐶</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-1">Buddy</p>
                      <p className="text-sm">Great focus session! 🌟</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Group Stats */}
          <Card className="bg-gradient-to-br from-[var(--teal-300)] to-[var(--teal-200)] border-0">
            <CardContent className="p-5">
              <h4 className="text-foreground mb-3">Today's Group Stats</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center">
                  <p className="text-2xl text-foreground mb-1">12</p>
                  <p className="text-xs text-foreground/80">Sessions</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center">
                  <p className="text-2xl text-foreground mb-1">8h</p>
                  <p className="text-xs text-foreground/80">Total Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
