'use client';

import { Gift, Crown, Sparkles, ShoppingBag, Coins } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

export function RewardPage() {
  const currentPoints = 2450;
  const nextRewardPoints = 3000;

  const rewards = [
    { 
      id: 1, 
      title: 'Premium Course Access', 
      points: 500, 
      icon: '🎓', 
      color: 'from-[var(--teal-300)] to-[var(--teal-400)]',
      available: true 
    },
    { 
      id: 2, 
      title: 'Custom Theme Pack', 
      points: 300, 
      icon: '🎨', 
      color: 'from-[var(--pink)] to-[var(--coral)]',
      available: true 
    },
    { 
      id: 3, 
      title: 'Ad-Free Experience', 
      points: 800, 
      icon: '✨', 
      color: 'from-[var(--lavender)] to-[var(--pink)]',
      available: true 
    },
    { 
      id: 4, 
      title: 'Exclusive Certificate', 
      points: 1000, 
      icon: '🏆', 
      color: 'from-[var(--yellow)] to-[var(--peach)]',
      available: true 
    },
    { 
      id: 5, 
      title: 'Virtual Mentor Session', 
      points: 1500, 
      icon: '👨‍🏫', 
      color: 'from-[var(--mint)] to-[var(--teal-200)]',
      available: true 
    },
    { 
      id: 6, 
      title: 'Special Badge Collection', 
      points: 2000, 
      icon: '⭐', 
      color: 'from-[var(--peach)] to-[var(--coral)]',
      available: true 
    },
    { 
      id: 7, 
      title: 'Premium Pet Accessories', 
      points: 3000, 
      icon: '🐾', 
      color: 'from-[var(--teal-400)] to-[var(--mint)]',
      available: false 
    },
  ];

  const achievements = [
    { title: 'Fast Learner', date: 'Unlocked Oct 15', icon: '⚡' },
    { title: 'Night Owl', date: 'Unlocked Oct 10', icon: '🦉' },
    { title: '7-Day Streak', date: 'Unlocked Oct 20', icon: '🔥' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="mb-2">Rewards Store 🎁</h2>
        <p className="text-muted-foreground">Redeem your points for exclusive rewards and benefits</p>
      </div>

      {/* Points Card */}
      <Card className="mb-8 bg-gradient-to-br from-[var(--teal-400)] to-[var(--teal-500)] border-0 shadow-lg overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/90 text-sm mb-1">Your Points</p>
              <div className="flex items-center gap-2">
                <Coins className="w-8 h-8 text-white" />
                <h1 className="text-white">{currentPoints.toLocaleString()}</h1>
              </div>
            </div>
            <div className="text-center bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3">
              <Crown className="w-8 h-8 text-white mx-auto mb-1" />
              <p className="text-xs text-white/90">Level 5</p>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/90 text-sm">Next Reward Unlock</span>
              <span className="text-white text-sm">{nextRewardPoints - currentPoints} pts</span>
            </div>
            <Progress 
              value={(currentPoints / nextRewardPoints) * 100} 
              className="h-2 bg-white/20"
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <div className="mb-8">
        <h3 className="mb-4">Recent Achievements</h3>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
          {achievements.map((achievement, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="text-5xl mb-3">{achievement.icon}</div>
                <p className="text-sm mb-1">{achievement.title}</p>
                <p className="text-xs text-muted-foreground">{achievement.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Rewards Store */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3>Rewards Store</h3>
            <ShoppingBag className="w-6 h-6 text-[var(--teal-500)]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rewards.map((reward) => (
              <Card 
                key={reward.id}
                className={`overflow-hidden hover:shadow-md transition-shadow ${!reward.available ? 'opacity-60' : ''}`}
              >
                <CardContent className="p-0">
                  <div className={`h-32 bg-gradient-to-br ${reward.color} flex items-center justify-center`}>
                    <span className="text-6xl">{reward.icon}</span>
                  </div>
                  <div className="p-5">
                    <p className="mb-3">{reward.title}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Coins className="w-5 h-5 text-[var(--teal-500)]" />
                        <span>{reward.points} pts</span>
                      </div>
                      <Button
                        size="sm"
                        disabled={!reward.available || currentPoints < reward.points}
                        className="rounded-full bg-[var(--teal-400)] hover:bg-[var(--teal-500)]"
                      >
                        {!reward.available ? 'Locked' : currentPoints >= reward.points ? 'Redeem' : 'Save up'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Earn More Points */}
        <div>
          <Card className="bg-gradient-to-br from-[var(--yellow)] to-[var(--peach)] border-0 h-full">
            <CardContent className="p-8 text-center flex flex-col justify-center h-full">
              <Sparkles className="w-16 h-16 text-[var(--teal-600)] mx-auto mb-4" />
              <h3 className="mb-3">Earn More Points!</h3>
              <p className="text-foreground/80 mb-6">
                Complete missions, watch lessons, and participate in the community to earn points
              </p>
              <Button className="rounded-full bg-[var(--teal-400)] hover:bg-[var(--teal-500)]">
                View Missions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
