'use client';

import { useState } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, Plus, Video, BookOpen, Target, Users, Check, X } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface SchedulePageProps {
  onNavigate: (page: string) => void;
}

interface ScheduleItem {
  id: string;
  title: string;
  type: 'course' | 'meeting' | 'study' | 'break';
  time: string;
  duration: string;
  instructor?: string;
  completed?: boolean;
  color: string;
}

export function SchedulePage({ onNavigate }: SchedulePageProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');

  // Sample schedule data
  const scheduleItems: ScheduleItem[] = [
    {
      id: '1',
      title: 'React Fundamentals - Module 3',
      type: 'course',
      time: '09:00 AM',
      duration: '1 hour',
      instructor: 'John Smith',
      completed: true,
      color: 'bg-blue-500'
    },
    {
      id: '2',
      title: 'Study Session - JavaScript Practice',
      type: 'study',
      time: '10:30 AM',
      duration: '45 min',
      completed: true,
      color: 'bg-green-500'
    },
    {
      id: '3',
      title: 'Team Meeting - Project Discussion',
      type: 'meeting',
      time: '02:00 PM',
      duration: '30 min',
      instructor: 'Team',
      completed: false,
      color: 'bg-purple-500'
    },
    {
      id: '4',
      title: 'UI/UX Design Workshop',
      type: 'course',
      time: '03:00 PM',
      duration: '2 hours',
      instructor: 'Emily Chen',
      completed: false,
      color: 'bg-blue-500'
    },
    {
      id: '5',
      title: 'Coffee Break',
      type: 'break',
      time: '05:00 PM',
      duration: '15 min',
      completed: false,
      color: 'bg-gray-500'
    }
  ];

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const currentWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - date.getDay() + i + 1);
    return date;
  });

  const getTypeIcon = (type: ScheduleItem['type']) => {
    switch (type) {
      case 'course':
        return <Video className="w-4 h-4" />;
      case 'meeting':
        return <Users className="w-4 h-4" />;
      case 'study':
        return <BookOpen className="w-4 h-4" />;
      case 'break':
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Schedule</h1>
          <p className="text-muted-foreground">Manage your learning timetable</p>
        </div>
        <Button className="rounded-xl h-11">
          <Plus className="w-4 h-4 mr-2" />
          Add Schedule
        </Button>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-2 mb-6">
        {(['day', 'week', 'month'] as const).map((mode) => (
          <Button
            key={mode}
            variant={viewMode === mode ? 'default' : 'outline'}
            onClick={() => setViewMode(mode)}
            className="rounded-xl capitalize"
          >
            {mode}
          </Button>
        ))}
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateDate('prev')}
            className="rounded-xl"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            {viewMode === 'day'
              ? currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
              : `${formatDate(currentWeek[0])} - ${formatDate(currentWeek[6])}`}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateDate('next')}
            className="rounded-xl"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <Button
          variant="outline"
          onClick={() => setCurrentDate(new Date())}
          className="rounded-xl"
        >
          Today
        </Button>
      </div>

      {/* Week View */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-7 gap-4 mb-8">
          {weekDays.map((day, index) => {
            const date = currentWeek[index];
            const isToday = date.toDateString() === new Date().toDateString();
            const hasEvents = Math.random() > 0.5; // Random for demo

            return (
              <div
                key={day}
                className={`text-center p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                  isToday
                    ? 'border-[var(--teal-400)] bg-[var(--teal-50)]'
                    : 'border-border bg-card'
                }`}
              >
                <p className="text-sm text-muted-foreground mb-1">{day}</p>
                <p className="text-lg font-semibold mb-2">{date.getDate()}</p>
                {hasEvents && (
                  <div className="w-2 h-2 bg-[var(--teal-400)] rounded-full mx-auto"></div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Today's Schedule */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">Today's Schedule</h3>

        {scheduleItems.map((item) => (
          <Card key={item.id} className={`overflow-hidden ${item.completed ? 'opacity-60' : ''}`}>
            <CardContent className="p-0">
              <div className="flex items-center p-4">
                {/* Time Column */}
                <div className="w-24 pr-4 text-right">
                  <p className="font-medium">{item.time}</p>
                  <p className="text-sm text-muted-foreground">{item.duration}</p>
                </div>

                {/* Color Indicator */}
                <div className={`w-1 h-16 ${item.color} rounded-full mr-4`}></div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          {getTypeIcon(item.type)}
                          <span className="capitalize">{item.type}</span>
                        </div>
                        {item.instructor && (
                          <span>• {item.instructor}</span>
                        )}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2">
                      {item.completed ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <Check className="w-4 h-4" />
                          <span className="text-sm">Completed</span>
                        </div>
                      ) : (
                        <Badge variant="outline" className="border-0">
                          Upcoming
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="ml-4 flex gap-2">
                  {item.type === 'course' && !item.completed && (
                    <Button size="sm" className="rounded-xl">
                      Join
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="rounded-xl">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State for Demo */}
      {scheduleItems.length === 0 && (
        <Card className="bg-[var(--teal-50)] border-0">
          <CardContent className="p-12 text-center">
            <Calendar className="w-16 h-16 text-[var(--teal-400)] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No scheduled items</h3>
            <p className="text-muted-foreground mb-6">
              Your schedule is clear for today. Time to add some learning activities!
            </p>
            <Button className="rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Item
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Productivity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-[var(--teal-400)] mx-auto mb-3" />
            <h3 className="text-2xl font-bold mb-1">3/5</h3>
            <p className="text-sm text-muted-foreground">Tasks Completed Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold mb-1">4h 30m</h3>
            <p className="text-sm text-muted-foreground">Learning Time Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <BookOpen className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <h3 className="text-2xl font-bold mb-1">12</h3>
            <p className="text-sm text-muted-foreground">Courses This Week</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}