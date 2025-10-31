'use client';

import { useState, useEffect } from 'react';
import { Search, X, Clock, TrendingUp, BookOpen, Video, Users, Hash, Star, User, Target, Trophy } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { search, SearchResult, getSearchResultTypeStyling } from '../../utils/searchData';

interface SearchPageProps {
  initialQuery?: string;
  onNavigate?: (page: string) => void;
}

export function SearchPage({ initialQuery = '', onNavigate }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    const results = search(searchQuery);
    setSearchResults(results);
  }, [searchQuery]);

  // Helper function to get icon for search result type
  const getResultIcon = (type: SearchResult['type'], icon?: string) => {
    if (icon) return icon;

    switch (type) {
      case 'page': return '📄';
      case 'course': return '📚';
      case 'lesson': return '📝';
      case 'mission': return '🎯';
      case 'user': return '👤';
      default: return '📄';
    }
  };

  // Helper function to handle result click
  const handleResultClick = (result: SearchResult) => {
    console.log('Clicked result:', result);
    if (result.type === 'page' && result.route && onNavigate) {
      console.log('Navigating to page:', result.route);
      onNavigate(result.route);
    } else {
      // For non-page results, you could navigate to a detail page
      console.log('Non-page result clicked:', result);
    }
  };

  const recentSearches = [
    'JavaScript basics',
    'UX Design',
    'Python tutorial',
    'Math formulas',
  ];

  const trendingTags = [
    { tag: 'WebDevelopment', count: '12.5k' },
    { tag: 'MachineLearning', count: '8.2k' },
    { tag: 'DigitalArt', count: '6.8k' },
    { tag: 'ProductivityTips', count: '5.4k' },
    { tag: 'MindfulLearning', count: '4.1k' },
    { tag: 'CodeChallenge', count: '3.9k' },
  ];

  const popularCategories = [
    { name: 'Courses', icon: BookOpen, color: 'bg-[var(--teal-300)]' },
    { name: 'Videos', icon: Video, color: 'bg-[var(--pink)]' },
    { name: 'Community', icon: Users, color: 'bg-[var(--lavender)]' },
  ];

  const suggestedResults = [
    { 
      title: 'Introduction to React', 
      type: 'Course',
      category: 'Web Development',
      rating: 4.8,
      students: '15k'
    },
    { 
      title: 'Advanced JavaScript Patterns', 
      type: 'Video',
      category: 'Programming',
      rating: 4.9,
      students: '8k'
    },
    { 
      title: 'Design Thinking Workshop', 
      type: 'Course',
      category: 'Design',
      rating: 4.7,
      students: '12k'
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Search Bar */}
      <div className="mb-8 max-w-3xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for courses, videos, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-12 h-12 rounded-2xl bg-[var(--teal-50)] border-0"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Categories and Recent Searches */}
        <div className="space-y-6">
          {/* Popular Categories */}
          <div>
            <h3 className="mb-4">Categories</h3>
            <div className="space-y-3">
              {popularCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.name}
                    className="w-full flex items-center gap-3 p-4 bg-card rounded-2xl hover:shadow-md transition-shadow border border-border"
                  >
                    <div className={`${category.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent Searches */}
          {!searchQuery && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3>Recent Searches</h3>
                <button className="text-sm text-[var(--teal-500)]">Clear</button>
              </div>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center gap-3 p-3 bg-card rounded-2xl hover:shadow-md transition-shadow border border-border"
                    onClick={() => setSearchQuery(search)}
                  >
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <span className="flex-1 text-left text-sm">{search}</span>
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Tags and Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trending Tags */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-[var(--teal-500)]" />
              <h3>Trending Tags</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {trendingTags.map((item, index) => (
                <button
                  key={index}
                  className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[var(--teal-100)] to-[var(--mint)] rounded-full hover:shadow-md transition-shadow"
                >
                  <Hash className="w-4 h-4 text-[var(--teal-600)]" />
                  <span>{item.tag}</span>
                  <span className="text-sm text-muted-foreground">({item.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Search Results or Suggestions */}
          <div>
            <h3 className="mb-4">
              {searchQuery ? `Search Results (${searchResults.length})` : 'Suggested for You'}
            </h3>

            {searchQuery && searchResults.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {searchResults.map((result) => {
                  const styling = getSearchResultTypeStyling(result.type);
                  return (
                    <Card
                      key={result.id}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleResultClick(result)}
                    >
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <div className={`w-20 h-20 ${styling.bgColor} border ${styling.borderColor} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                            <span className="text-3xl">{getResultIcon(result.type, result.icon)}</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium mb-2">{result.title}</p>
                            <div className="flex items-center gap-3 mb-3">
                              <Badge
                                variant="secondary"
                                className={`${styling.bgColor} ${styling.textColor} border-0`}
                              >
                                {styling.label}
                              </Badge>
                              {result.category && (
                                <span className="text-sm text-muted-foreground">{result.category}</span>
                              )}
                            </div>

                            {/* Additional details based on type */}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {result.duration && <span>⏱️ {result.duration}</span>}
                              {result.difficulty && <span>📚 {result.difficulty}</span>}
                              {result.instructor && <span>👨‍🏫 {result.instructor}</span>}
                              {result.enrolled && <span>👥 {result.enrolled} students</span>}
                              {result.rating && <span>⭐ {result.rating}</span>}
                            </div>

                            <p className="text-sm text-muted-foreground mt-2">{result.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : searchQuery && searchQuery.length >= 2 ? (
              // No results state
              <Card className="bg-[var(--teal-50)] border-0">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl mb-3">🔍</div>
                  <h3 className="mb-2">No results found for "{searchQuery}"</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Try searching with different keywords or browse our trending topics
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-4 py-2 bg-[var(--teal-500)] text-white rounded-xl hover:bg-[var(--teal-600)] transition-colors"
                  >
                    Clear Search
                  </button>
                </CardContent>
              </Card>
            ) : (
              // Show suggested results when no search query
              <div className="grid grid-cols-1 gap-4">
                {suggestedResults.map((result, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-[var(--teal-200)] to-[var(--teal-300)] rounded-2xl flex items-center justify-center flex-shrink-0">
                          {result.type === 'Course' ? (
                            <BookOpen className="w-10 h-10 text-[var(--teal-600)]" />
                          ) : (
                            <Video className="w-10 h-10 text-[var(--teal-600)]" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="mb-2">{result.title}</p>
                          <div className="flex items-center gap-3 mb-3">
                            <Badge variant="secondary" className="border-0">
                              {result.type}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{result.category}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>⭐ {result.rating}</span>
                            <span>•</span>
                            <span>{result.students} students</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
