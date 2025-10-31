'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, Trophy, Star, Zap, Target, Award, Lock, Crown, Sparkles, Gift, Coins, Medal } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';

interface Mission {
  id: number;
  title: string;
  description: string;
  reward: {
    type: 'points' | 'badge' | 'avatar' | 'title' | 'certificate';
    value: string | number;
    icon: string;
    name: string;
  };
  completed: boolean;
  progress: number;
  total: number;
  difficulty: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  category: 'Daily' | 'Weekly' | 'Special' | 'Achievement';
  locked?: boolean;
  collected?: boolean;
}

interface UserLevel {
  level: number;
  name: string;
  xp: number;
  xpRequired: number;
  title: string;
  icon: string;
  color: string;
  unlockedRewards: string[];
}

export function MissionPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCollected, setShowCollected] = useState(false);

  // User current level and stats
  const [userLevel, setUserLevel] = useState<UserLevel>({
    level: 12,
    name: 'Learning Apprentice',
    xp: 2850,
    xpRequired: 3000,
    title: 'Knowledge Seeker',
    icon: '🎓',
    color: 'from-blue-500 to-purple-600',
    unlockedRewards: ['🌟 Beginner Badge', '🏆 First Course', '⚡ Focus Master', '📚 Bookworm', '🎯 Sharpshooter', '🔥 Week Warrior']
  });

  // Mission rewards with collectible items
  const missions: Mission[] = [
    // Daily Missions
    {
      id: 1,
      title: 'Daily Learner',
      description: 'Complete one lesson today',
      reward: { type: 'points', value: 50, icon: '💰', name: '50 XP Points' },
      completed: true,
      progress: 1,
      total: 1,
      difficulty: 'Common',
      category: 'Daily',
      collected: true
    },
    {
      id: 2,
      title: 'Note Taker',
      description: 'Create 2 video notes',
      reward: { type: 'badge', value: '📝', icon: '📝', name: 'Note Master Badge' },
      completed: true,
      progress: 2,
      total: 2,
      difficulty: 'Common',
      category: 'Daily',
      collected: true
    },
    {
      id: 3,
      title: 'Focus Session',
      description: 'Complete 25-minute focus session',
      reward: { type: 'points', value: 75, icon: '⚡', name: '75 XP Points' },
      completed: false,
      progress: 15,
      total: 25,
      difficulty: 'Common',
      category: 'Daily'
    },
    {
      id: 4,
      title: 'Community Helper',
      description: 'Help one community member',
      reward: { type: 'points', value: 30, icon: '🤝', name: '30 XP Points' },
      completed: false,
      progress: 0,
      total: 1,
      difficulty: 'Common',
      category: 'Daily'
    },

    // Weekly Missions
    {
      id: 5,
      title: 'Course Champion',
      description: 'Complete 3 full courses',
      reward: { type: 'avatar', value: '🎓', icon: '🎓', name: 'Scholar Avatar' },
      completed: true,
      progress: 3,
      total: 3,
      difficulty: 'Rare',
      category: 'Weekly',
      collected: true
    },
    {
      id: 6,
      title: 'Week Warrior',
      description: 'Study 7 days in a row',
      reward: { type: 'badge', value: '🔥', icon: '🔥', name: 'Week Warrior Badge' },
      completed: true,
      progress: 7,
      total: 7,
      difficulty: 'Rare',
      category: 'Weekly',
      collected: true
    },
    {
      id: 7,
      title: 'Quiz Master',
      description: 'Score 90%+ on 5 quizzes',
      reward: { type: 'title', value: 'Quiz Master', icon: '🧠', name: 'Quiz Master Title' },
      completed: false,
      progress: 3,
      total: 5,
      difficulty: 'Rare',
      category: 'Weekly'
    },
    {
      id: 8,
      title: 'Focus Expert',
      description: 'Complete 10 focus sessions',
      reward: { type: 'points', value: 300, icon: '🎯', name: '300 XP Points' },
      completed: false,
      progress: 6,
      total: 10,
      difficulty: 'Rare',
      category: 'Weekly'
    },

    // Special Missions
    {
      id: 9,
      title: 'Speed Learner',
      description: 'Complete a course in under 2 hours',
      reward: { type: 'badge', value: '⚡', icon: '⚡', name: 'Lightning Learner Badge' },
      completed: true,
      progress: 1,
      total: 1,
      difficulty: 'Epic',
      category: 'Special',
      collected: true
    },
    {
      id: 10,
      title: 'Perfect Score',
      description: 'Get 100% on any quiz',
      reward: { type: 'certificate', value: 'Perfect Score', icon: '🏅', name: 'Perfect Score Certificate' },
      completed: false,
      progress: 0,
      total: 1,
      difficulty: 'Epic',
      category: 'Special'
    },
    {
      id: 11,
      title: 'Knowledge Explorer',
      description: 'Try courses from 4 different categories',
      reward: { type: 'avatar', value: '🗺️', icon: '🗺️', name: 'Explorer Avatar' },
      completed: false,
      progress: 2,
      total: 4,
      difficulty: 'Epic',
      category: 'Special'
    },

    // Achievement Missions (Legendary)
    {
      id: 12,
      title: 'Learning Legend',
      description: 'Complete 20 courses total',
      reward: { type: 'title', value: 'Legend', icon: '👑', name: 'Learning Legend Title' },
      completed: false,
      progress: 12,
      total: 20,
      difficulty: 'Legendary',
      category: 'Achievement',
      locked: true
    },
    {
      id: 13,
      title: 'Master Teacher',
      description: 'Help 25 community members',
      reward: { type: 'avatar', value: '👨‍🏫', icon: '👨‍🏫', name: 'Master Teacher Avatar' },
      completed: false,
      progress: 8,
      total: 25,
      difficulty: 'Legendary',
      category: 'Achievement',
      locked: true
    },
    {
      id: 14,
      title: 'Focus Master',
      description: 'Complete 50 focus sessions total',
      reward: { type: 'badge', value: '🧘', icon: '🧘', name: 'Zen Master Badge' },
      completed: false,
      progress: 23,
      total: 50,
      difficulty: 'Legendary',
      category: 'Achievement',
      locked: true
    },
    {
      id: 15,
      title: 'Course Collector',
      description: 'Complete courses from all categories',
      reward: { type: 'certificate', value: 'Polyglot', icon: '🌍', name: 'Polyglot Certificate' },
      completed: false,
      progress: 3,
      total: 5,
      difficulty: 'Legendary',
      category: 'Achievement',
      locked: true
    }
  ];

  // Filter missions based on selected category and collected status
  const filteredMissions = missions.filter(mission => {
    const categoryMatch = selectedCategory === 'all' || mission.category === selectedCategory;
    const collectedMatch = !showCollected || !mission.collected;
    return categoryMatch && collectedMatch;
  });

  // Calculate statistics
  const completedMissions = missions.filter(m => m.completed).length;
  const collectibleRewards = missions.filter(m => m.completed && !m.collected).length;
  const totalMissions = missions.length;

  const difficultyColors = {
    Common: 'bg-gray-100 text-gray-700 border-gray-300',
    Rare: 'bg-blue-100 text-blue-700 border-blue-300',
    Epic: 'bg-purple-100 text-purple-700 border-purple-300',
    Legendary: 'bg-orange-100 text-orange-700 border-orange-300'
  };

  const difficultyGradients = {
    Common: 'from-gray-400 to-gray-600',
    Rare: 'from-blue-400 to-blue-600',
    Epic: 'from-purple-400 to-purple-600',
    Legendary: 'from-orange-400 to-orange-600'
  };

  const categoryIcons = {
    Daily: '📅',
    Weekly: '📆',
    Special: '⭐',
    Achievement: '🏆'
  };

  const handleCollectReward = (missionId: number) => {
    // In a real implementation, this would update the backend
    console.log(`Collecting reward for mission ${missionId}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header with User Level */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Target className="w-7 h-7 text-[var(--teal-500)]" />
              Mission Board
            </h1>
            <p className="text-muted-foreground">Complete missions to collect rewards and level up</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{userLevel.icon}</span>
              <div>
                <div className="text-sm text-muted-foreground">Level {userLevel.level}</div>
                <div className="font-semibold">{userLevel.name}</div>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
              {userLevel.title}
            </Badge>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">Experience Progress</span>
            <span className="text-sm text-blue-700">{userLevel.xp} / {userLevel.xpRequired} XP</span>
          </div>
          <Progress
            value={(userLevel.xp / userLevel.xpRequired) * 100}
            className="h-3 bg-blue-200"
          />
        </div>
      </div>
    </div>
  );
}
