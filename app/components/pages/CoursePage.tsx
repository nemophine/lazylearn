'use client';

import { useState } from 'react';
import { ChevronRight, Play, Clock, Users, Star, BookOpen, Filter, Search } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import {
  Course,
  CourseCategory,
  Subject,
  VideoLesson,
  courseCategories,
  getCoursesByCategory,
  getCourseById,
  getSubjectById,
  getVideoById
} from '../../utils/courseData';

interface CoursePageProps {
  onNavigate?: (page: string) => void;
}

type ViewMode = 'categories' | 'courses' | 'subjects' | 'videos';

export function CoursePage({ onNavigate }: CoursePageProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('categories');
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  // Filter courses based on search and level
  const filteredCourses = selectedCategory
    ? getCoursesByCategory(selectedCategory.id).filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
        return matchesSearch && matchesLevel;
      })
    : [];

  const handleCategoryClick = (category: CourseCategory) => {
    setSelectedCategory(category);
    setSelectedCourse(null);
    setSelectedSubject(null);
    setViewMode('courses');
  };

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setSelectedSubject(null);
    setViewMode('subjects');
  };

  const handleSubjectClick = (subject: Subject) => {
    setSelectedSubject(subject);
    setViewMode('videos');
  };

  const handleVideoClick = (video: VideoLesson) => {
    // Navigate to video player (KnowledgePage for now)
    onNavigate?.('knowledge');
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const renderCategories = () => (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Course Categories</h1>
        <p className="text-muted-foreground">Choose a category to explore courses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courseCategories.map((category) => (
          <Card
            key={category.id}
            className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white rounded-2xl overflow-hidden"
            onClick={() => handleCategoryClick(category)}
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className={`${category.color} w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-[var(--teal-600)] transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                  {category.description}
                </p>
                <div className="w-full flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-sm font-medium text-gray-600">{category.courseCount} courses</span>
                  <ChevronRight className="w-5 h-5 text-[var(--teal-600)] group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            onClick={() => setViewMode('categories')}
            className="text-[var(--teal-600)]"
          >
            ← Back to Categories
          </Button>
          {selectedCategory && (
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedCategory.icon}</span>
              <h1 className="text-3xl font-bold">{selectedCategory.name} Courses</h1>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={selectedLevel === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedLevel('all')}
              size="sm"
            >
              All Levels
            </Button>
            <Button
              variant={selectedLevel === 'beginner' ? 'default' : 'outline'}
              onClick={() => setSelectedLevel('beginner')}
              size="sm"
            >
              Beginner
            </Button>
            <Button
              variant={selectedLevel === 'intermediate' ? 'default' : 'outline'}
              onClick={() => setSelectedLevel('intermediate')}
              size="sm"
            >
              Intermediate
            </Button>
            <Button
              variant={selectedLevel === 'advanced' ? 'default' : 'outline'}
              onClick={() => setSelectedLevel('advanced')}
              size="sm"
            >
              Advanced
            </Button>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCourses.map((course) => (
          <Card
            key={course.id}
            className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white rounded-2xl overflow-hidden"
            onClick={() => handleCourseClick(course)}
          >
            <CardContent className="p-0">
              {/* Course Image */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3">
                  <Badge className={`${getLevelColor(course.level)} text-xs font-medium px-2 py-1`}>
                    {course.level}
                  </Badge>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Course Content */}
              <div className="p-5">
                {/* Title */}
                <h3 className="text-base font-semibold mb-2 line-clamp-2 leading-tight group-hover:text-[var(--teal-600)] transition-colors">
                  {course.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>

                {/* Course Stats */}
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Rating and Price */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{course.rating}</span>
                    <span className="text-xs text-muted-foreground">({course.students.toLocaleString()})</span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold text-[var(--teal-600)]">${course.price}</span>
                  </div>
                </div>

                {/* Course Info */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{course.subjects.length} subjects</span>
                  <span>{course.subjects.reduce((acc, s) => acc + s.totalLessons, 0)} lessons</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-2">No courses found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );

  const renderSubjects = () => {
    if (!selectedCourse) return null;

    return (
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => setViewMode('courses')}
              className="text-[var(--teal-600)]"
            >
              ← Back to Courses
            </Button>
          </div>

          <div className="bg-gradient-to-r from-[var(--teal-50)] to-[var(--mint)] rounded-2xl p-6">
            <div className="flex gap-6">
              <img
                src={selectedCourse.thumbnail}
                alt={selectedCourse.title}
                className="w-24 h-24 object-cover rounded-xl"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">{selectedCourse.title}</h1>
                <p className="text-muted-foreground mb-4">{selectedCourse.description}</p>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{selectedCourse.students.toLocaleString()} students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{selectedCourse.rating} rating</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{selectedCourse.duration}</span>
                  </div>
                  <Badge className={getLevelColor(selectedCourse.level)}>
                    {selectedCourse.level}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subjects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {selectedCourse.subjects.map((subject) => (
            <Card
              key={subject.id}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white rounded-2xl overflow-hidden"
              onClick={() => handleSubjectClick(subject)}
            >
              <CardContent className="p-0">
                {/* Subject Image */}
                <div className="relative h-36 overflow-hidden bg-gray-100">
                  <img
                    src={subject.thumbnail}
                    alt={subject.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className={`${getLevelColor(subject.difficulty)} text-xs font-medium px-2 py-1`}>
                      {subject.difficulty}
                    </Badge>
                  </div>
                </div>

                {/* Subject Content */}
                <div className="p-5">
                  <h3 className="text-base font-semibold mb-2 line-clamp-2 leading-tight group-hover:text-[var(--teal-600)] transition-colors">
                    {subject.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                    {subject.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{subject.totalLessons} lessons</span>
                    <span>{subject.duration}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderVideos = () => {
    if (!selectedSubject) return null;

    return (
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => setViewMode('subjects')}
              className="text-[var(--teal-600)]"
            >
              ← Back to Subjects
            </Button>
          </div>

          <div className="bg-gradient-to-r from-[var(--teal-50)] to-[var(--mint)] rounded-2xl p-6">
            <h1 className="text-2xl font-bold mb-2">{selectedSubject.title}</h1>
            <p className="text-muted-foreground mb-4">{selectedSubject.description}</p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{selectedSubject.totalLessons} lessons</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{selectedSubject.duration}</span>
              </div>
              <Badge className={getLevelColor(selectedSubject.difficulty)}>
                {selectedSubject.difficulty}
              </Badge>
            </div>
          </div>
        </div>

        {/* Video Lessons */}
        <div className="space-y-4">
          {selectedSubject.lessons.map((video, index) => (
            <Card
              key={video.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleVideoClick(video)}
            >
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <div className="relative w-48 h-28 flex-shrink-0">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                      <Play className="w-12 h-12 text-white fill-current" />
                    </div>
                    {video.progress !== undefined && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <Progress value={video.progress} className="h-1 bg-white/30" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold line-clamp-2">{video.title}</h3>
                      <span className="text-sm text-muted-foreground">#{index + 1}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{video.description}</p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{video.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{video.views.toLocaleString()} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs">Instructor:</span>
                        <span>{video.instructor}</span>
                      </div>
                    </div>

                    {video.progress !== undefined && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>Progress</span>
                          <span>{video.progress}% complete</span>
                        </div>
                        <Progress value={video.progress} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // Render based on current view mode
  switch (viewMode) {
    case 'categories':
      return renderCategories();
    case 'courses':
      return renderCourses();
    case 'subjects':
      return renderSubjects();
    case 'videos':
      return renderVideos();
    default:
      return renderCategories();
  }
}