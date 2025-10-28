'use client';

import { Book, ShoppingCart, Star, Play } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export function CartoonPage() {
  const myCartoons = [
    { id: 1, title: 'Math Adventures', episodes: 12, progress: 8, color: 'from-[var(--pink)] to-[var(--coral)]', emoji: '🔢' },
    { id: 2, title: 'Science Quest', episodes: 15, progress: 5, color: 'from-[var(--lavender)] to-[var(--pink)]', emoji: '🔬' },
    { id: 3, title: 'History Tales', episodes: 10, progress: 10, color: 'from-[var(--teal-300)] to-[var(--mint)]', emoji: '🏛️' },
  ];

  const storeCartoons = [
    { title: 'Grammar Galaxy', price: 300, rating: 4.9, episodes: 20, emoji: '📝' },
    { title: 'Coding Crew', price: 400, rating: 4.8, episodes: 18, emoji: '💻' },
    { title: 'Art Academy', price: 350, rating: 4.7, episodes: 16, emoji: '🎨' },
    { title: 'Music Makers', price: 300, rating: 4.9, episodes: 14, emoji: '🎵' },
  ];

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto">
      {/* Header */}
      <Card className="mb-6 bg-gradient-to-br from-[var(--yellow)] to-[var(--peach)] border-0 shadow-lg">
        <CardContent className="p-6 text-center">
          <div className="text-5xl mb-3">📺</div>
          <h2 className="mb-1">Cartoon Corner</h2>
          <p className="text-sm text-foreground/80">Learn through fun animated stories!</p>
        </CardContent>
      </Card>

      {/* My Cartoons */}
      <div className="mb-6">
        <h3 className="mb-3">My Cartoon Library</h3>
        <div className="space-y-3">
          {myCartoons.map((cartoon) => (
            <Card key={cartoon.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className={`h-24 bg-gradient-to-br ${cartoon.color} p-4 flex items-center justify-between`}>
                  <div>
                    <h4 className="text-white mb-1">{cartoon.title}</h4>
                    <p className="text-sm text-white/90">{cartoon.episodes} episodes</p>
                  </div>
                  <div className="text-5xl">{cartoon.emoji}</div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm">{cartoon.progress}/{cartoon.episodes} watched</span>
                  </div>
                  <div className="h-2 bg-[var(--teal-50)] rounded-full overflow-hidden mb-3">
                    <div 
                      className="h-full bg-[var(--teal-400)] rounded-full transition-all"
                      style={{ width: `${(cartoon.progress / cartoon.episodes) * 100}%` }}
                    />
                  </div>
                  <Button className="w-full rounded-full bg-[var(--teal-400)] hover:bg-[var(--teal-500)]">
                    <Play className="w-4 h-4 mr-2" />
                    Continue Watching
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cartoon Store */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3>Cartoon Store</h3>
          <ShoppingCart className="w-5 h-5 text-[var(--teal-500)]" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {storeCartoons.map((cartoon, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="text-5xl text-center mb-3">{cartoon.emoji}</div>
                <p className="text-sm mb-2 text-center line-clamp-2 min-h-[2.5rem]">{cartoon.title}</p>
                <div className="flex items-center justify-center gap-1 mb-2 text-xs">
                  <Star className="w-3 h-3 fill-[var(--yellow)] text-[var(--yellow)]" />
                  <span>{cartoon.rating}</span>
                </div>
                <p className="text-xs text-muted-foreground text-center mb-3">{cartoon.episodes} episodes</p>
                <Button 
                  size="sm" 
                  className="w-full rounded-full bg-[var(--teal-400)] hover:bg-[var(--teal-500)] h-8"
                >
                  {cartoon.price} pts
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Info Card */}
      <Card className="mt-6 bg-gradient-to-r from-[var(--lavender)] to-[var(--pink)] border-0">
        <CardContent className="p-6 text-center">
          <Book className="w-10 h-10 text-white mx-auto mb-3" />
          <h3 className="text-white mb-2">Why Cartoons?</h3>
          <p className="text-sm text-white/90">
            Take a break and learn through engaging animated stories. Perfect for visual learners and a fun way to reinforce concepts!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
