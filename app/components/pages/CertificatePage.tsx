'use client';

import { Award, Download, Share2, Medal, Star, Trophy } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

export function CertificatePage() {
  const certificates = [
    { 
      id: 1,
      title: 'JavaScript Mastery',
      date: 'October 2025',
      issuer: 'LearnHub Academy',
      score: 95,
      color: 'from-[var(--teal-300)] to-[var(--teal-400)]'
    },
    { 
      id: 2,
      title: 'UX Design Fundamentals',
      date: 'September 2025',
      issuer: 'Design Institute',
      score: 92,
      color: 'from-[var(--pink)] to-[var(--coral)]'
    },
  ];

  const achievements = [
    { icon: '🏆', title: 'First Course', description: 'Complete your first course', unlocked: true },
    { icon: '⭐', title: '10-Day Streak', description: 'Study for 10 days in a row', unlocked: true },
    { icon: '🔥', title: 'Speed Learner', description: 'Complete 5 courses in a month', unlocked: true },
    { icon: '💯', title: 'Perfect Score', description: 'Get 100% on any quiz', unlocked: true },
    { icon: '🎯', title: 'Goal Achiever', description: 'Complete all daily missions for a week', unlocked: true },
    { icon: '👥', title: 'Community Helper', description: 'Help 10 community members', unlocked: false },
    { icon: '📚', title: 'Bookworm', description: 'Complete 20 courses', unlocked: false },
    { icon: '🌟', title: 'Elite Learner', description: 'Reach Level 10', unlocked: false },
  ];

  const badges = [
    { icon: '🥇', name: 'Gold Badge', category: 'Excellence' },
    { icon: '🥈', name: 'Silver Badge', category: 'Achievement' },
    { icon: '🥉', name: 'Bronze Badge', category: 'Progress' },
    { icon: '💎', name: 'Diamond', category: 'Master' },
  ];

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto">
      {/* Header */}
      <Card className="mb-6 bg-gradient-to-br from-[var(--yellow)] to-[var(--peach)] border-0 shadow-lg">
        <CardContent className="p-6 text-center">
          <Trophy className="w-12 h-12 text-[var(--teal-600)] mx-auto mb-3" />
          <h2 className="mb-1">Your Achievements</h2>
          <p className="text-sm text-foreground/80">2 certificates • 5 badges unlocked</p>
        </CardContent>
      </Card>

      {/* Certificates */}
      <div className="mb-6">
        <h3 className="mb-3">Certificates</h3>
        <div className="space-y-4">
          {certificates.map((cert) => (
            <Card key={cert.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className={`h-32 bg-gradient-to-br ${cert.color} p-6 relative`}>
                  <div className="absolute top-4 right-4">
                    <Award className="w-12 h-12 text-white/30" />
                  </div>
                  <Badge className="bg-white/20 text-white border-0 mb-2">Certificate</Badge>
                  <h3 className="text-white mb-1">{cert.title}</h3>
                  <p className="text-sm text-white/90">{cert.date}</p>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Issued by</p>
                      <p className="text-sm">{cert.issuer}</p>
                    </div>
                    <Badge className="bg-[var(--yellow)] text-foreground border-0">
                      Score: {cert.score}%
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 rounded-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 rounded-full"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="mb-6">
        <h3 className="mb-3">Badges Collection</h3>
        <div className="grid grid-cols-4 gap-3">
          {badges.map((badge, index) => (
            <div key={index} className="text-center">
              <div className="aspect-square bg-gradient-to-br from-[var(--teal-200)] to-[var(--teal-300)] rounded-2xl flex items-center justify-center text-3xl shadow-md mb-2">
                {badge.icon}
              </div>
              <p className="text-xs mb-0.5">{badge.name}</p>
              <p className="text-xs text-muted-foreground">{badge.category}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Progress */}
      <div>
        <h3 className="mb-3">Achievement Progress</h3>
        <div className="space-y-3">
          {achievements.map((achievement, index) => (
            <Card 
              key={index}
              className={achievement.unlocked ? 'border-[var(--teal-300)]' : 'opacity-60'}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`text-4xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <p>{achievement.title}</p>
                      {achievement.unlocked && (
                        <Badge className="bg-[var(--teal-400)] border-0 ml-2">
                          ✓
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
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
