'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Camera,
  Save,
  X,
  ArrowLeft,
  Star,
  Trophy,
  Zap,
  Target,
  Award,
  Crown,
  Sparkles,
  Gift,
  Coins,
  Medal,
  Heart
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
// import { Link } from 'next/link';

interface EditProfilePageProps {
  onNavigate?: (page: string) => void;
}

export function EditProfilePage({ onNavigate }: EditProfilePageProps) {
  const { data: session } = useSession();
  const user = session?.user;

  // Profile editing state
  const [editName, setEditName] = useState(user?.name || '');
  const [editImage, setEditImage] = useState(user?.image || '');
  const [selectedBadges, setSelectedBadges] = useState<string[]>(['Level 5 Learner']);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Load saved profile data on component mount
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const profileData = JSON.parse(savedProfile);
        if (profileData.name) setEditName(profileData.name);
        if (profileData.image) setEditImage(profileData.image);
        if (profileData.badges) setSelectedBadges(profileData.badges);
      }
    } catch (error) {
      console.error('Error loading saved profile:', error);
    }
  }, []);

  // Available badges for users to choose from
  const availableBadges = [
    { id: 'Level 5 Learner', icon: Star, color: 'bg-blue-100 text-blue-700 border-blue-300', name: 'Level 5 Learner' },
    { id: 'Premium Member', icon: Crown, color: 'bg-purple-100 text-purple-700 border-purple-300', name: 'Premium Member' },
    { id: 'Early Adopter', icon: Zap, color: 'bg-yellow-100 text-yellow-700 border-yellow-300', name: 'Early Adopter' },
    { id: 'Achievement Hunter', icon: Trophy, color: 'bg-orange-100 text-orange-700 border-orange-300', name: 'Achievement Hunter' },
    { id: 'Focus Master', icon: Target, color: 'bg-green-100 text-green-700 border-green-300', name: 'Focus Master' },
    { id: 'Course Champion', icon: Award, color: 'bg-red-100 text-red-700 border-red-300', name: 'Course Champion' },
    { id: 'Community Helper', icon: Heart, color: 'bg-pink-100 text-pink-700 border-pink-300', name: 'Community Helper' },
    { id: 'Knowledge Seeker', icon: Sparkles, color: 'bg-indigo-100 text-indigo-700 border-indigo-300', name: 'Knowledge Seeker' },
    { id: 'Generous Supporter', icon: Gift, color: 'bg-emerald-100 text-emerald-700 border-emerald-300', name: 'Generous Supporter' },
    { id: 'Point Collector', icon: Coins, color: 'bg-amber-100 text-amber-700 border-amber-300', name: 'Point Collector' },
    { id: 'Dedicated Learner', icon: Medal, color: 'bg-cyan-100 text-cyan-700 border-cyan-300', name: 'Dedicated Learner' },
  ];

  // Profile editing handlers
  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      // Simulate API call to save profile
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Save to localStorage for persistence (in a real app, this would be an API call)
      const profileData = {
        name: editName,
        image: editImage,
        badges: selectedBadges,
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem('userProfile', JSON.stringify(profileData));

      console.log('Saving profile:', profileData);

      // Show success message
      setSaveMessage('Profile saved successfully!');

      // Navigate back to settings after a short delay
      setTimeout(() => {
        window.location.href = '/settings';
      }, 1500);

    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveMessage('Error saving profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBadgeToggle = (badgeId: string) => {
    setSelectedBadges(prev => {
      if (prev.includes(badgeId)) {
        return prev.filter(id => id !== badgeId);
      } else {
        // Limit to 3 badges
        if (prev.length < 3) {
          return [...prev, badgeId];
        }
        return prev;
      }
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL for the uploaded image
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <a href="/settings" className="p-2 hover:bg-[var(--teal-50)] rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </a>
          <div>
            <h1 className="text-3xl font-bold">Edit Profile</h1>
            <p className="text-muted-foreground">Customize your profile information and display preferences</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Profile Picture Section */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold mb-6">Profile Picture</h2>
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-[var(--teal-200)]">
                    <AvatarImage src={editImage} />
                    <AvatarFallback>
                      {editName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute bottom-0 right-0 bg-[var(--teal-500)] text-white rounded-full p-3 cursor-pointer hover:bg-[var(--teal-600)] transition-colors shadow-lg">
                    <Camera className="w-5 h-5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-muted-foreground mt-4">Click the camera icon to change your profile picture</p>
                <p className="text-xs text-muted-foreground">Recommended: Square image, at least 200x200px</p>
              </div>
            </CardContent>
          </Card>

          {/* Name Section */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold mb-6">Display Name</h2>
              <div>
                <label className="block text-sm font-medium mb-2">Your Name</label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter your display name"
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-2">This is how your name will appear to other users in the community</p>
              </div>
            </CardContent>
          </Card>

          {/* Badge Selection Section */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Select Your Badges</h2>
                <Badge variant="outline">
                  {selectedBadges.length}/3 Selected
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {availableBadges.map((badge) => {
                  const Icon = badge.icon;
                  const isSelected = selectedBadges.includes(badge.id);
                  return (
                    <button
                      key={badge.id}
                      onClick={() => handleBadgeToggle(badge.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-[var(--teal-500)] bg-[var(--teal-50)] shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-center mb-3">
                        <Icon className="w-8 h-8" />
                      </div>
                      <p className="text-sm font-medium text-center">{badge.name}</p>
                      {isSelected && (
                        <div className="flex items-center justify-center mt-2 text-[var(--teal-600)]">
                          <div className="w-6 h-6 bg-[var(--teal-500)] rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-sm"></div>
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              {selectedBadges.length >= 3 && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">You've selected the maximum number of badges (3). Remove a badge to select a different one.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-10">
          {/* Preview Card */}
          <Card>
            <CardContent className="p-8">
              <h3 className="text-lg font-semibold mb-4">Preview</h3>
              <div className="text-center">
                <Avatar className="w-20 h-20 border-4 border-[var(--teal-200)] mx-auto mb-4">
                  <AvatarImage src={editImage} />
                  <AvatarFallback>
                    {editName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <h4 className="font-medium mb-1">{editName || 'Your Name'}</h4>
                <p className="text-sm text-muted-foreground mb-4">{user?.email || 'your.email@example.com'}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {selectedBadges.map((badgeId) => {
                    const badge = availableBadges.find(b => b.id === badgeId);
                    if (!badge) return null;
                    const Icon = badge.icon;
                    return (
                      <Badge key={badge.id} className={badge.color}>
                        <Icon className="w-3 h-3 mr-1" />
                        {badge.name}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Message */}
          {saveMessage && (
            <div className={`p-4 rounded-lg text-center mb-6 ${
              saveMessage.includes('Error')
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {saveMessage}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-6">
            <Button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="w-full bg-[var(--teal-500)] hover:bg-[var(--teal-600)] disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
            <a href="/settings">
              <Button variant="outline" className="w-full" size="lg">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </a>
          </div>

          {/* Tips */}
          <Card>
            <CardContent className="p-6">
              <h4 className="font-medium mb-3">💡 Profile Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Choose badges that represent your achievements</li>
                <li>• Your profile picture helps others recognize you</li>
                <li>• Badges appear on your profile page</li>
                <li>• You can change these settings anytime</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}