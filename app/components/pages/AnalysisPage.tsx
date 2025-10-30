'use client';

import { TrendingUp, BarChart3, PieChart, Calendar, Award } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart as RechartPieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

export function AnalysisPage() {
  const weeklyData = [
    { day: 'Mon', hours: 2.5, lessons: 4 },
    { day: 'Tue', hours: 3.2, lessons: 6 },
    { day: 'Wed', hours: 1.8, lessons: 3 },
    { day: 'Thu', hours: 4.1, lessons: 7 },
    { day: 'Fri', hours: 2.9, lessons: 5 },
    { day: 'Sat', hours: 3.5, lessons: 6 },
    { day: 'Sun', hours: 2.2, lessons: 4 },
  ];

  const skillData = [
    { name: 'Programming', value: 85, color: 'var(--teal-400)' },
    { name: 'Design', value: 72, color: 'var(--pink)' },
    { name: 'Language', value: 68, color: 'var(--lavender)' },
    { name: 'Math', value: 79, color: 'var(--peach)' },
  ];

  const categoryDistribution = [
    { name: 'Tech', value: 35, color: 'var(--teal-400)' },
    { name: 'Design', value: 25, color: 'var(--pink)' },
    { name: 'Language', value: 20, color: 'var(--lavender)' },
    { name: 'Other', value: 20, color: 'var(--yellow)' },
  ];

  const monthlyStats = [
    { label: 'Total Hours', value: '84h 30m', icon: '⏰', change: '+12%' },
    { label: 'Courses Completed', value: '8', icon: '📚', change: '+3' },
    { label: 'Average Score', value: '87%', icon: '🎯', change: '+5%' },
    { label: 'Streak Days', value: '18', icon: '🔥', change: '+7' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="mb-2">Learning Analytics 📊</h2>
        <p className="text-muted-foreground">Track your progress and performance insights</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {monthlyStats.map((stat, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <span className="text-4xl">{stat.icon}</span>
                <Badge 
                  variant="secondary" 
                  className="bg-[var(--teal-100)] text-[var(--teal-600)] border-0"
                >
                  {stat.change}
                </Badge>
              </div>
              <h3 className="mb-1">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Activity Chart */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-6 h-6 text-[var(--teal-500)]" />
              <h3>Weekly Activity</h3>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="var(--teal-400)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-muted-foreground text-center mt-4">
              Total: 20.2 hours this week
            </p>
          </CardContent>
        </Card>

        {/* Learning Distribution */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="w-6 h-6 text-[var(--teal-500)]" />
              <h3>Learning Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <RechartPieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartPieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {categoryDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-6 h-6 text-[var(--teal-500)]" />
                <h3>Skill Levels</h3>
              </div>
              <div className="space-y-5">
                {skillData.map((skill, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span>{skill.name}</span>
                      <span>{skill.value}%</span>
                    </div>
                    <Progress 
                      value={skill.value} 
                      className="h-3"
                      style={{ 
                        backgroundColor: `${skill.color}20`,
                      }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Summary */}
        <Card className="bg-gradient-to-br from-[var(--teal-50)] to-[var(--mint)] border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="mb-1">Great Progress!</h3>
                <p className="text-sm text-muted-foreground">Top 15%</p>
              </div>
              <Award className="w-12 h-12 text-[var(--teal-500)]" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Consistency Score</span>
                <span className="text-[var(--teal-600)]">92/100</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Engagement Level</span>
                <Badge className="bg-[var(--teal-400)] border-0">High</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Goal Achievement</span>
                <span className="text-[var(--teal-600)]">7/8</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Calendar */}
      <div>
        <h3 className="mb-4">Learning Calendar</h3>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-6 h-6 text-[var(--teal-500)]" />
              <span>October 2025</span>
            </div>
            <div className="grid grid-cols-7 gap-3">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-center text-sm text-muted-foreground pb-2">
                  {day}
                </div>
              ))}
              {Array.from({ length: 31 }, (_, i) => {
                const hasActivity = i % 3 !== 0; // Mock data
                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-xl flex items-center justify-center transition-all hover:scale-105 cursor-pointer ${
                      hasActivity 
                        ? 'bg-[var(--teal-400)] text-white shadow-sm' 
                        : 'bg-[var(--teal-50)] text-muted-foreground'
                    }`}
                  >
                    {i + 1}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[var(--teal-400)]" />
                <span>Active Days (21)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[var(--teal-50)]" />
                <span>Inactive Days (10)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
