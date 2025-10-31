'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Search, BookOpen, Video, ChevronRight, Play, Clock, Users, Flame, Star, User, Calendar } from 'lucide-react';
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

  // State for dynamically updated profile data
  const [profileData, setProfileData] = useState({ userName: user?.name || '', userImage: user?.image || '' });

  // Load profile data from localStorage and listen for updates
  useEffect(() => {
    // Load initial profile data
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        try {
          const profile = JSON.parse(savedProfile);
          setProfileData({
            userName: profile.name || user?.name || '',
            userImage: profile.image || user?.image || ''
          });
        } catch (error) {
          console.error('Error loading profile from localStorage:', error);
        }
      }
    }

    // Listen for profile updates
    const handleProfileUpdate = (event: CustomEvent) => {
      const updatedProfile = event.detail;
      console.log('HomePage received profileUpdated event:', updatedProfile);
      setProfileData({
        userName: updatedProfile.name || user?.name || '',
        userImage: updatedProfile.image || user?.image || ''
      });
    };

    // Listen for logout events
    const handleLogout = () => {
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userProfile');
      }
      // Reset to guest state
      setProfileData({
        userName: '',
        userImage: ''
      });
    };

    // Add event listeners
    window.addEventListener('profileUpdated', handleProfileUpdate as EventListener);
    window.addEventListener('userLoggedOut', handleLogout as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate as EventListener);
      window.removeEventListener('userLoggedOut', handleLogout as EventListener);
    };
  }, [user?.name, user?.image]);

  // Reset to guest when session changes
  useEffect(() => {
    if (!session) {
      setProfileData({
        userName: '',
        userImage: ''
      });
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userProfile');
      }
    }
  }, [session]);


  const recentlyWatched = [
    { title: 'Introduction to React', progress: 65, duration: '12 min', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400' },
    { title: 'Design Thinking Basics', progress: 30, duration: '8 min', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400' },
  ];

  const recommendedCourses = [
    {
      title: 'Advanced JavaScript',
      description: 'Master modern JavaScript patterns and best practices',
      detailedDescription: 'Learn ES6+, async programming, design patterns, and modern frameworks. Perfect for developers looking to level up their JavaScript skills.',
      lessons: 24,
      duration: '4h 30m',
      progress: 0,
      level: 'Advanced',
      instructor: 'John Smith',
      rating: 4.8,
      students: 1250,
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400'
    },
    {
      title: 'UX Design Principles',
      description: 'Create beautiful user experiences',
      detailedDescription: 'Master user research, wireframing, prototyping, and design thinking. Build interfaces that users love and that drive business results.',
      lessons: 18,
      duration: '3h 15m',
      progress: 0,
      level: 'Intermediate',
      instructor: 'Sarah Johnson',
      rating: 4.9,
      students: 980,
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400'
    },
    {
      title: 'Python for Beginners',
      description: 'Start coding with Python from scratch',
      detailedDescription: 'No prior experience needed. Learn variables, functions, data structures, and build real-world applications. Python is perfect for beginners!',
      lessons: 32,
      duration: '6h 45m',
      progress: 0,
      level: 'Beginner',
      instructor: 'Mike Chen',
      rating: 4.7,
      students: 2100,
      image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400'
    },
  ];

  const onlineFriends = [
    { name: 'Emma', avatar: '👩‍💻', course: 'JavaScript Basics', progress: 75, status: 'studying' },
    { name: 'Alex', avatar: '👨‍🎨', course: 'UI Design', progress: 45, status: 'paused' },
    { name: 'Sarah', avatar: '👩‍🔬', course: 'Python 101', progress: 90, status: 'studying' },
  ];

  const friendsCourseActivity = [
    {
      friend: 'Emma',
      course: 'JavaScript Basics',
      lesson: 'Lesson 5: Async Programming',
      progress: 75,
      timeLeft: '15 min',
      status: 'active',
      avatar: '👩‍💻'
    },
    {
      friend: 'Alex',
      course: 'UI Design Principles',
      lesson: 'Lesson 3: Color Theory',
      progress: 45,
      timeLeft: '20 min',
      status: 'active',
      avatar: '👨‍🎨'
    },
    {
      friend: 'Sarah',
      course: 'Python for Data Science',
      lesson: 'Lesson 8: Pandas',
      progress: 90,
      timeLeft: '5 min',
      status: 'active',
      avatar: '👩‍🔬'
    },
    {
      friend: 'Mike',
      course: 'React Development',
      lesson: 'Lesson 2: Components',
      progress: 30,
      timeLeft: '25 min',
      status: 'completed',
      avatar: '👨‍💻'
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Avatar className="w-14 h-14 border-2 border-[var(--teal-400)]">
            {(profileData.userImage && profileData.userImage !== "") && <AvatarImage src={profileData.userImage} />}
            <AvatarFallback>
              {profileData.userName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="mb-0">Hi, {profileData.userName || 'Guest'}! 👋</h2>
            <p className="text-sm text-muted-foreground">Ready to learn today?</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Level Learner Badge */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[var(--teal-400)] to-[var(--teal-300)] rounded-xl text-white hover:shadow-md transition-shadow">
                  <Star className="w-4 h-4" />
                  <span className="text-sm font-medium">Lvl 5</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-center">
                  <p className="font-medium">Level 5 Learner</p>
                  <p className="text-xs text-muted-foreground">2,450 / 3,000 XP</p>
                  <p className="text-xs text-muted-foreground mt-1">550 XP to next level</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Streak Counter */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[var(--teal-400)] to-[var(--teal-300)] rounded-xl text-white hover:shadow-md transition-shadow">
                  <Flame className="w-4 h-4" />
                  <span className="text-sm font-medium">7 days</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>You've focused 7 days in a row! 🔥</p>
                <p className="text-xs text-muted-foreground mt-1">Keep it going!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Friends Course Processing Section */}
      <Card className="mb-6 bg-gradient-to-br from-[var(--teal-50)] to-white border-[var(--teal-200)]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Friends Course Activity</h3>
              <p className="text-sm text-muted-foreground">See what your friends are learning</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-[var(--teal-300)] text-[var(--teal-600)] hover:bg-[var(--teal-50)]"
              onClick={() => onNavigate('community')}
            >
              View All Friends
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {friendsCourseActivity.map((activity, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-[var(--teal-200)] hover:border-[var(--teal-400)] bg-white">
                      <CardContent className="p-4">
                        {/* Friend Avatar and Status */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="relative">
                            <div className="text-2xl">{activity.avatar}</div>
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                              activity.status === 'active' ? 'bg-green-500' :
                              activity.status === 'completed' ? 'bg-blue-500' : 'bg-gray-400'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{activity.friend}</p>
                            <p className="text-xs text-muted-foreground">{activity.timeLeft} left</p>
                          </div>
                        </div>

                        {/* Course Info */}
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs font-medium text-gray-700 line-clamp-1">{activity.course}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">{activity.lesson}</p>
                          </div>

                          {/* Progress Bar */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Progress</span>
                              <span>{activity.progress}%</span>
                            </div>
                            <Progress
                              value={activity.progress}
                              className="h-1.5"
                              style={{
                                backgroundColor: '#e5f3f0',
                                // Override the progress bar color based on status
                                '--progress-background': activity.status === 'completed' ? '#3b82f6' : '#14b8a6'
                              } as React.CSSProperties}
                            />
                          </div>

                          {/* Status Badge */}
                          <div className="flex items-center justify-between">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                activity.status === 'active' ? 'border-green-500 text-green-700 bg-green-50' :
                                activity.status === 'completed' ? 'border-blue-500 text-blue-700 bg-blue-50' :
                                'border-gray-500 text-gray-700 bg-gray-50'
                              }`}
                            >
                              {activity.status === 'active' ? '📚 Studying' :
                               activity.status === 'completed' ? '✅ Completed' : '⏸️ Paused'}
                            </Badge>
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-[var(--teal-600)] transition-colors" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="p-3 max-w-xs">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{activity.avatar}</span>
                        <div>
                          <p className="font-medium text-sm">{activity.friend}</p>
                          <p className="text-xs text-muted-foreground">{activity.status}</p>
                        </div>
                      </div>
                      <div className="text-xs space-y-1">
                        <p><strong>Course:</strong> {activity.course}</p>
                        <p><strong>Current:</strong> {activity.lesson}</p>
                        <p><strong>Time Remaining:</strong> {activity.timeLeft}</p>
                        <p><strong>Progress:</strong> {activity.progress}% complete</p>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="mt-6 pt-4 border-t border-[var(--teal-200)]">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-[var(--teal-50)] rounded-xl p-3">
                <p className="text-lg font-semibold text-[var(--teal-700)]">
                  {friendsCourseActivity.filter(f => f.status === 'active').length}
                </p>
                <p className="text-xs text-[var(--teal-600)]">Currently Studying</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-3">
                <p className="text-lg font-semibold text-blue-700">
                  {friendsCourseActivity.filter(f => f.status === 'completed').length}
                </p>
                <p className="text-xs text-blue-600">Completed Today</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3">
                <p className="text-lg font-semibold text-purple-700">
                  {Math.round(friendsCourseActivity.reduce((acc, f) => acc + f.progress, 0) / friendsCourseActivity.length)}%
                </p>
                <p className="text-xs text-purple-600">Average Progress</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Recommended Courses */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Recommended Courses</h3>
            <button className="text-sm text-[var(--teal-500)] flex items-center gap-1 hover:text-[var(--teal-600)]">
              See all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {recommendedCourses.map((course, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className="group hover:shadow-xl transition-all duration-300 border-[var(--teal-200)] hover:border-[var(--teal-400)] cursor-pointer">
                      <CardContent className="p-6">
                        {/* Course Image */}
                        <div className="relative h-40 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-[var(--teal-400)] to-[var(--teal-300)]">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Video className="w-12 h-12 text-white opacity-80" />
                          </div>
                          {/* Course Level Badge */}
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-[var(--teal-700)]">
                            {course.level}
                          </div>
                        </div>

                        {/* Course Content */}
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold text-lg mb-1">{course.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                          </div>

                          {/* Course Stats */}
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{course.lessons} lessons</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{course.duration}</span>
                            </div>
                          </div>

                          {/* Instructor and Rating */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{course.instructor}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-xs text-muted-foreground">{course.rating}</span>
                            </div>
                          </div>

                          {/* Students Count */}
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="w-3 h-3" />
                            <span>{course.students.toLocaleString()} students</span>
                          </div>

                          {/* Start Button */}
                          <Button size="sm" className="w-full rounded-xl bg-[var(--teal-400)] hover:bg-[var(--teal-500)] text-white font-medium group-hover:scale-105 transition-all">
                            Start Course
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="p-4 max-w-sm">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">{course.title}</h4>
                      <p className="text-xs text-muted-foreground">{course.detailedDescription}</p>
                      <div className="flex items-center gap-2 pt-2 border-t">
                        <Badge variant="outline" className="text-xs">{course.level}</Badge>
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span>{course.rating} ({course.students}+ students)</span>
                        </div>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}