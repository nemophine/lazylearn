'use client';

import { useState } from 'react';
import { Play, Pause, Maximize, Volume2, Settings, ChevronDown, ThumbsUp, MessageSquare, Share2, BookmarkPlus } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function KnowledgePage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [progress, setProgress] = useState(35);

  const relatedVideos = [
    { title: 'Advanced Concepts', duration: '15:20', views: '8.5k' },
    { title: 'Practical Examples', duration: '12:45', views: '6.2k' },
    { title: 'Quiz & Review', duration: '8:30', views: '5.1k' },
  ];

  const comments = [
    { user: 'Alex Kim', time: '2 days ago', text: 'Great explanation! Really helped me understand the concept.', likes: 24 },
    { user: 'Sarah Lee', time: '1 week ago', text: 'Could you make more videos on this topic?', likes: 15 },
  ];

  const notes = [
    { timestamp: '02:15', text: 'Key concept: Understanding the fundamentals' },
    { timestamp: '08:42', text: 'Important formula to remember' },
  ];

  return (
    <div className="pb-24 max-w-md mx-auto">
      {/* Video Player */}
      <div className="relative bg-black aspect-video mb-4">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1599081595468-de614fc93694"
          alt="Video thumbnail"
          className="w-full h-full object-fill opacity-80"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            size="lg"
            onClick={() => setIsPlaying(!isPlaying)}
            className="rounded-full w-16 h-16 bg-white/90 hover:bg-white text-black"
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </Button>
        </div>
        
        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <Progress value={progress} className="h-1 mb-3 bg-white/30" />
          <div className="flex items-center justify-between text-white text-sm">
            <div className="flex items-center gap-3">
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-white hover:bg-white/20 h-8 px-2"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Volume2 className="w-4 h-4" />
              <span className="text-xs">5:30 / 15:40</span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-white hover:bg-white/20 h-8 px-2"
              >
                <span className="text-xs">{playbackSpeed}x</span>
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-white hover:bg-white/20 h-8 px-2"
              >
                CC
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-white hover:bg-white/20 h-8 px-2"
              >
                <Maximize className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Subtitles */}
        {showSubtitles && (
          <div className="absolute bottom-20 left-0 right-0 text-center">
            <div className="inline-block bg-black/80 text-white px-4 py-2 rounded-lg text-sm max-w-[90%]">
              This is an example subtitle text that appears during video playback
            </div>
          </div>
        )}
      </div>

      <div className="px-4">
        {/* Video Info */}
        <div className="mb-4">
          <h2 className="mb-2">Introduction to Advanced Learning Techniques</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <span>156K views</span>
            <span>•</span>
            <span>2 days ago</span>
            <Badge className="bg-[var(--teal-100)] text-[var(--teal-600)] border-0">
              Beginner
            </Badge>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-2">
            <Button variant="outline" size="sm" className="rounded-full flex-1">
              <ThumbsUp className="w-4 h-4 mr-2" />
              1.2k
            </Button>
            <Button variant="outline" size="sm" className="rounded-full flex-1">
              <MessageSquare className="w-4 h-4 mr-2" />
              89
            </Button>
            <Button variant="outline" size="sm" className="rounded-full flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <BookmarkPlus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Playback Settings */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span>Playback Speed</span>
              <div className="flex gap-2">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                  <Button
                    key={speed}
                    size="sm"
                    variant={playbackSpeed === speed ? 'default' : 'outline'}
                    className="rounded-full h-7 px-3"
                    onClick={() => setPlaybackSpeed(speed)}
                  >
                    {speed}x
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Subtitles</span>
              <Button
                size="sm"
                variant={showSubtitles ? 'default' : 'outline'}
                className="rounded-full"
                onClick={() => setShowSubtitles(!showSubtitles)}
              >
                {showSubtitles ? 'On' : 'Off'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Description, Comments, Notes */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 bg-[var(--teal-50)] rounded-2xl p-1">
            <TabsTrigger value="description" className="rounded-xl">Description</TabsTrigger>
            <TabsTrigger value="comments" className="rounded-xl">Comments</TabsTrigger>
            <TabsTrigger value="notes" className="rounded-xl">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-0">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm mb-4">
                  In this comprehensive lesson, you'll learn advanced techniques for effective learning. 
                  We cover memory strategies, active recall, spaced repetition, and more.
                </p>
                <div className="space-y-2">
                  <h4>What you'll learn:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Core concepts and fundamentals</li>
                    <li>• Practical application methods</li>
                    <li>• Common mistakes to avoid</li>
                    <li>• Advanced tips and tricks</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comments" className="mt-0 space-y-3">
            {comments.map((comment, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[var(--teal-200)] rounded-full flex items-center justify-center flex-shrink-0">
                      {comment.user[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{comment.user}</span>
                        <span className="text-xs text-muted-foreground">{comment.time}</span>
                      </div>
                      <p className="text-sm mb-2">{comment.text}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <button className="flex items-center gap-1 hover:text-foreground">
                          <ThumbsUp className="w-3 h-3" />
                          {comment.likes}
                        </button>
                        <button className="hover:text-foreground">Reply</button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="notes" className="mt-0 space-y-3">
            {notes.map((note, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Badge variant="secondary" className="bg-[var(--teal-100)] text-[var(--teal-600)] border-0">
                      {note.timestamp}
                    </Badge>
                    <p className="text-sm flex-1">{note.text}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button className="w-full rounded-full bg-[var(--teal-400)] hover:bg-[var(--teal-500)]">
              Add New Note
            </Button>
          </TabsContent>
        </Tabs>

        {/* Up Next */}
        <div className="mt-6 mb-4">
          <h3 className="mb-3">Up Next</h3>
          <div className="space-y-3">
            {relatedVideos.map((video, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-3">
                  <div className="flex gap-3">
                    <div className="w-28 h-20 bg-[var(--teal-100)] rounded-xl flex items-center justify-center flex-shrink-0">
                      <Play className="w-8 h-8 text-[var(--teal-500)]" />
                    </div>
                    <div className="flex-1">
                      <p className="mb-1 line-clamp-2">{video.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{video.duration}</span>
                        <span>•</span>
                        <span>{video.views} views</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
