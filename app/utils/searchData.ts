// Search data structure for hybrid search implementation
// This combines page navigation with mock content data

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'page' | 'course' | 'lesson' | 'user' | 'mission' | 'reward';
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  duration?: string;
  instructor?: string;
  enrolled?: number;
  rating?: number;
  icon?: string;
  route?: string;
}

// Mock course data
const mockCourses: SearchResult[] = [
  {
    id: 'course-1',
    title: 'Introduction to Python',
    description: 'Learn Python programming from scratch with hands-on projects',
    type: 'course',
    category: 'Programming',
    difficulty: 'beginner',
    duration: '8 weeks',
    instructor: 'Sarah Chen',
    enrolled: 1234,
    rating: 4.8,
    icon: '🐍'
  },
  {
    id: 'course-2',
    title: 'Web Development Bootcamp',
    description: 'Complete web development course covering HTML, CSS, JavaScript, React',
    type: 'course',
    category: 'Web Development',
    difficulty: 'intermediate',
    duration: '12 weeks',
    instructor: 'Mike Johnson',
    enrolled: 892,
    rating: 4.9,
    icon: '💻'
  },
  {
    id: 'course-3',
    title: 'Data Science Fundamentals',
    description: 'Master data analysis, visualization, and machine learning basics',
    type: 'course',
    category: 'Data Science',
    difficulty: 'intermediate',
    duration: '10 weeks',
    instructor: 'Dr. Lisa Wang',
    enrolled: 756,
    rating: 4.7,
    icon: '📊'
  },
  {
    id: 'course-4',
    title: 'Digital Marketing Mastery',
    description: 'Learn SEO, social media marketing, and digital advertising strategies',
    type: 'course',
    category: 'Marketing',
    difficulty: 'beginner',
    duration: '6 weeks',
    instructor: 'Alex Rivera',
    enrolled: 445,
    rating: 4.6,
    icon: '📱'
  }
];

// Mock lesson data
const mockLessons: SearchResult[] = [
  {
    id: 'lesson-1',
    title: 'Variables and Data Types',
    description: 'Understanding Python variables, integers, floats, and strings',
    type: 'lesson',
    category: 'Programming',
    duration: '45 min',
    icon: '📝'
  },
  {
    id: 'lesson-2',
    title: 'CSS Grid Layout',
    description: 'Master CSS Grid for creating responsive layouts',
    type: 'lesson',
    category: 'Web Development',
    duration: '60 min',
    icon: '🎨'
  },
  {
    id: 'lesson-3',
    title: 'Introduction to Pandas',
    description: 'Learn data manipulation with Python Pandas library',
    type: 'lesson',
    category: 'Data Science',
    duration: '90 min',
    icon: '🐼'
  }
];

// Mock missions data
const mockMissions: SearchResult[] = [
  {
    id: 'mission-1',
    title: 'Complete 5 Python Exercises',
    description: 'Solve 5 Python programming challenges to earn points',
    type: 'mission',
    category: 'Daily',
    icon: '✅'
  },
  {
    id: 'mission-2',
    title: 'Study Streak: 7 Days',
    description: 'Maintain a 7-day study streak to unlock rewards',
    type: 'mission',
    category: 'Weekly',
    icon: '🔥'
  },
  {
    id: 'mission-3',
    title: 'Help a Fellow Student',
    description: 'Answer questions in the community forum',
    type: 'mission',
    category: 'Community',
    icon: '🤝'
  }
];

// Mock user data
const mockUsers: SearchResult[] = [
  {
    id: 'user-1',
    title: 'Sarah Chen',
    description: 'Python instructor with 5+ years of experience',
    type: 'user',
    category: 'Instructor',
    icon: '👩‍🏫'
  },
  {
    id: 'user-2',
    title: 'Mike Johnson',
    description: 'Full-stack developer and web development expert',
    type: 'user',
    category: 'Instructor',
    icon: '👨‍🏫'
  }
];

