'use client';

import { useSession } from 'next-auth/react';
import { Search, BookOpen, Video, Brain, Code, Palette, Music, Languages, ChevronRight, Play, Clock, Users, Flame } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { data: session } = useSession();
  const user = session?.user;

  const categories = [
    { icon: Brain, label: 'Science', tooltip: 'Explore biology, physics, chemistry and more' },
    { icon: Palette, label: 'Art', tooltip: 'Creative arts, design, and visual expression' },
    { icon: Code, label: 'Coding', tooltip: 'Programming and software development' },
    { icon: Music, label: 'Music', tooltip: 'Theory, instruments, and composition' },
    { icon: Languages, label: 'Languages', tooltip: 'Learn new languages and cultures' },
    { icon: BookOpen, label: 'Literature', tooltip: 'Books, writing, and storytelling' },
  ];

  const recentlyWatched = [
    { title: 'Introduction to React', progress: 65, duration: '12 min', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400' },
    { title: 'Design Thinking Basics', progress: 30, duration: '8 min', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400' },
  ];

  const recommendedCourses = [
    { title: 'Advanced JavaScript', description: 'Master modern JS patterns', lessons: 24, duration: '4h 30m', progress: 0 },
    { title: 'UX Design Principles', description: 'Create beautiful user experiences', lessons: 18, duration: '3h 15m', progress: 0 },
    { title: 'Python for Beginners', description: 'Start coding with Python', lessons: 32, duration: '6h 45m', progress: 0 },
  ];

  const onlineFriends = [
    { name: 'Emma', pet: '🐱', course: 'JavaScript Basics' },
    { name: 'Alex', pet: '🐶', course: 'UI Design' },
    { name: 'Sarah', pet: '🦊', course: 'Python 101' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Avatar className="w-14 h-14 border-2 border-[var(--teal-400)]">
            <AvatarImage src={user?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"} />
            <AvatarFallback>
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="mb-0">Hi, {user?.name || 'Guest'}! 👋</h2>
            <p className="text-sm text-muted-foreground">Ready to learn today?</p>
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--teal-400)] to-[var(--teal-300)] rounded-2xl text-white hover:shadow-md transition-shadow">
                <Flame className="w-5 h-5" />
                <span>7 days</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>You've focused 7 days in a row! 🔥</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search courses or topics..."
            className="pl-12 h-14 rounded-2xl bg-[var(--teal-50)] border-[var(--teal-200)]"
            onClick={() => onNavigate('search')}
          />
        </div>
      </div>

      {/* Pet & Friend Section */}
      <Card className="mb-6 bg-gradient-to-br from-[var(--teal-50)] to-white border-[var(--teal-200)]">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Pet Companion */}
            <div>
              <h3 className="mb-4">Your Pet Companion</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-[var(--teal-200)] hover:shadow-md transition-all cursor-pointer">
                      <div className="text-5xl">🐱</div>
                      <div className="flex-1">
                        <p className="mb-1">Whiskers</p>
                        <p className="text-sm text-muted-foreground">Level 5 • Happy</p>
                        <Progress value={65} className="h-2 mt-2" />
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-center">
                      <p>🌱 Growth Level: 5</p>
                      <p>🔥 Streak Days: 7</p>
                      <p className="text-xs text-muted-foreground mt-1">Keep focusing to grow!</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Friends Online */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3>Friends Online</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[var(--teal-500)] hover:text-[var(--teal-600)]"
                  onClick={() => onNavigate('interaction')}
                >
                  Add Friend
                </Button>
              </div>
              <div className="space-y-2">
                {onlineFriends.map((friend, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[var(--teal-200)] hover:shadow-sm transition-shadow cursor-pointer"
                  >
                    <Avatar className="w-10 h-10 border-2 border-[var(--teal-400)]">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.name}`} />
                      <AvatarFallback>{friend.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm truncate">{friend.name}</p>
                        <span className="text-lg">{friend.pet}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{friend.course}</p>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Courses */}
        <div className="col-span-2 space-y-6">
          {/* Recommended Courses */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3>Recommended Courses</h3>
              <button className="text-sm text-[var(--teal-500)] flex items-center gap-1 hover:text-[var(--teal-600)]">
                See all <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {recommendedCourses.map((course, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow border-[var(--teal-200)]">
                  <CardContent className="p-5">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-[var(--teal-400)] to-[var(--teal-300)] rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Video className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="mb-1">{course.title}</p>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{course.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{course.lessons} lessons</span>
                          <span>•</span>
                          <span>{course.duration}</span>
                        </div>
                        {course.progress > 0 && (
                          <Progress value={course.progress} className="h-1.5 mt-2" />
                        )}
                      </div>
                      <Button size="sm" className="rounded-full bg-[var(--teal-400)] hover:bg-[var(--teal-500)] shrink-0">
                        Start
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recently Watched */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3>Recently Watched</h3>
              <button className="text-sm text-[var(--teal-500)] flex items-center gap-1 hover:text-[var(--teal-600)]">
                See all <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {recentlyWatched.map((video, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow border-[var(--teal-200)]">
                  <CardContent className="p-0">
                    <div className="relative h-32 w-full">
                      <ImageWithFallback
                        src={video.image}
                        alt={video.title}
                        className="w-full h-full object-fill"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                        <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <Play className="w-5 h-5 text-[var(--teal-500)] ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="mb-2 text-sm line-clamp-1">{video.title}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{video.duration}</span>
                      </div>
                      <Progress value={video.progress} className="h-1.5 mb-1" />
                      <p className="text-xs text-muted-foreground">{video.progress}% complete</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Categories Section */}
          <div>
            <h3 className="mb-4">Explore Categories</h3>
            <div className="grid grid-cols-3 gap-3">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <TooltipProvider key={category.label}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="flex flex-col items-center gap-2 p-4 bg-card rounded-2xl hover:shadow-md transition-all border border-[var(--teal-200)] hover:border-[var(--teal-400)]">
                          <div className="w-12 h-12 bg-gradient-to-br from-[var(--teal-400)] to-[var(--teal-300)] rounded-xl flex items-center justify-center">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-sm">{category.label}</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{category.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Profile & Actions */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card className="bg-gradient-to-br from-[var(--teal-400)] to-[var(--teal-300)] border-0 shadow-lg">
            <CardContent className="p-6 text-white">
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl">⭐</span>
                </div>
                <h3 className="text-white mb-1">Level 5 Learner</h3>
                <p className="text-white/90 text-sm">2,450 / 3,000 points</p>
              </div>
              <Progress value={82} className="h-2 bg-white/20 mb-4" />
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                  <p className="text-2xl text-white mb-1">24</p>
                  <p className="text-xs text-white/90">Courses</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                  <p className="text-2xl text-white mb-1">156</p>
                  <p className="text-xs text-white/90">Hours</p>
                </div>
              </div>
              <Button
                variant="secondary"
                className="w-full rounded-2xl bg-white/20 hover:bg-white/30 text-white border-0"
                onClick={() => onNavigate('profile')}
              >
                View Profile
              </Button>
            </CardContent>
          </Card>

          {/* Focus Mode CTA */}
          <Card className="border-2 border-dashed border-[var(--teal-300)] bg-[var(--teal-50)]">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--teal-400)] to-[var(--teal-300)] rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h4 className="mb-2">Start Focus Session</h4>
              <p className="text-sm text-muted-foreground mb-4">Block distractions and grow your pet</p>
              <Button
                className="w-full rounded-2xl bg-[var(--teal-400)] hover:bg-[var(--teal-500)]"
                onClick={() => onNavigate('focus')}
              >
                Focus Now
              </Button>
            </CardContent>
          </Card>

          {/* Active Missions */}
          <Card className="bg-gradient-to-br from-[var(--teal-300)] to-[var(--teal-200)] border-0">
            <CardContent className="p-6">
              <h4 className="text-foreground mb-3">Active Missions</h4>
              <div className="space-y-3">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3">
                  <p className="text-sm text-foreground mb-2">Complete 5 lessons</p>
                  <Progress value={60} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">3/5 complete</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3">
                  <p className="text-sm text-foreground mb-2">Study for 30 minutes</p>
                  <Progress value={80} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">24/30 min</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 rounded-2xl bg-white/40 border-white/60 hover:bg-white/60"
                onClick={() => onNavigate('mission')}
              >
                View All Missions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
