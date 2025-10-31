'use client';

import { useSession, signOut } from 'next-auth/react';
import { Settings, User, Palette, Bell, Lock, HelpCircle, LogOut, ChevronRight, Moon, Globe } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';

interface ProfilePageProps {
  onLogout?: () => void;
}

export function ProfilePage({ onLogout }: ProfilePageProps) {
  const { data: session } = useSession();
  const user = session?.user;

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      if (onLogout) {
        onLogout();
      }
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  const stats = [
    { label: 'Courses', value: '24' },
    { label: 'Hours', value: '156' },
    { label: 'Rank', value: '#47' },
  ];

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Edit Profile', hasArrow: true },
        { icon: Bell, label: 'Notifications', hasToggle: true, enabled: true },
        { icon: Lock, label: 'Privacy & Security', hasArrow: true },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: Palette, label: 'Theme & Color', hasArrow: true },
        { icon: Globe, label: 'Language', value: 'English', hasArrow: true },
        { icon: Moon, label: 'Dark Mode', hasToggle: true, enabled: false },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & Support', hasArrow: true },
        { icon: Settings, label: 'About Us', hasArrow: true },
      ]
    },
  ];

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto">
      {/* Profile Header */}
      <Card className="mb-6 bg-gradient-to-br from-[var(--teal-400)] to-[var(--teal-300)] border-0 shadow-lg overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-20 h-20 border-4 border-white">
              <AvatarImage src={user?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"} />
              <AvatarFallback>
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-white mb-1">{user?.name || 'Guest User'}</h2>
              <p className="text-white/90 text-sm mb-2">{user?.email || 'Not logged in'}</p>
              <Badge className="bg-white/20 text-white border-0">Level 5 Learner</Badge>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/90 text-sm">Level Progress</span>
              <span className="text-white">2,450 / 3,000 pts</span>
            </div>
            <Progress value={82} className="h-2 bg-white/20" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                <p className="text-2xl text-white mb-1">{stat.value}</p>
                <p className="text-xs text-white/90">{stat.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settings Sections */}
      {settingsSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-6">
          <h3 className="mb-3">{section.title}</h3>
          <Card>
            <CardContent className="p-0">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <div
                    key={itemIndex}
                    className={`w-full flex items-center gap-3 p-4 hover:bg-[var(--teal-50)] transition-colors ${
                      itemIndex !== section.items.length - 1 ? 'border-b border-border' : ''
                    } ${!item.hasToggle ? 'cursor-pointer' : ''}`}
                  >
                    <div className="w-10 h-10 bg-[var(--teal-100)] rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[var(--teal-600)]" />
                    </div>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.value && (
                      <span className="text-sm text-muted-foreground">{item.value}</span>
                    )}
                    {item.hasToggle && (
                      <Switch defaultChecked={item.enabled} />
                    )}
                    {item.hasArrow && (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      ))}

      {/* Achievements Preview */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3>Recent Achievements</h3>
          <button className="text-sm text-[var(--teal-500)]">View all</button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {['🏆', '⭐', '🔥', '🎯'].map((emoji, index) => (
            <div 
              key={index}
              className="aspect-square bg-gradient-to-br from-[var(--yellow)] to-[var(--peach)] rounded-2xl flex items-center justify-center text-3xl shadow-md"
            >
              {emoji}
            </div>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <Button
        variant="outline"
        className="w-full rounded-2xl h-12 text-destructive border-destructive/30 hover:bg-destructive/10"
        onClick={handleLogout}
      >
        <LogOut className="w-5 h-5 mr-2" />
        Log Out
      </Button>
    </div>
  );
}
