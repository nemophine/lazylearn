'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, Trophy, Star } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';

interface Mission {
  id: number;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  progress: number;
  total: number;
  type: 'daily' | 'weekly' | 'monthly';
}

export function MissionPage() {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const missions: Mission[] = [
    // Daily Missions
    { id: 1, title: 'Complete one lesson', description: 'Finish any course lesson', points: 10, completed: true, progress: 1, total: 1, type: 'daily' },
    { id: 2, title: 'Take notes', description: 'Create notes for a video', points: 15, completed: false, progress: 0, total: 1, type: 'daily' },
    { id: 3, title: '5-minute focus', description: 'Complete a 5-minute focus session', points: 20, completed: true, progress: 1, total: 1, type: 'daily' },
    { id: 4, title: 'Quiz attempt', description: 'Take a lesson quiz', points: 10, completed: false, progress: 0, total: 1, type: 'daily' },

    // Weekly Missions
    { id: 5, title: 'Course completer', description: 'Finish an entire course', points: 100, completed: false, progress: 3, total: 5, type: 'weekly' },
    { id: 6, title: 'Focus streak', description: 'Complete focus sessions 5 days in a row', points: 75, completed: true, progress: 5, total: 5, type: 'weekly' },
    { id: 7, title: 'Quiz master', description: 'Score 90% or higher on 3 quizzes', points: 50, completed: false, progress: 2, total: 3, type: 'weekly' },
    { id: 8, title: 'Note taker', description: 'Create 10 video notes', points: 60, completed: false, progress: 7, total: 10, type: 'weekly' },

    // Monthly Missions
    { id: 9, title: 'Course explorer', description: 'Complete lessons from 3 different categories', points: 150, completed: false, progress: 1, total: 3, type: 'monthly' },
    { id: 10, title: 'Focus champion', description: 'Complete 20 focus sessions', points: 200, completed: true, progress: 20, total: 20, type: 'monthly' },
    { id: 11, title: 'Perfect score', description: 'Get 100% on any quiz', points: 100, completed: false, progress: 0, total: 1, type: 'monthly' },
    { id: 12, title: 'Community helper', description: 'Help 5 community members', points: 120, completed: false, progress: 2, total: 5, type: 'monthly' },
  ];

  const filteredMissions = missions.filter(mission => mission.type === activeTab);

  const totalPoints = missions.filter(m => m.completed).reduce((sum, m) => sum + m.points, 0);
  const completedMissions = missions.filter(m => m.completed).length;
  const totalMissionCount = missions.length;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Trophy className="w-7 h-7 text-[var(--teal-500)]" />
              Mission Board
            </h1>
            <p className="text-muted-foreground">Complete missions, earn points, and grow your pet!</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[var(--teal-500)] mb-1">{totalPoints}</div>
            <div className="text-sm text-muted-foreground">Total Points</div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-[var(--teal-50)] to-[var(--teal-100)] border-[var(--teal-200)]">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-[var(--teal-600)] mb-1">{completedMissions}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-[var(--teal-50)] to-[var(--teal-100)] border-[var(--teal-200)]">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-[var(--teal-600)] mb-1">{totalMissionCount}</div>
              <div className="text-sm text-muted-foreground">Total Missions</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-[var(--teal-50)] to-[var(--teal-100)] border-[var(--teal-200)]">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-[var(--teal-600)] mb-1">{Math.round((completedMissions / totalMissionCount) * 100)}%</div>
              <div className="text-sm text-muted-foreground">Progress</div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg mb-6">
          <Button
            variant={activeTab === 'daily' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('daily')}
            className={`flex-1 rounded-md transition-all ${
              activeTab === 'daily'
                ? 'bg-[var(--teal-500)] text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Daily
          </Button>
          <Button
            variant={activeTab === 'weekly' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('weekly')}
            className={`flex-1 rounded-md transition-all ${
              activeTab === 'weekly'
                ? 'bg-[var(--teal-500)] text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Weekly
          </Button>
          <Button
            variant={activeTab === 'monthly' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('monthly')}
            className={`flex-1 rounded-md transition-all ${
              activeTab === 'monthly'
                ? 'bg-[var(--teal-500)] text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </Button>
        </div>

        {/* Missions List */}
        <div className="space-y-4">
          {filteredMissions.map((mission) => (
            <Card key={mission.id} className="border-[var(--teal-200)] hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {mission.completed ? (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                        <Circle className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold mb-1">{mission.title}</h3>
                        <p className="text-sm text-muted-foreground">{mission.description}</p>
                      </div>
                      <div className="flex items-center gap-1 ml-4">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-semibold text-sm">+{mission.points}</span>
                      </div>
                    </div>

                    {mission.total > 1 && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">Progress</span>
                          <span className="text-xs text-muted-foreground">{mission.progress}/{mission.total}</span>
                        </div>
                        <Progress
                          value={(mission.progress / mission.total) * 100}
                          className="h-2 bg-gray-200"
                        />
                      </div>
                    )}

                    {mission.completed && (
                      <Badge variant="secondary" className="mt-3 bg-green-100 text-green-700 border-green-200">
                        Completed
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
