'use client';

import { GraduationCap, Play, Lightbulb, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function TeacherPage() {
  const tipOfTheDay = {
    title: 'Master Active Recall',
    description: 'Instead of re-reading notes, try to retrieve information from memory. This strengthens neural pathways!',
    teacher: 'Dr. Sarah Mitchell',
    icon: '💡'
  };

  const tutorials = [
    { title: 'How to Use Focus Mode', duration: '3 min', views: '12k', color: 'from-[var(--teal-300)] to-[var(--teal-400)]' },
    { title: 'Setting Learning Goals', duration: '5 min', views: '8k', color: 'from-[var(--pink)] to-[var(--coral)]' },
    { title: 'Maximizing Reward Points', duration: '4 min', views: '15k', color: 'from-[var(--lavender)] to-[var(--pink)]' },
  ];

  const teachers = [
    { name: 'Prof. James Wilson', subject: 'Computer Science', rating: 4.9 },
    { name: 'Dr. Emily Chen', subject: 'Mathematics', rating: 4.8 },
    { name: 'Sarah Mitchell', subject: 'Learning Psychology', rating: 5.0 },
  ];

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto">
      {/* Tip of the Day */}
      <Card className="mb-6 bg-gradient-to-br from-[var(--yellow)] to-[var(--peach)] border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-3">
            <div className="text-5xl">{tipOfTheDay.icon}</div>
            <div className="flex-1">
              <Badge className="bg-white/30 text-foreground border-0 mb-2">
                Tip of the Day
              </Badge>
              <h3 className="mb-2">{tipOfTheDay.title}</h3>
              <p className="text-sm text-foreground/90 mb-2">{tipOfTheDay.description}</p>
              <p className="text-xs text-foreground/80">— {tipOfTheDay.teacher}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tutorial Videos */}
      <div className="mb-6">
        <h3 className="mb-3">Tutorial Videos</h3>
        <div className="space-y-3">
          {tutorials.map((tutorial, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-0">
                <div className={`h-20 bg-gradient-to-br ${tutorial.color} p-4 flex items-center justify-between`}>
                  <div className="flex-1">
                    <p className="text-white mb-1">{tutorial.title}</p>
                    <div className="flex items-center gap-3 text-xs text-white/90">
                      <span>{tutorial.duration}</span>
                      <span>•</span>
                      <span>{tutorial.views} views</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Teachers */}
      <div>
        <h3 className="mb-3">Featured Teachers</h3>
        <div className="space-y-3">
          {teachers.map((teacher, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-[var(--teal-200)] to-[var(--teal-300)] rounded-full flex items-center justify-center">
                    <GraduationCap className="w-7 h-7 text-[var(--teal-600)]" />
                  </div>
                  <div className="flex-1">
                    <p className="mb-0.5">{teacher.name}</p>
                    <p className="text-sm text-muted-foreground">{teacher.subject}</p>
                  </div>
                  <Badge className="bg-[var(--yellow)] text-foreground border-0">
                    ⭐ {teacher.rating}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
