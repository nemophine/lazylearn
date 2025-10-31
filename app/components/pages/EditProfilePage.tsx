'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
  Heart,
  Crop,
  RotateCw
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
  const router = useRouter();

  // Profile editing state
  const [editName, setEditName] = useState(user?.name || '');
  const [editImage, setEditImage] = useState(user?.image || '');
  const [selectedBadges, setSelectedBadges] = useState<string[]>(['Level 5 Learner']);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Improved image cropping state
  const [showCropModal, setShowCropModal] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const cropAreaRef = useRef<HTMLDivElement>(null);

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

      // Also save to a global location that other components can access
      // This simulates updating the user session
      if (typeof window !== 'undefined') {
        // Trigger a custom event that other components can listen to
        console.log('Dispatching profileUpdated event with data:', profileData);
        window.dispatchEvent(new CustomEvent('profileUpdated', {
          detail: profileData
        }));
      }

      console.log('Saving profile:', profileData);

      // Show success message
      setSaveMessage('Profile saved successfully!');

      // Navigate back to settings after a short delay
      setTimeout(() => {
        router.push('/settings');
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
        setOriginalImage(reader.result as string);
        setShowCropModal(true);
        setZoom(1);
        setPosition({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    }
  };

  // Mouse event handlers for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    });
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleCropImage = () => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageRef.current;
    const size = 300; // Final image size (larger for better quality)

    canvas.width = size;
    canvas.height = size;

    // Calculate the scaled dimensions
    const scaledWidth = img.width * zoom;
    const scaledHeight = img.height * zoom;

    // Calculate crop area (center of the image)
    const cropX = (scaledWidth - size) / 2 - position.x;
    const cropY = (scaledHeight - size) / 2 - position.y;

    // Draw the cropped image
    ctx.drawImage(
      img,
      cropX / zoom,
      cropY / zoom,
      size / zoom,
      size / zoom,
      0,
      0,
      size,
      size
    );

    const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
    setEditImage(croppedImageUrl);
    setShowCropModal(false);
    setOriginalImage(null);
  };

  const handleCancelCrop = () => {
    setShowCropModal(false);
    setOriginalImage(null);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <a href="/settings" className="p-2 hover:bg-[var(--teal-50)] rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </a>
        <div>
          <h1 className="text-3xl font-bold">Edit Profile</h1>
          <p className="text-muted-foreground">Customize your profile information and display preferences</p>
        </div>
      </div>

      <div className="space-y-6">
          {/* Profile Preview Card */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">Profile Preview</h3>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-4 border-[var(--teal-200)]">
                      {editImage && <AvatarImage src={editImage} />}
                      <AvatarFallback>
                        {editName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <label className="absolute bottom-0 right-0 bg-[var(--teal-500)] text-white rounded-full p-2 cursor-pointer hover:bg-[var(--teal-600)] transition-colors shadow-lg">
                      <Camera className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
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
                <p className="text-xs text-muted-foreground mt-4">Click the camera icon to change your profile picture</p>
                <p className="text-xs text-muted-foreground">Recommended: Square image, at least 200x200px</p>
              </div>
            </CardContent>
          </Card>

          {/* Name Section */}
          <Card>
            <CardContent className="p-6">
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
            <CardContent className="p-6">
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

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="w-full bg-[var(--teal-500)] hover:bg-[var(--teal-600)] disabled:opacity-50 disabled:cursor-not-allowed h-14 text-base font-medium"
              size="lg"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-3" />
                  Save Changes
                </>
              )}
            </Button>
            <a href="/settings">
              <Button variant="outline" className="w-full h-14 text-base font-medium" size="lg">
                <X className="w-5 h-5 mr-3" />
                Cancel
              </Button>
            </a>
          </div>

          {/* Save Message */}
          {saveMessage && (
            <div className={`p-4 rounded-lg text-center ${
              saveMessage.includes('Error')
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {saveMessage}
            </div>
          )}

          {/* Tips */}
          <Card>
            <CardContent className="p-4">
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

      {/* Improved Image Crop Modal */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center">
          <div className="relative w-full h-full flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
              <h3 className="text-lg font-semibold">Adjust Profile Picture</h3>
              <button
                onClick={handleCancelCrop}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Crop Area */}
            <div className="flex-1 relative bg-gray-900 overflow-hidden">
              <div
                ref={cropAreaRef}
                className="absolute inset-0 flex items-center justify-center"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
              >
                {originalImage ? (
                  <img
                    ref={imageRef}
                    src={originalImage}
                    alt="Crop preview"
                    className="block"
                    style={{
                      maxWidth: 'none',
                      maxHeight: 'none',
                      width: 'auto',
                      height: 'auto',
                      transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                      transformOrigin: 'center',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      WebkitDraggable: 'false',
                      KhtmlUserDrag: 'false',
                      MozUserDrag: 'false',
                      OUserDrag: 'none',
                    }}
                    draggable={false}
                    />
                ) : (
                  <div className="text-white text-center">
                    <div className="mb-4">
                      <div className="w-16 h-16 mx-auto bg-gray-700 rounded-full flex items-center justify-center">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                    <p>No image loaded</p>
                  </div>
                )}
              </div>

              {/* Crop Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white rounded-lg shadow-2xl">
                  <div className="absolute inset-0 bg-transparent"></div>
                  {/* Corner handles */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-3 border-l-3 border-white -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-3 border-r-3 border-white translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-3 border-l-3 border-white -translate-x-1/2 translate-y-1/2"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-3 border-r-3 border-white translate-x-1/2 translate-y-1/2"></div>
                </div>
              </div>

              {/* Instructions */}
              <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white p-3 rounded-lg text-sm max-w-xs">
                <p className="mb-1">🖱️ Drag to move</p>
                <p>🔍 Use buttons below to zoom</p>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="max-w-md mx-auto">
                {/* Zoom Controls */}
                <div className="flex items-center justify-center gap-4 mb-4">
                  <button
                    onClick={handleZoomOut}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <span className="text-xl">−</span>
                  </button>
                  <div className="text-center min-w-[80px]">
                    <div className="text-sm font-medium">{Math.round(zoom * 100)}%</div>
                    <div className="text-xs text-gray-500">Zoom</div>
                  </div>
                  <button
                    onClick={handleZoomIn}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <span className="text-xl">+</span>
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleCropImage}
                    className="flex-1 bg-[var(--teal-500)] hover:bg-[var(--teal-600)] h-12 text-base font-medium"
                    size="lg"
                  >
                    <Crop className="w-4 h-4 mr-2" />
                    Save Picture
                  </Button>
                  <Button
                    onClick={handleCancelCrop}
                    variant="outline"
                    className="flex-1 h-12 text-base font-medium"
                    size="lg"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden canvas for cropping */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}