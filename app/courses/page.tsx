'use client';

import { useState } from 'react';
import { CategoryOverviewPage } from '../components/pages/CategoryOverviewPage';
import { CategoryCoursesPage } from '../components/pages/CategoryCoursesPage';
import { CourseVideosPage } from '../components/pages/CourseVideosPage';
import { VideoPlayerPage } from '../components/pages/VideoPlayerPage';
import { PageLayout } from '../components/PageLayout';

export default function Courses() {
  const [currentPage, setCurrentPage] = useState<string>('categories');
  const [currentCategory, setCurrentCategory] = useState<string>('');
  const [currentCourseId, setCurrentCourseId] = useState<number | undefined>();
  const [currentVideoId, setCurrentVideoId] = useState<number | undefined>();

  const handleNavigate = (page: string, params?: any) => {
    console.log('Courses navigation:', { page, params });

    if (page === 'category-courses' && params?.category) {
      setCurrentCategory(params.category);
      setCurrentPage('category-courses');
      setCurrentCourseId(undefined);
      setCurrentVideoId(undefined);
    } else if (page === 'course-videos' && params?.category && params?.courseId) {
      setCurrentCategory(params.category);
      setCurrentCourseId(params.courseId);
      setCurrentPage('course-videos');
      setCurrentVideoId(undefined);
    } else if (page === 'video-player' && params?.category && params?.courseId && params?.videoId) {
      setCurrentCategory(params.category);
      setCurrentCourseId(params.courseId);
      setCurrentVideoId(params.videoId);
      setCurrentPage('video-player');
    } else if (page === 'courses') {
      setCurrentPage('categories');
      setCurrentCategory('');
      setCurrentCourseId(undefined);
      setCurrentVideoId(undefined);
    }
  };

  const renderPage = () => {
    if (currentPage === 'category-courses' && currentCategory) {
      return <CategoryCoursesPage onNavigate={handleNavigate} category={currentCategory} />;
    } else if (currentPage === 'course-videos' && currentCategory && currentCourseId) {
      return <CourseVideosPage onNavigate={handleNavigate} category={currentCategory} courseId={currentCourseId} />;
    } else if (currentPage === 'video-player' && currentCategory && currentCourseId && currentVideoId) {
      return <VideoPlayerPage onNavigate={handleNavigate} category={currentCategory} courseId={currentCourseId} videoId={currentVideoId} />;
    }
    return <CategoryOverviewPage onNavigate={handleNavigate} />;
  };

  return (
    <PageLayout activePage="/courses">
      {renderPage()}
    </PageLayout>
  );
}