'use client';

import { useState } from 'react';
import { BookOpen, Clock, Users, Star, Play, Lock, ChevronDown, ChevronUp, CheckCircle, Circle, Code, Smartphone, FlaskConical, Palette, Briefcase } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface Video {
  id: number;
  title: string;
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
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
  category: string;
}

interface CoursePageProps {
  onNavigate: (page: string) => void;
}

export function CoursePage({ onNavigate }: CoursePageProps) {
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);

  const coursesByCategory = {
    'Web Development': [
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
          { id: 1, title: 'Introduction to HTML & CSS', duration: '45 min', isCompleted: true, isLocked: false },
          { id: 2, title: 'Advanced CSS Techniques', duration: '1h 20min', isCompleted: true, isLocked: false },
          { id: 3, title: 'JavaScript Fundamentals', duration: '2h 15min', isCompleted: true, isLocked: false },
          { id: 4, title: 'DOM Manipulation', duration: '1h 45min', isCompleted: false, isLocked: false },
          { id: 5, title: 'React Basics', duration: '2h 30min', isCompleted: false, isLocked: false },
          { id: 6, title: 'React Hooks & State', duration: '1h 50min', isCompleted: false, isLocked: true },
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
          { id: 1, title: 'TypeScript Fundamentals', duration: '2h 15min', isCompleted: true, isLocked: false },
          { id: 2, title: 'Advanced Type System', duration: '3h 30min', isCompleted: true, isLocked: false },
          { id: 3, title: 'Design Patterns in JavaScript', duration: '2h 45min', isCompleted: false, isLocked: false },
          { id: 4, title: 'Async Programming Deep Dive', duration: '2h 20min', isCompleted: false, isLocked: true },
        ]
      },
      {
        id: 7,
        title: 'Node.js Backend Development',
        instructor: 'David Wilson',
        rating: 4.7,
        students: 12300,
        duration: '24 hours',
        level: 'Intermediate',
        price: 74.99,
        image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop',
        progress: 0,
        isEnrolled: false,
        isLocked: false,
        videos: [
          { id: 1, title: 'Node.js Fundamentals', duration: '2h 30min', isCompleted: false, isLocked: false },
          { id: 2, title: 'Express.js Framework', duration: '3h 15min', isCompleted: false, isLocked: false },
          { id: 3, title: 'Database Integration', duration: '4h 20min', isCompleted: false, isLocked: false },
          { id: 4, title: 'RESTful APIs', duration: '3h 45min', isCompleted: false, isLocked: false },
        ]
      }
    ],
    'Mobile Apps': [
      {
        id: 5,
        title: 'React Native Mobile Development',
        instructor: 'Alex Thompson',
        rating: 4.6,
        students: 9200,
        duration: '36 hours',
        level: 'Intermediate',
        price: 84.99,
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop',
        progress: 25,
        isEnrolled: true,
        isLocked: false,
        videos: [
          { id: 1, title: 'React Native Setup & Expo', duration: '1h 45min', isCompleted: true, isLocked: false },
          { id: 2, title: 'Components & Styling', duration: '2h 30min', isCompleted: true, isLocked: false },
          { id: 3, title: 'Navigation & Routing', duration: '2h 15min', isCompleted: false, isLocked: false },
          { id: 4, title: 'State Management with Redux', duration: '3h 20min', isCompleted: false, isLocked: false },
        ]
      },
      {
        id: 8,
        title: 'Flutter Complete Course',
        instructor: 'Maria Garcia',
        rating: 4.8,
        students: 7800,
        duration: '40 hours',
        level: 'Beginner',
        price: 94.99,
        image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop',
        progress: 0,
        isEnrolled: false,
        isLocked: false,
        videos: [
          { id: 1, title: 'Dart Programming Basics', duration: '3h 30min', isCompleted: false, isLocked: false },
          { id: 2, title: 'Flutter Widgets & Layouts', duration: '4h 15min', isCompleted: false, isLocked: false },
          { id: 3, title: 'State Management Solutions', duration: '3h 45min', isCompleted: false, isLocked: false },
          { id: 4, title: 'Building Real Apps', duration: '5h 20min', isCompleted: false, isLocked: false },
        ]
      }
    ],
    'Data Science': [
      {
        id: 4,
        title: 'Python for Data Science & ML',
        instructor: 'Michael Davis',
        rating: 4.9,
        students: 18900,
        duration: '42 hours',
        level: 'Intermediate',
        price: 99.99,
        image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop',
        progress: 0,
        isEnrolled: false,
        isLocked: false,
        videos: [
          { id: 1, title: 'Python Basics Refresher', duration: '2h 30min', isCompleted: false, isLocked: false },
          { id: 2, title: 'NumPy & Pandas Deep Dive', duration: '4h 15min', isCompleted: false, isLocked: false },
          { id: 3, title: 'Data Visualization with Matplotlib', duration: '3h 45min', isCompleted: false, isLocked: false },
          { id: 4, title: 'Machine Learning Introduction', duration: '5h 30min', isCompleted: false, isLocked: false },
        ]
      },
      {
        id: 9,
        title: 'Machine Learning A-Z',
        instructor: 'Robert Chen',
        rating: 4.9,
        students: 25600,
        duration: '48 hours',
        level: 'Beginner',
        price: 119.99,
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
        progress: 0,
        isEnrolled: false,
        isLocked: false,
        videos: [
          { id: 1, title: 'ML Fundamentals', duration: '4h 30min', isCompleted: false, isLocked: false },
          { id: 2, title: 'Supervised Learning', duration: '6h 15min', isCompleted: false, isLocked: false },
          { id: 3, title: 'Unsupervised Learning', duration: '5h 45min', isCompleted: false, isLocked: false },
          { id: 4, title: 'Neural Networks & Deep Learning', duration: '7h 20min', isCompleted: false, isLocked: false },
        ]
      }
    ],
    'Design': [
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
          { id: 1, title: 'Design Principles Fundamentals', duration: '1h 30min', isCompleted: false, isLocked: false },
          { id: 2, title: 'Color Theory & Typography', duration: '2h 15min', isCompleted: false, isLocked: false },
          { id: 3, title: 'User Research Methods', duration: '2h 45min', isCompleted: false, isLocked: false },
          { id: 4, title: 'Prototyping with Figma', duration: '3h 20min', isCompleted: false, isLocked: false },
        ]
      },
      {
        id: 10,
        title: 'Graphic Design Bootcamp',
        instructor: 'Jessica Miller',
        rating: 4.6,
        students: 8900,
        duration: '20 hours',
        level: 'Beginner',
        price: 64.99,
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
        progress: 0,
        isEnrolled: false,
        isLocked: false,
        videos: [
          { id: 1, title: 'Design Principles & Theory', duration: '2h 15min', isCompleted: false, isLocked: false },
          { id: 2, title: 'Adobe Photoshop Mastery', duration: '4h 30min', isCompleted: false, isLocked: false },
          { id: 3, title: 'Adobe Illustrator Essentials', duration: '3h 45min', isCompleted: false, isLocked: false },
          { id: 4, title: 'Building a Portfolio', duration: '2h 20min', isCompleted: false, isLocked: false },
        ]
      }
    ],
    'Business': [
      {
        id: 6,
        title: 'Digital Marketing Strategy',
        instructor: 'Lisa Martinez',
        rating: 4.5,
        students: 15600,
        duration: '18 hours',
        level: 'Beginner',
        price: 54.99,
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
        progress: 0,
        isEnrolled: false,
        isLocked: false,
        videos: [
          { id: 1, title: 'Marketing Fundamentals', duration: '2h 15min', isCompleted: false, isLocked: false },
          { id: 2, title: 'Social Media Marketing', duration: '3h 30min', isCompleted: false, isLocked: false },
          { id: 3, title: 'SEO & Content Strategy', duration: '2h 45min', isCompleted: false, isLocked: false },
          { id: 4, title: 'Analytics & Performance Tracking', duration: '2h 20min', isCompleted: false, isLocked: false },
        ]
      },
      {
        id: 11,
        title: 'Project Management Professional',
        instructor: 'Thomas Anderson',
        rating: 4.8,
        students: 11200,
        duration: '30 hours',
        level: 'Intermediate',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=250&fit=crop',
        progress: 0,
        isEnrolled: false,
        isLocked: false,
        videos: [
          { id: 1, title: 'Project Management Fundamentals', duration: '3h 30min', isCompleted: false, isLocked: false },
          { id: 2, title: 'Agile & Scrum Methodologies', duration: '4h 15min', isCompleted: false, isLocked: false },
          { id: 3, title: 'Risk Management & Planning', duration: '3h 45min', isCompleted: false, isLocked: false },
          { id: 4, title: 'Team Leadership & Communication', duration: '4h 20min', isCompleted: false, isLocked: false },
        ]
      }
    ]
  };

  const categories = [
    { name: 'Web Development', icon: Code, color: 'from-blue-500 to-blue-600', count: coursesByCategory['Web Development'].length },
    { name: 'Mobile Apps', icon: Smartphone, color: 'from-purple-500 to-purple-600', count: coursesByCategory['Mobile Apps'].length },
    { name: 'Data Science', icon: FlaskConical, color: 'from-green-500 to-green-600', count: coursesByCategory['Data Science'].length },
    { name: 'Design', icon: Palette, color: 'from-pink-500 to-pink-600', count: coursesByCategory['Design'].length },
    { name: 'Business', icon: Briefcase, color: 'from-orange-500 to-orange-600', count: coursesByCategory['Business'].length }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Course Categories</h1>
        <p className="text-muted-foreground">Choose a category and enroll in courses that match your interests</p>
      </div>

      {/* Categories with Courses */}
      <div className="space-y-8">
        {categories.map((category) => {
          const CategoryIcon = category.icon;
          const categoryCourses = coursesByCategory[category.name as keyof typeof coursesByCategory];

          return (
            <Card key={category.name} className="overflow-hidden">
              {/* Category Header */}
              <div className={`bg-gradient-to-r ${category.color} p-6 text-white`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <CategoryIcon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-1">{category.name}</h2>
                    <p className="text-white/80">{category.count} courses available</p>
                  </div>
                  <Badge className="bg-white/20 text-white border-0 px-4 py-2">
                    {category.name}
                  </Badge>
                </div>
              </div>

              {/* Courses Grid in Category */}
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      {/* Course Image */}
                      <div className="relative">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-40 object-cover"
                        />
                        {course.isLocked && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Lock className="w-6 h-6 text-white" />
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

                      <CardContent className="p-4">
                        {/* Course Title */}
                        <h3 className="font-semibold text-base mb-2 line-clamp-2">{course.title}</h3>

                        {/* Instructor */}
                        <p className="text-xs text-muted-foreground mb-3">{course.instructor}</p>

                        {/* Course Stats */}
                        <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span>{course.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{course.students.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{course.duration}</span>
                          </div>
                        </div>

                        {/* Level Badge */}
                        <div className="mb-3">
                          <Badge variant="secondary" className="border-0 text-xs">
                            {course.level}
                          </Badge>
                        </div>

                        {/* Show Videos Button (for enrolled courses) */}
                        {course.isEnrolled && (
                          <Button
                            variant="outline"
                            className="w-full rounded-xl h-9 mb-3 text-xs"
                            onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
                          >
                            {expandedCourse === course.id ? (
                              <>
                                <ChevronUp className="w-3 h-3 mr-1" />
                                Hide ({course.videos.length})
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-3 h-3 mr-1" />
                                Videos ({course.videos.length})
                              </>
                            )}
                          </Button>
                        )}

                        {/* Video List (when expanded) */}
                        {expandedCourse === course.id && (
                          <div className="mb-3 max-h-48 overflow-y-auto border rounded-lg p-2 bg-[var(--teal-50)]">
                            <h4 className="font-medium text-xs mb-2">Course Videos:</h4>
                            <div className="space-y-1">
                              {course.videos.map((video, index) => (
                                <div
                                  key={video.id}
                                  className={`flex items-center gap-2 p-1 rounded transition-colors ${
                                    video.isLocked
                                      ? 'bg-gray-100 opacity-60 cursor-not-allowed'
                                      : 'bg-white hover:bg-[var(--teal-100)] cursor-pointer'
                                  }`}
                                >
                                  <div className="flex items-center gap-1">
                                    {video.isCompleted ? (
                                      <CheckCircle className="w-3 h-3 text-green-500" />
                                    ) : video.isLocked ? (
                                      <Lock className="w-3 h-3 text-gray-400" />
                                    ) : (
                                      <Circle className="w-3 h-3 text-gray-400" />
                                    )}
                                    <span className="text-xs text-muted-foreground w-4">
                                      {index + 1}.
                                    </span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-xs truncate ${video.isLocked ? 'text-gray-500' : 'text-foreground'}`}>
                                      {video.title}
                                    </p>
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {video.duration}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action Button */}
                        {course.isEnrolled ? (
                          <Button
                            className="w-full rounded-xl h-9 text-xs"
                            onClick={() => onNavigate('knowledge')}
                          >
                            <Play className="w-3 h-3 mr-1" />
                            {course.progress > 0 ? 'Continue' : 'Start'}
                          </Button>
                        ) : course.isLocked ? (
                          <Button variant="outline" className="w-full rounded-xl h-9 text-xs" disabled>
                            <Lock className="w-3 h-3 mr-1" />
                            Locked
                          </Button>
                        ) : (
                          <Button className="w-full rounded-xl h-9 text-xs">
                            <BookOpen className="w-3 h-3 mr-1" />
                            Enroll ${course.price}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}