// Course data structure with categories, subjects, and video lessons

export interface VideoLesson {
  id: string;
  title: string;
  duration: string;
  description: string;
  thumbnail: string;
  instructor: string;
  views: number;
  progress?: number;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface Subject {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: VideoLesson[];
  totalLessons: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  thumbnail: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  instructor: string;
  rating: number;
  students: number;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  subjects: Subject[];
  tags: string[];
}

export interface CourseCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  courseCount: number;
}

// Course Categories
export const courseCategories: CourseCategory[] = [
  {
    id: 'programming',
    name: 'Programming',
    description: 'Learn coding languages and development',
    icon: '💻',
    color: 'bg-blue-500',
    courseCount: 12
  },
  {
    id: 'design',
    name: 'Design',
    description: 'UI/UX design, graphics, and creativity',
    icon: '🎨',
    color: 'bg-purple-500',
    courseCount: 8
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Entrepreneurship and business skills',
    icon: '📊',
    color: 'bg-green-500',
    courseCount: 6
  },
  {
    id: 'language',
    name: 'Languages',
    description: 'Learn new languages and communication',
    icon: '🗣️',
    color: 'bg-orange-500',
    courseCount: 10
  },
  {
    id: 'science',
    name: 'Science',
    description: 'Math, physics, chemistry, and more',
    icon: '🔬',
    color: 'bg-red-500',
    courseCount: 9
  },
  {
    id: 'arts',
    name: 'Arts',
    description: 'Music, drawing, and creative arts',
    icon: '🎭',
    color: 'bg-pink-500',
    courseCount: 7
  }
];

