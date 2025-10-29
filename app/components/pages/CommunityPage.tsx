'use client';

import { MessageCircle, Heart, Share2, Users, Send, Image, Smile, Plus } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';

export function CommunityPage() {
  const posts = [
    {
      id: 1,
      user: 'Emma Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
      time: '2 hours ago',
      content: 'Just completed the JavaScript Advanced course! 🎉 The async/await section was particularly helpful. Anyone else working on this?',
      likes: 42,
      comments: 8,
      tags: ['JavaScript', 'WebDev'],
    },
    {
      id: 2,
      user: 'Alex Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
      time: '5 hours ago',
      content: 'Looking for study buddies for the UX Design bootcamp. Let\'s motivate each other! 💪',
      likes: 28,
      comments: 12,
      tags: ['UXDesign', 'StudyGroup'],
    },
    {
      id: 3,
      user: 'Sarah Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      time: '1 day ago',
      content: 'Pro tip: Using the focus mode with lo-fi music has doubled my productivity! The virtual pet is adorable too 😺',
      likes: 67,
      comments: 15,
      tags: ['ProductivityTips', 'FocusMode'],
    },
  ];

  const groups = [
    { name: 'JavaScript Masters', members: '2.5k', icon: '💻', color: 'from-[var(--teal-300)] to-[var(--teal-400)]' },
    { name: 'Design Thinking', members: '1.8k', icon: '🎨', color: 'from-[var(--pink)] to-[var(--coral)]' },
    { name: 'Math Wizards', members: '1.2k', icon: '🔢', color: 'from-[var(--lavender)] to-[var(--pink)]' },
  ];

  const trendingTopics = [
    { topic: 'WebDevelopment', posts: 234 },
    { topic: 'MachineLearning', posts: 189 },
    { topic: 'StudyTips', posts: 156 },
  ];

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto">
      {/* Community Header */}
      <Card className="mb-6 bg-gradient-to-br from-[var(--teal-400)] to-[var(--teal-300)] border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white mb-1">Community Hub</h2>
              <p className="text-white/90 text-sm">45.2k active learners online</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </CardContent>
      </Card>

      {/* Create Post */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <button className="flex-1 text-left px-4 py-2 bg-[var(--teal-50)] rounded-2xl text-muted-foreground hover:bg-[var(--teal-100)] transition-colors">
              Share your learning journey...
            </button>
            <Button size="icon" className="rounded-full bg-[var(--teal-400)] hover:bg-[var(--teal-500)]">
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="feed" className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-3 mb-4 bg-[var(--teal-50)] rounded-2xl p-1">
          <TabsTrigger value="feed" className="rounded-xl">Feed</TabsTrigger>
          <TabsTrigger value="groups" className="rounded-xl">Groups</TabsTrigger>
          <TabsTrigger value="trending" className="rounded-xl">Trending</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-4 mt-0">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-4">
                {/* Post Header */}
                <div className="flex items-start gap-3 mb-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={post.avatar} />
                    <AvatarFallback>{post.user[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="mb-0.5">{post.user}</p>
                    <p className="text-xs text-muted-foreground">{post.time}</p>
                  </div>
                </div>

                {/* Post Content */}
                <p className="mb-3 text-sm">{post.content}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((tag, index) => (
                    <Badge 
                      key={index}
                      variant="secondary"
                      className="bg-[var(--teal-100)] text-[var(--teal-600)] border-0 text-xs"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>

                {/* Post Actions */}
                <div className="flex items-center gap-4 pt-3 border-t border-border">
                  <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[var(--teal-500)] transition-colors">
                    <Heart className="w-5 h-5" />
                    {post.likes}
                  </button>
                  <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[var(--teal-500)] transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    {post.comments}
                  </button>
                  <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[var(--teal-500)] transition-colors ml-auto">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="groups" className="space-y-3 mt-0">
          {groups.map((group, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center gap-4">
                  <div className={`w-24 h-24 bg-gradient-to-br ${group.color} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-4xl">{group.icon}</span>
                  </div>
                  <div className="flex-1 py-4 pr-4">
                    <p className="mb-1">{group.name}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{group.members} members</span>
                    </div>
                    <Button 
                      size="sm" 
                      className="rounded-full bg-[var(--teal-400)] hover:bg-[var(--teal-500)] h-8"
                    >
                      Join Group
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="trending" className="space-y-3 mt-0">
          <Card className="bg-gradient-to-r from-[var(--yellow)] to-[var(--peach)] border-0 mb-4">
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">🔥</div>
              <h3 className="mb-1">Hot Topics</h3>
              <p className="text-sm text-foreground/80">Join the conversation!</p>
            </CardContent>
          </Card>
          
          {trendingTopics.map((item, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--teal-100)] rounded-xl flex items-center justify-center">
                      <span>#{index + 1}</span>
                    </div>
                    <div>
                      <p className="mb-0.5">#{item.topic}</p>
                      <p className="text-xs text-muted-foreground">{item.posts} posts</p>
                    </div>
                  </div>
                  <Badge className="bg-[var(--teal-400)] border-0">Trending</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Chat Quick Access */}
      <Card className="bg-gradient-to-br from-[var(--lavender)] to-[var(--pink)] border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white mb-1">Need Help?</h3>
              <p className="text-sm text-white/90">Chat with mentors & peers</p>
            </div>
            <Button className="rounded-full bg-white text-foreground hover:bg-white/90">
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
//test
