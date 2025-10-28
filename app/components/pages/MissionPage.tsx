'use client';

import { CheckCircle2, Circle, Calendar, Trophy, Flame } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export function MissionPage() {
  const dailyMissions = [
    { id: 1, title: 'Watch 3 video lessons', points: 50, completed: true, progress: 3, total: 3 },
    { id: 2, title: 'Complete a quiz', points: 30, completed: true, progress: 1, total: 1 },
    { id: 3, title: 'Focus for 30 minutes', points: 40, completed: false, progress: 18, total: 30 },
    { id: 4, title: 'Read 2 articles', points: 25, completed: false, progress: 0, total: 2 },
  ];

  const weeklyMissions = [
    { id: 1, title: 'Complete 5 courses', points: 200, completed: false, progress: 2, total: 5 },
    { id: 2, title: 'Earn 500 points', points: 150, completed: false, progress: 320, total: 500 },
    { id: 3, title: 'Study 7 days in a row', points: 300, completed: false, progress: 4, total: 7 },
  ];

  const monthlyMissions = [
    { id: 1, title: 'Master 3 new skills', points: 1000, completed: false, progress: 1, total: 3 },
    { id: 2, title: 'Help 10 community members', points: 500, completed: false, progress: 3, total: 10 },
    { id: 3, title: 'Earn 3 certificates', points: 800, completed: false, progress: 0, total: 3 },
  ];

  const totalDailyPoints = dailyMissions.reduce((sum, m) => sum + (m.completed ? m.points : 0), 0);
  const maxDailyPoints = dailyMissions.reduce((sum, m) => sum + m.points, 0);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="mb-2">Your Missions 🎯</h2>
        <p className="text-muted-foreground">Complete missions to earn points and rewards</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Streak Card */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-[var(--peach)] to-[var(--yellow)] border-0 shadow-lg overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Flame className="w-8 h-8 text-orange-500" />
                  <h2 className="text-foreground">7 Day Streak!</h2>
                </div>
                <p className="text-foreground/80 mb-4">Keep learning every day to maintain your streak!</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <div key={day} className="w-10 h-10 bg-white/50 rounded-xl flex items-center justify-center">
                      <span className="text-sm">🔥</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-7xl mb-2">🔥</div>
                <Badge className="bg-white/50 text-foreground border-0">+10 pts/day</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Points Summary */}
        <Card className="bg-gradient-to-br from-[var(--teal-400)] to-[var(--teal-300)] border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-8 h-8 text-white" />
              <h3 className="text-white">Today's Progress</h3>
            </div>
            <div className="mb-4">
              <div className="flex items-end gap-2 mb-2">
                <span className="text-5xl text-white">{totalDailyPoints}</span>
                <span className="text-2xl text-white/80 mb-1">/{maxDailyPoints}</span>
              </div>
              <p className="text-white/80 text-sm">points earned today</p>
            </div>
            <Progress value={(totalDailyPoints / maxDailyPoints) * 100} className="h-3 bg-white/20" />
          </CardContent>
        </Card>
      </div>

      {/* Mission Tabs */}
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md mb-8 bg-[var(--teal-50)] rounded-2xl p-1">
          <TabsTrigger value="daily" className="rounded-xl">Daily</TabsTrigger>
          <TabsTrigger value="weekly" className="rounded-xl">Weekly</TabsTrigger>
          <TabsTrigger value="monthly" className="rounded-xl">Monthly</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-0">
          {dailyMissions.map((mission) => (
            <Card key={mission.id} className={mission.completed ? 'border-[var(--teal-300)] border-2' : ''}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="pt-1">
                    {mission.completed ? (
                      <CheckCircle2 className="w-7 h-7 text-[var(--teal-500)]" />
                    ) : (
                      <Circle className="w-7 h-7 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <p className={mission.completed ? 'line-through text-muted-foreground' : ''}>
                        {mission.title}
                      </p>
                      <Badge 
                        variant="secondary" 
                        className="bg-[var(--yellow)] text-foreground border-0 ml-2 shrink-0"
                      >
                        +{mission.points}
                      </Badge>
                    </div>
                    {!mission.completed && (
                      <>
                        <Progress 
                          value={(mission.progress / mission.total) * 100} 
                          className="h-2 mb-2" 
                        />
                        <p className="text-sm text-muted-foreground">
                          {mission.progress}/{mission.total} completed
                        </p>
                      </>
                    )}
                    {mission.completed && (
                      <p className="text-sm text-[var(--teal-500)]">✓ Completed</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="weekly" className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-0">
          {weeklyMissions.map((mission) => (
            <Card key={mission.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="pt-1">
                    <Circle className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <p>{mission.title}</p>
                      <Badge 
                        variant="secondary" 
                        className="bg-[var(--lavender)] text-foreground border-0 ml-2 shrink-0"
                      >
                        +{mission.points}
                      </Badge>
                    </div>
                    <Progress 
                      value={(mission.progress / mission.total) * 100} 
                      className="h-2 mb-2" 
                    />
                    <p className="text-sm text-muted-foreground">
                      {mission.progress}/{mission.total} completed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="monthly" className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-0">
          {monthlyMissions.map((mission) => (
            <Card key={mission.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="pt-1">
                    <Circle className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <p>{mission.title}</p>
                      <Badge 
                        variant="secondary" 
                        className="bg-gradient-to-r from-[var(--pink)] to-[var(--coral)] text-foreground border-0 ml-2 shrink-0"
                      >
                        +{mission.points}
                      </Badge>
                    </div>
                    <Progress 
                      value={(mission.progress / mission.total) * 100} 
                      className="h-2 mb-2" 
                    />
                    <p className="text-sm text-muted-foreground">
                      {mission.progress}/{mission.total} completed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
