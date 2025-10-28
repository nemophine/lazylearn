'use client';

import { Gamepad2, Brain, Puzzle, Zap, Trophy, Star, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

export function GameQuizPage() {
  const featuredGames = [
    { 
      id: 1,
      title: 'Math Challenge', 
      description: 'Test your math skills!',
      points: 50,
      players: '25k',
      difficulty: 'Easy',
      color: 'from-[var(--pink)] to-[var(--coral)]',
      icon: '🔢',
      completed: 12,
      total: 20
    },
    { 
      id: 2,
      title: 'Word Master', 
      description: 'Expand your vocabulary',
      points: 75,
      players: '18k',
      difficulty: 'Medium',
      color: 'from-[var(--lavender)] to-[var(--pink)]',
      icon: '📝',
      completed: 8,
      total: 15
    },
    { 
      id: 3,
      title: 'Logic Puzzles', 
      description: 'Brain teasers and riddles',
      points: 100,
      players: '32k',
      difficulty: 'Hard',
      color: 'from-[var(--teal-300)] to-[var(--mint)]',
      icon: '🧩',
      completed: 5,
      total: 25
    },
  ];

  const gameStore = [
    { title: 'Geography Quiz Pro', price: 500, icon: '🌍', rating: 4.8 },
    { title: 'Science Trivia', price: 300, icon: '🔬', rating: 4.7 },
    { title: 'History Adventure', price: 400, icon: '🏛️', rating: 4.9 },
    { title: 'Code Breaker', price: 600, icon: '💻', rating: 4.6 },
  ];

  const quizCategories = [
    { name: 'Science', icon: Brain, color: 'bg-[var(--teal-300)]' },
    { name: 'Math', icon: Zap, color: 'bg-[var(--pink)]' },
    { name: 'Language', icon: Puzzle, color: 'bg-[var(--lavender)]' },
  ];

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto">
      {/* Daily Challenge */}
      <Card className="mb-6 bg-gradient-to-br from-[var(--yellow)] to-[var(--peach)] border-0 shadow-lg overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-5 h-5 text-[var(--teal-600)]" />
                <h3 className="text-foreground">Daily Challenge</h3>
              </div>
              <p className="text-sm text-foreground/80">Complete 3 quizzes to earn bonus points!</p>
            </div>
            <div className="text-4xl">🎯</div>
          </div>
          <Progress value={66} className="h-2 bg-white/50 mb-2" />
          <p className="text-xs text-foreground/80">2/3 completed - 50 bonus points waiting!</p>
        </CardContent>
      </Card>

      {/* Quick Quiz Categories */}
      <div className="mb-6">
        <h3 className="mb-3">Quick Quiz</h3>
        <div className="grid grid-cols-3 gap-3">
          {quizCategories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.name}
                className="flex flex-col items-center gap-2 p-4 bg-card rounded-2xl hover:shadow-md transition-shadow border border-border"
              >
                <div className={`${category.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-center">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Games */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3>Featured Games</h3>
          <Gamepad2 className="w-5 h-5 text-[var(--teal-500)]" />
        </div>
        <div className="space-y-4">
          {featuredGames.map((game) => (
            <Card key={game.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className={`h-24 bg-gradient-to-br ${game.color} p-4 flex items-center justify-between`}>
                  <div>
                    <h4 className="text-white mb-1">{game.title}</h4>
                    <p className="text-sm text-white/90">{game.description}</p>
                  </div>
                  <div className="text-5xl">{game.icon}</div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{game.players} players</span>
                      <Badge variant="secondary" className="border-0">
                        {game.difficulty}
                      </Badge>
                    </div>
                    <Badge className="bg-[var(--yellow)] text-foreground border-0">
                      +{game.points} pts
                    </Badge>
                  </div>
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Progress</span>
                      <span>{game.completed}/{game.total} levels</span>
                    </div>
                    <Progress value={(game.completed / game.total) * 100} className="h-1.5" />
                  </div>
                  <Button className="w-full rounded-full bg-[var(--teal-400)] hover:bg-[var(--teal-500)]">
                    Continue Playing
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Game Store */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3>Game Store</h3>
          <ShoppingCart className="w-5 h-5 text-[var(--teal-500)]" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {gameStore.map((game, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="text-5xl text-center mb-3">{game.icon}</div>
                <p className="text-sm mb-2 text-center line-clamp-2 min-h-[2.5rem]">{game.title}</p>
                <div className="flex items-center justify-center gap-1 mb-3 text-xs">
                  <Star className="w-3 h-3 fill-[var(--yellow)] text-[var(--yellow)]" />
                  <span>{game.rating}</span>
                </div>
                <Button 
                  size="sm" 
                  className="w-full rounded-full bg-[var(--teal-400)] hover:bg-[var(--teal-500)] h-8"
                >
                  {game.price} pts
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Leaderboard Teaser */}
      <Card className="mt-6 bg-gradient-to-r from-[var(--lavender)] to-[var(--pink)] border-0">
        <CardContent className="p-6 text-center">
          <Trophy className="w-12 h-12 text-white mx-auto mb-3" />
          <h3 className="mb-2 text-white">Weekly Leaderboard</h3>
          <p className="text-sm text-white/90 mb-4">
            You're ranked #47 this week. Keep playing to climb higher!
          </p>
          <Button className="rounded-full bg-white text-foreground hover:bg-white/90">
            View Leaderboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