// Page navigation data
const pageRoutes: SearchResult[] = [
  {
    id: 'page-home',
    title: 'Home',
    description: 'Main dashboard with your learning progress',
    type: 'page',
    route: 'home',
    icon: '🏠'
  },
  {
    id: 'page-profile',
    title: 'Profile',
    description: 'View and edit your profile information',
    type: 'page',
    route: 'profile',
    icon: '👤'
  },
  {
    id: 'page-missions',
    title: 'Missions',
    description: 'Complete daily and weekly missions for rewards',
    type: 'page',
    route: 'missions',
    icon: '🎯'
  },
  {
    id: 'page-rewards',
    title: 'Rewards',
    description: 'View your earned rewards and achievements',
    type: 'page',
    route: 'rewards',
    icon: '🏆'
  },
  {
    id: 'page-focus',
    title: 'Focus Mode',
    description: 'Distraction-free learning environment',
    type: 'page',
    route: 'focus',
    icon: '🎯'
  },
  {
    id: 'page-community',
    title: 'Community',
    description: 'Connect with other learners',
    type: 'page',
    route: 'community',
    icon: '👥'
  },
  {
    id: 'page-games',
    title: 'Games',
    description: 'Educational games and quizzes',
    type: 'page',
    route: 'games',
    icon: '🎮'
  },
  {
    id: 'page-analysis',
    title: 'Analysis',
    description: 'View your learning statistics and progress',
    type: 'page',
    route: 'analysis',
    icon: '📈'
  },
  {
    id: 'page-courses',
    title: 'Courses',
    description: 'Browse and enroll in courses',
    type: 'page',
    route: 'courses',
    icon: '📚'
  }
];

// Combine all search data
const allSearchData = [
  ...pageRoutes,
  ...mockCourses,
  ...mockLessons,
  ...mockMissions,
  ...mockUsers
];

// Search function
export function search(query: string): SearchResult[] {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const searchTerm = query.toLowerCase().trim();

  return allSearchData
    .filter(item => {
      // Search in title, description, and category
      return (
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.category?.toLowerCase().includes(searchTerm) ||
        item.instructor?.toLowerCase().includes(searchTerm)
      );
    })
    .sort((a, b) => {
      // Prioritize exact title matches
      const aExactMatch = a.title.toLowerCase() === searchTerm;
      const bExactMatch = b.title.toLowerCase() === searchTerm;

      if (aExactMatch && !bExactMatch) return -1;
      if (!aExactMatch && bExactMatch) return 1;

      // Then prioritize partial title matches
      const aTitleMatch = a.title.toLowerCase().includes(searchTerm);
      const bTitleMatch = b.title.toLowerCase().includes(searchTerm);

      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;

      // Then prioritize page results
      if (a.type === 'page' && b.type !== 'page') return -1;
      if (a.type !== 'page' && b.type === 'page') return 1;

      return 0;
    })
    .slice(0, 10); // Limit to 10 results
}

// Direct navigation function - returns route if exact match found
export function getDirectNavigation(query: string): string | null {
  if (!query || query.trim().length < 2) {
    return null;
  }

  const searchTerm = query.toLowerCase().trim();

  // First try exact title match for pages
  const exactPageMatch = allSearchData.find(item =>
    item.type === 'page' && item.title.toLowerCase() === searchTerm
  );

  if (exactPageMatch && exactPageMatch.route) {
    return exactPageMatch.route;
  }

  // Then try partial title match for pages (first result)
  const partialPageMatch = allSearchData.find(item =>
    item.type === 'page' && item.title.toLowerCase().includes(searchTerm)
  );

  if (partialPageMatch && partialPageMatch.route) {
    return partialPageMatch.route;
  }

  return null; // No direct navigation found
}

// Helper function to get type-specific styling
export function getSearchResultTypeStyling(type: SearchResult['type']) {
  switch (type) {
    case 'page':
      return {
        bgColor: 'bg-[var(--teal-50)]',
        borderColor: 'border-[var(--teal-200)]',
        textColor: 'text-[var(--teal-700)]',
        label: 'Page'
      };
    case 'course':
      return {
        bgColor: 'bg-[var(--blue-50)]',
        borderColor: 'border-[var(--blue-200)]',
        textColor: 'text-[var(--blue-700)]',
        label: 'Course'
      };
    case 'lesson':
      return {
        bgColor: 'bg-[var(--purple-50)]',
        borderColor: 'border-[var(--purple-200)]',
        textColor: 'text-[var(--purple-700)]',
        label: 'Lesson'
      };
    case 'mission':
      return {
        bgColor: 'bg-[var(--orange-50)]',
        borderColor: 'border-[var(--orange-200)]',
        textColor: 'text-[var(--orange-700)]',
        label: 'Mission'
      };
    case 'user':
      return {
        bgColor: 'bg-[var(--green-50)]',
        borderColor: 'border-[var(--green-200)]',
        textColor: 'text-[var(--green-700)]',
        label: 'Instructor'
      };
    default:
      return {
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        textColor: 'text-gray-700',
        label: 'Other'
      };
  }
}