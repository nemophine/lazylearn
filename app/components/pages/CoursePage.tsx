'use client';

import { BookOpen, Clock, Users, Star, Play, Lock } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface CoursePageProps {
  onNavigate: (page: string) => void;
}

export function CoursePage({ onNavigate }: CoursePageProps) {
  const courses = [
    {
      id: 1,
      title: 'Introduction to React',
      instructor: 'John Smith',
      rating: 4.8,
      students: 15420,
      duration: '8 hours',
      level: 'Beginner',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
      progress: 75,
      isEnrolled: true,
      isLocked: false
    },
    {
      id: 2,
      title: 'Advanced JavaScript Patterns',
      instructor: 'Sarah Johnson',
      rating: 4.9,
      students: 8750,
      duration: '12 hours',
      level: 'Advanced',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=250&fit=crop',
      progress: 30,
      isEnrolled: true,
      isLocked: false
    },
    {
      id: 3,
      title: 'UI/UX Design Fundamentals',
      instructor: 'Emily Chen',
      rating: 4.7,
      students: 12300,
      duration: '10 hours',
      level: 'Intermediate',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=250&fit=crop',
      progress: 0,
      isEnrolled: false,
      isLocked: false
    },
    {
      id: 4,
      title: 'Python for Data Science',
      instructor: 'Michael Davis',
      rating: 4.9,
      students: 18900,
      duration: '15 hours',
      level: 'Intermediate',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop',
      progress: 0,
      isEnrolled: false,
      isLocked: true
    }
  ];

  const categories = [
    { name: 'All Courses', count: 156, active: true },
    { name: 'Web Development', count: 48, active: false },
    { name: 'Mobile Apps', count: 32, active: false },
    { name: 'Data Science', count: 28, active: false },
    { name: 'Design', count: 24, active: false },
    { name: 'Business', count: 24, active: false }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Courses</h1>
        <p className="text-muted-foreground">Expand your skills with our comprehensive course catalog</p>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.name}
              className={`px-5 py-2 rounded-full whitespace-nowrap transition-colors ${
                category.active
                  ? 'bg-[var(--teal-400)] text-white'
                  : 'bg-[var(--teal-50)] text-foreground hover:bg-[var(--teal-100)]'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {/* Course Image */}
            <div className="relative">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              {course.isLocked && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-white" />
                </div>
              )}
              {course.isEnrolled && course.progress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                  <div className="bg-white/20 rounded-full h-2">
                    <div
                      className="bg-white h-2 rounded-full transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <p className="text-white text-xs mt-1">{course.progress}% complete</p>
                </div>
              )}
            </div>

            <CardContent className="p-5">
              {/* Course Title */}
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>

              {/* Instructor */}
              <p className="text-sm text-muted-foreground mb-3">{course.instructor}</p>

              {/* Course Stats */}
              <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span>{course.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{course.students.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
              </div>

              {/* Level Badge */}
              <div className="mb-4">
                <Badge variant="secondary" className="border-0">
                  {course.level}
                </Badge>
              </div>

              {/* Action Button */}
              {course.isEnrolled ? (
                <Button
                  className="w-full rounded-xl h-11"
                  onClick={() => onNavigate('knowledge')}
                >
                  <Play className="w-4 h-4 mr-2" />
                  {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
                </Button>
              ) : course.isLocked ? (
                <Button variant="outline" className="w-full rounded-xl h-11" disabled>
                  <Lock className="w-4 h-4 mr-2" />
                  Locked
                </Button>
              ) : (
                <Button className="w-full rounded-xl h-11">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Enroll for ${course.price}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-8">
        <Button variant="outline" className="rounded-xl px-8">
          Load More Courses
        </Button>
      </div>
    </div>
  );
}