// Course Data
export const coursesData: Course[] = [
  {
    id: 'course-1',
    title: 'Complete Python Programming',
    description: 'Master Python from basics to advanced concepts with hands-on projects',
    category: 'programming',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935',
    instructor: 'Sarah Chen',
    rating: 4.8,
    students: 15420,
    duration: '8 weeks',
    level: 'beginner',
    price: 49.99,
    tags: ['python', 'programming', 'beginner'],
    subjects: [
      {
        id: 'python-basics',
        title: 'Python Basics',
        description: 'Learn fundamental Python concepts',
        duration: '2 weeks',
        totalLessons: 12,
        difficulty: 'beginner',
        thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935',
        lessons: [
          {
            id: 'python-1',
            title: 'Introduction to Python',
            duration: '15:30',
            description: 'What is Python and why learn it?',
            thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935',
            instructor: 'Sarah Chen',
            views: 25000,
            progress: 100,
            level: 'beginner'
          },
          {
            id: 'python-2',
            title: 'Variables and Data Types',
            duration: '22:45',
            description: 'Understanding Python variables, numbers, strings',
            thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935',
            instructor: 'Sarah Chen',
            views: 22000,
            progress: 85,
            level: 'beginner'
          },
          {
            id: 'python-3',
            title: 'Control Flow and Loops',
            duration: '28:15',
            description: 'If statements, for loops, while loops',
            thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935',
            instructor: 'Sarah Chen',
            views: 20000,
            progress: 60,
            level: 'beginner'
          }
        ]
      },
      {
        id: 'python-data',
        title: 'Data Structures in Python',
        description: 'Lists, dictionaries, sets, and tuples',
        duration: '3 weeks',
        totalLessons: 15,
        difficulty: 'intermediate',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
        lessons: [
          {
            id: 'python-data-1',
            title: 'Lists and List Methods',
            duration: '25:30',
            description: 'Working with Python lists',
            thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
            instructor: 'Sarah Chen',
            views: 18000,
            level: 'intermediate'
          },
          {
            id: 'python-data-2',
            title: 'Dictionaries and JSON',
            duration: '20:45',
            description: 'Key-value pairs and JSON handling',
            thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
            instructor: 'Sarah Chen',
            views: 16000,
            level: 'intermediate'
          }
        ]
      }
    ]
  },
  {
    id: 'course-2',
    title: 'Web Development Bootcamp',
    description: 'Build modern websites with HTML, CSS, JavaScript, and React',
    category: 'programming',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    instructor: 'Mike Johnson',
    rating: 4.9,
    students: 23500,
    duration: '12 weeks',
    level: 'intermediate',
    price: 79.99,
    tags: ['web', 'javascript', 'react', 'css'],
    subjects: [
      {
        id: 'web-html-css',
        title: 'HTML & CSS Fundamentals',
        description: 'Build responsive web layouts',
        duration: '3 weeks',
        totalLessons: 18,
        difficulty: 'beginner',
        thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
        lessons: [
          {
            id: 'web-1',
            title: 'HTML5 Semantic Elements',
            duration: '18:30',
            description: 'Modern HTML5 structure and semantics',
            thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
            instructor: 'Mike Johnson',
            views: 30000,
            level: 'beginner'
          },
          {
            id: 'web-2',
            title: 'CSS Grid and Flexbox',
            duration: '32:15',
            description: 'Modern CSS layout techniques',
            thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
            instructor: 'Mike Johnson',
            views: 28000,
            level: 'beginner'
          }
        ]
      },
      {
        id: 'web-javascript',
        title: 'JavaScript Essentials',
        description: 'Dynamic web programming with JavaScript',
        duration: '4 weeks',
        totalLessons: 20,
        difficulty: 'intermediate',
        thumbnail: 'https://images.unsplash.com/photo-1579468438874-4583a6c0b4f2',
        lessons: [
          {
            id: 'web-js-1',
            title: 'JavaScript Fundamentals',
            duration: '25:45',
            description: 'Variables, functions, and scope',
            thumbnail: 'https://images.unsplash.com/photo-1579468438874-4583a6c0b4f2',
            instructor: 'Mike Johnson',
            views: 35000,
            level: 'intermediate'
          },
          {
            id: 'web-js-2',
            title: 'DOM Manipulation',
            duration: '28:30',
            description: 'Interactive web pages with JavaScript',
            thumbnail: 'https://images.unsplash.com/photo-1579468438874-4583a6c0b4f2',
            instructor: 'Mike Johnson',
            views: 32000,
            level: 'intermediate'
          }
        ]
      }
    ]
  },
  {
    id: 'course-3',
    title: 'UI/UX Design Mastery',
    description: 'Create beautiful and functional user interfaces',
    category: 'design',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
    instructor: 'Emily Davis',
    rating: 4.7,
    students: 12800,
    duration: '6 weeks',
    level: 'beginner',
    price: 59.99,
    tags: ['ui', 'ux', 'design', 'figma'],
    subjects: [
      {
        id: 'design-fundamentals',
        title: 'Design Fundamentals',
        description: 'Color theory, typography, and layout',
        duration: '2 weeks',
        totalLessons: 10,
        difficulty: 'beginner',
        thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
        lessons: [
          {
            id: 'design-1',
            title: 'Color Theory and Palettes',
            duration: '20:30',
            description: 'Understanding color in design',
            thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
            instructor: 'Emily Davis',
            views: 18000,
            level: 'beginner'
          },
          {
            id: 'design-2',
            title: 'Typography Basics',
            duration: '18:45',
            description: 'Working with fonts and text',
            thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
            instructor: 'Emily Davis',
            views: 16000,
            level: 'beginner'
          }
        ]
      }
    ]
  },
  {
    id: 'course-4',
    title: 'Spanish for Beginners',
    description: 'Learn Spanish from scratch with practical lessons',
    category: 'language',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    instructor: 'Maria Rodriguez',
    rating: 4.6,
    students: 9500,
    duration: '10 weeks',
    level: 'beginner',
    price: 39.99,
    tags: ['spanish', 'language', 'beginner'],
    subjects: [
      {
        id: 'spanish-basics',
        title: 'Spanish Fundamentals',
        description: 'Basic Spanish vocabulary and grammar',
        duration: '4 weeks',
        totalLessons: 20,
        difficulty: 'beginner',
        thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
        lessons: [
          {
            id: 'spanish-1',
            title: 'Alphabet and Pronunciation',
            duration: '15:20',
            description: 'Spanish alphabet and basic sounds',
            thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
            instructor: 'Maria Rodriguez',
            views: 12000,
            level: 'beginner'
          },
          {
            id: 'spanish-2',
            title: 'Basic Greetings and Introductions',
            duration: '12:30',
            description: 'Essential Spanish phrases',
            thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
            instructor: 'Maria Rodriguez',
            views: 11000,
            level: 'beginner'
          }
        ]
      }
    ]
  },
  {
    id: 'course-5',
    title: 'Business Fundamentals',
    description: 'Essential business concepts and entrepreneurship',
    category: 'business',
    thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7',
    instructor: 'David Miller',
    rating: 4.5,
    students: 7800,
    duration: '4 weeks',
    level: 'beginner',
    price: 44.99,
    tags: ['business', 'entrepreneurship', 'marketing'],
    subjects: [
      {
        id: 'business-basics',
        title: 'Business Fundamentals',
        description: 'Core business concepts and strategies',
        duration: '2 weeks',
        totalLessons: 8,
        difficulty: 'beginner',
        thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7',
        lessons: [
          {
            id: 'business-1',
            title: 'Business Models and Strategies',
            duration: '25:45',
            description: 'Understanding different business models',
            thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7',
            instructor: 'David Miller',
            views: 9500,
            level: 'beginner'
          },
          {
            id: 'business-2',
            title: 'Marketing Fundamentals',
            duration: '22:30',
            description: 'Basic marketing concepts',
            thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7',
            instructor: 'David Miller',
            views: 8800,
            level: 'beginner'
          }
        ]
      }
    ]
  },
  {
    id: 'course-6',
    title: 'Physics Made Easy',
    description: 'Learn physics with simple explanations and examples',
    category: 'science',
    thumbnail: 'https://images.unsplash.com/photo-1532094349384-538bc854c6e0',
    instructor: 'Dr. Robert Lee',
    rating: 4.4,
    students: 6500,
    duration: '8 weeks',
    level: 'beginner',
    price: 54.99,
    tags: ['physics', 'science', 'education'],
    subjects: [
      {
        id: 'physics-mechanics',
        title: 'Classical Mechanics',
        description: 'Motion, forces, and energy',
        duration: '4 weeks',
        totalLessons: 16,
        difficulty: 'beginner',
        thumbnail: 'https://images.unsplash.com/photo-1532094349384-538bc854c6e0',
        lessons: [
          {
            id: 'physics-1',
            title: 'Introduction to Motion',
            duration: '20:15',
            description: 'Basic concepts of motion and velocity',
            thumbnail: 'https://images.unsplash.com/photo-1532094349384-538bc854c6e0',
            instructor: 'Dr. Robert Lee',
            views: 8000,
            level: 'beginner'
          },
          {
            id: 'physics-2',
            title: 'Forces and Newtons Laws',
            duration: '28:30',
            description: 'Understanding forces and motion',
            thumbnail: 'https://images.unsplash.com/photo-1532094349384-538bc854c6e0',
            instructor: 'Dr. Robert Lee',
            views: 7500,
            level: 'beginner'
          }
        ]
      }
    ]
  },
  {
    id: 'course-7',
    title: 'Digital Drawing and Illustration',
    description: 'Learn digital art with modern tools and techniques',
    category: 'arts',
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e2b1e7a5c3c',
    instructor: 'Lisa Wang',
    rating: 4.8,
    students: 10200,
    duration: '6 weeks',
    level: 'intermediate',
    price: 64.99,
    tags: ['art', 'drawing', 'illustration', 'digital'],
    subjects: [
      {
        id: 'art-digital',
        title: 'Digital Drawing Basics',
        description: 'Fundamentals of digital illustration',
        duration: '3 weeks',
        totalLessons: 12,
        difficulty: 'intermediate',
        thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e2b1e7a5c3c',
        lessons: [
          {
            id: 'art-1',
            title: 'Digital Drawing Tools',
            duration: '18:45',
            description: 'Overview of digital art software',
            thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e2b1e7a5c3c',
            instructor: 'Lisa Wang',
            views: 15000,
            level: 'intermediate'
          },
          {
            id: 'art-2',
            title: 'Basic Drawing Techniques',
            duration: '25:30',
            description: 'Fundamental drawing skills digitally',
            thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e2b1e7a5c3c',
            instructor: 'Lisa Wang',
            views: 14000,
            level: 'intermediate'
          }
        ]
      }
    ]
  }
];

// Helper functions
export function getCoursesByCategory(categoryId: string): Course[] {
  return coursesData.filter(course => course.category === categoryId);
}

export function getCourseById(courseId: string): Course | undefined {
  return coursesData.find(course => course.id === courseId);
}

export function getSubjectById(courseId: string, subjectId: string): Subject | undefined {
  const course = getCourseById(courseId);
  return course?.subjects.find(subject => subject.id === subjectId);
}

export function getVideoById(courseId: string, subjectId: string, videoId: string): VideoLesson | undefined {
  const subject = getSubjectById(courseId, subjectId);
  return subject?.lessons.find(lesson => lesson.id === videoId);
}