'use client';

import { Code, Smartphone, FlaskConical, Palette, Briefcase, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface CategoryOverviewPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export function CategoryOverviewPage({ onNavigate }: CategoryOverviewPageProps) {
  const categories = [
    {
      name: 'Web Development',
      icon: Code,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop',
      description: 'Master modern web technologies including HTML, CSS, JavaScript, React, Node.js and more. Build responsive websites and web applications.',
      courseCount: 3,
      totalHours: 84,
      difficulty: 'Beginner to Advanced'
    },
    {
      name: 'Mobile Apps',
      icon: Smartphone,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=300&fit=crop',
      description: 'Create native and cross-platform mobile applications using React Native, Flutter, and modern mobile development frameworks.',
      courseCount: 2,
      totalHours: 76,
      difficulty: 'Beginner to Intermediate'
    },
    {
      name: 'Data Science',
      icon: FlaskConical,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop',
      description: 'Dive into data analysis, machine learning, and artificial intelligence with Python, R, and cutting-edge data science tools.',
      courseCount: 2,
      totalHours: 90,
      difficulty: 'Beginner to Advanced'
    },
    {
      name: 'Design',
      icon: Palette,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&h=300&fit=crop',
      description: 'Learn UI/UX design principles, graphic design, and tools like Figma, Adobe Creative Suite, and modern design workflows.',
      courseCount: 2,
      totalHours: 44,
      difficulty: 'Beginner to Intermediate'
    },
    {
      name: 'Business',
      icon: Briefcase,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=300&fit=crop',
      description: 'Develop business acumen with courses in digital marketing, project management, entrepreneurship, and professional skills.',
      courseCount: 2,
      totalHours: 48,
      difficulty: 'Beginner to Intermediate'
    }
  ];

  const handleCategoryClick = (categoryName: string) => {
    onNavigate('category-courses', { category: categoryName });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Course Categories</h1>
        <p className="text-muted-foreground">Choose a category to start your learning journey</p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const CategoryIcon = category.icon;

          return (
            <Card
              key={category.name}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => handleCategoryClick(category.name)}
            >
              {/* Category Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Category Icon Overlay */}
                <div className="absolute top-4 left-4">
                  <div className={`w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg`}>
                    <CategoryIcon className={`w-6 h-6 bg-gradient-to-r ${category.color} bg-clip-text text-transparent`} />
                  </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-black border-0 backdrop-blur-sm">
                    {category.courseCount} courses
                  </Badge>
                </div>

                {/* Category Title */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white text-xl font-bold mb-1">{category.name}</h3>
                  <p className="text-white/80 text-sm">{category.totalHours} total hours</p>
                </div>
              </div>

              {/* Category Content */}
              <CardContent className="p-5">
                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {category.description}
                </p>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className={`p-3 rounded-lg ${category.bgColor} ${category.borderColor} border`}>
                    <p className="text-xs text-muted-foreground mb-1">Courses</p>
                    <p className="text-lg font-semibold">{category.courseCount}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${category.bgColor} ${category.borderColor} border`}>
                    <p className="text-xs text-muted-foreground mb-1">Hours</p>
                    <p className="text-lg font-semibold">{category.totalHours}</p>
                  </div>
                </div>

                {/* Difficulty Badge */}
                <div className="mb-4">
                  <Badge variant="outline" className={`${category.borderColor} border-0 ${category.bgColor} text-foreground`}>
                    {category.difficulty}
                  </Badge>
                </div>

                {/* Explore Button */}
                <Button
                  className={`w-full rounded-xl bg-gradient-to-r ${category.color} hover:shadow-md transition-all duration-300`}
                >
                  Explore {category.name}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bottom Stats */}
      <div className="mt-12 p-6 bg-gradient-to-r from-[var(--teal-50)] to-[var(--mint)] rounded-2xl">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Start Learning Today</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-3xl font-bold text-[var(--teal-600)] mb-1">11</p>
              <p className="text-sm text-muted-foreground">Total Courses</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[var(--teal-600)] mb-1">5</p>
              <p className="text-sm text-muted-foreground">Categories</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[var(--teal-600)] mb-1">342</p>
              <p className="text-sm text-muted-foreground">Total Hours</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[var(--teal-600)] mb-1">24/7</p>
              <p className="text-sm text-muted-foreground">Access</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}