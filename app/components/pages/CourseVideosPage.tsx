'use client';

import { useState } from 'react';
import { ArrowLeft, Play, Lock, CheckCircle, Circle, Clock, BookOpen } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface Video {
  id: number;
  title: string;
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
  description?: string;
}

interface Course {
  id: number;
  title: string;
  instructor: string;
  rating: number;
  students: number;
  duration: string;
  level: string;
  price: number;
  image: string;
  progress: number;
  isEnrolled: boolean;
  isLocked: boolean;
  videos: Video[];
}

interface CourseVideosPageProps {
  onNavigate: (page: string, params?: any) => void;
  category?: string;
  courseId?: number;
}

export function CourseVideosPage({ onNavigate, category, courseId }: CourseVideosPageProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  // All courses data
  const allCourses: Course[] = [
    {
      id: 1,
      title: 'Complete Web Development Bootcamp',
      instructor: 'John Smith',
      rating: 4.8,
      students: 15420,
      duration: '32 hours',
      level: 'Beginner',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
      progress: 45,
      isEnrolled: true,
      isLocked: false,
      videos: [
        { id: 1, title: 'Introduction to HTML & CSS', duration: '45 min', isCompleted: true, isLocked: false, description: 'Learn the fundamentals of HTML and CSS including tags, attributes, selectors, and basic styling.' },
        { id: 2, title: 'Advanced CSS Techniques', duration: '1h 20min', isCompleted: true, isLocked: false, description: 'Master advanced CSS concepts including Flexbox, Grid, animations, and responsive design.' },
        { id: 3, title: 'JavaScript Fundamentals', duration: '2h 15min', isCompleted: true, isLocked: false, description: 'Understand JavaScript basics including variables, functions, loops, and DOM manipulation.' },
        { id: 4, title: 'DOM Manipulation', duration: '1h 45min', isCompleted: false, isLocked: false, description: 'Learn how to manipulate HTML elements using JavaScript and create dynamic web pages.' },
        { id: 5, title: 'React Basics', duration: '2h 30min', isCompleted: false, isLocked: false, description: 'Introduction to React including components, props, state, and basic hooks.' },
        { id: 6, title: 'React Hooks & State', duration: '1h 50min', isCompleted: false, isLocked: true, description: 'Deep dive into React hooks including useState, useEffect, and custom hooks.' },
      ]
    },
    {
      id: 2,
      title: 'Advanced JavaScript & TypeScript',
      instructor: 'Sarah Johnson',
      rating: 4.9,
      students: 8750,
      duration: '28 hours',
      level: 'Advanced',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=250&fit=crop',
      progress: 60,
      isEnrolled: true,
      isLocked: false,
      videos: [
        { id: 1, title: 'TypeScript Fundamentals', duration: '2h 15min', isCompleted: true, isLocked: false, description: 'Learn TypeScript basics including types, interfaces, and basic syntax.' },
        { id: 2, title: 'Advanced Type System', duration: '3h 30min', isCompleted: true, isLocked: false, description: 'Master advanced TypeScript features including generics, unions, and type inference.' },
        { id: 3, title: 'Design Patterns in JavaScript', duration: '2h 45min', isCompleted: false, isLocked: false, description: 'Explore common design patterns and how to implement them in JavaScript.' },
        { id: 4, title: 'Async Programming Deep Dive', duration: '2h 20min', isCompleted: false, isLocked: true, description: 'Understand async/await, promises, and advanced asynchronous programming concepts.' },
      ]
    },
    {
      id: 3,
      title: 'UI/UX Design Masterclass',
      instructor: 'Emily Chen',
      rating: 4.7,
      students: 12300,
      duration: '24 hours',
      level: 'Intermediate',
      price: 69.99,
      image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=250&fit=crop',
      progress: 0,
      isEnrolled: false,
      isLocked: false,
      videos: [
        { id: 1, title: 'Design Principles Fundamentals', duration: '1h 30min', isCompleted: false, isLocked: false, description: 'Learn the fundamental principles of design including balance, contrast, and hierarchy.' },
        { id: 2, title: 'Color Theory & Typography', duration: '2h 15min', isCompleted: false, isLocked: false, description: 'Understand color theory, typography principles, and how to create visually appealing designs.' },
        { id: 3, title: 'User Research Methods', duration: '2h 45min', isCompleted: false, isLocked: false, description: 'Learn user research techniques including interviews, surveys, and usability testing.' },
        { id: 4, title: 'Prototyping with Figma', duration: '3h 20min', isCompleted: false, isLocked: false, description: 'Master Figma for creating interactive prototypes and design systems.' },
      ]
    },
    // Add other courses as needed...
  ];

  const course = allCourses.find(c => c.id === courseId);

  const handleVideoClick = (video: Video) => {
    if (!video.isLocked) {
      setSelectedVideo(video);
      onNavigate('video-player', { category, courseId, videoId: video.id });
    }
  };

  if (!course) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course not found</h1>
          <Button onClick={() => onNavigate('category-courses', { category })}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  const completedVideos = course.videos.filter(v => v.isCompleted).length;
  const totalVideos = course.videos.length;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Back Button */}
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => onNavigate('category-courses', { category })}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to {category} Courses
      </Button>

      {/* Course Header */}
      <div className="mb-8">
        <div className="flex gap-6">
          <img
            src={course.image}
            alt={course.title}
            className="w-64 h-40 object-cover rounded-xl"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-lg text-muted-foreground mb-4">Instructor: {course.instructor}</p>

            <div className="flex items-center gap-6 mb-4">
              <Badge variant="secondary">{course.level}</Badge>
              <span className="text-sm text-muted-foreground">{course.duration}</span>
              <span className="text-sm text-muted-foreground">{totalVideos} videos</span>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Course Progress</span>
                <span className="text-sm text-muted-foreground">{completedVideos}/{totalVideos} completed</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-[var(--teal-400)] to-[var(--teal-300)] h-3 rounded-full transition-all"
                  style={{ width: `${(completedVideos / totalVideos) * 100}%` }}
                />
              </div>
            </div>

            {/* Action Button */}
            {course.isEnrolled ? (
              <Button className="rounded-xl">
                <Play className="w-4 h-4 mr-2" />
                {completedVideos > 0 ? 'Continue Learning' : 'Start Course'}
              </Button>
            ) : (
              <Button className="rounded-xl">
                <BookOpen className="w-4 h-4 mr-2" />
                Enroll for ${course.price}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Video List */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-6">Course Content</h2>
          <div className="space-y-3">
            {course.videos.map((video, index) => (
              <div
                key={video.id}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                  video.isLocked
                    ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
                    : 'bg-white hover:bg-[var(--teal-50)] border-gray-200 hover:border-[var(--teal-200)]'
                }`}
                onClick={() => handleVideoClick(video)}
              >
                {/* Video Number */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--teal-400)] to-[var(--teal-300)] flex items-center justify-center text-white font-semibold">
                  {index + 1}
                </div>

                {/* Status Icon */}
                <div className="flex items-center">
                  {video.isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : video.isLocked ? (
                    <Lock className="w-6 h-6 text-gray-400" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                </div>

                {/* Video Info */}
                <div className="flex-1">
                  <h3 className={`font-semibold mb-1 ${video.isLocked ? 'text-gray-500' : 'text-foreground'}`}>
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{video.duration}</span>
                    </div>
                    {video.isCompleted && (
                      <span className="text-green-600 font-medium">Completed</span>
                    )}
                    {video.isLocked && (
                      <span className="text-gray-500">Locked</span>
                    )}
                  </div>
                  {video.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {video.description}
                    </p>
                  )}
                </div>

                {/* Play Button */}
                {!video.isLocked && (
                  <Button variant="outline" size="sm" className="rounded-xl">
                    <Play className="w-4 h-4 mr-1" />
                    Play
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}