'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, CheckCircle, Circle, Plus, Edit2, Trash2, StickyNote } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface Note {
  id: number;
  timestamp: number;
  content: string;
  createdAt: Date;
}

interface Video {
  id: number;
  title: string;
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
  description?: string;
}

interface Course {
  id: number;
  title: string;
  instructor: string;
  videos: Video[];
}

interface VideoPlayerPageProps {
  onNavigate: (page: string, params?: any) => void;
  category?: string;
  courseId?: number;
  videoId?: number;
}

export function VideoPlayerPage({ onNavigate, category, courseId, videoId }: VideoPlayerPageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(1800); // 30 minutes in seconds
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Note-taking state
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      timestamp: 45,
      content: "Important point about HTML semantic tags",
      createdAt: new Date()
    },
    {
      id: 2,
      timestamp: 120,
      content: "Remember to practice CSS flexbox examples",
      createdAt: new Date()
    }
  ]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNote, setEditingNote] = useState<number | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [showNotes, setShowNotes] = useState(true);

  // Sample video data
  const allVideos: Video[] = [
    { id: 1, title: 'Introduction to HTML & CSS', duration: '45 min', isCompleted: true, isLocked: false, description: 'Learn the fundamentals of HTML and CSS including tags, attributes, selectors, and basic styling.' },
    { id: 2, title: 'Advanced CSS Techniques', duration: '1h 20min', isCompleted: true, isLocked: false, description: 'Master advanced CSS concepts including Flexbox, Grid, animations, and responsive design.' },
    { id: 3, title: 'JavaScript Fundamentals', duration: '2h 15min', isCompleted: true, isLocked: false, description: 'Understand JavaScript basics including variables, functions, loops, and DOM manipulation.' },
    { id: 4, title: 'DOM Manipulation', duration: '1h 45min', isCompleted: false, isLocked: false, description: 'Learn how to manipulate HTML elements using JavaScript and create dynamic web pages.' },
    { id: 5, title: 'React Basics', duration: '2h 30min', isCompleted: false, isLocked: false, description: 'Introduction to React including components, props, state, and basic hooks.' },
    { id: 6, title: 'React Hooks & State', duration: '1h 50min', isCompleted: false, isLocked: true, description: 'Deep dive into React hooks including useState, useEffect, and custom hooks.' },
  ];

  const allCourses: Course[] = [
    {
      id: 1,
      title: 'Complete Web Development Bootcamp',
      instructor: 'John Smith',
      videos: allVideos
    },
    // Add other courses as needed
  ];

  const course = allCourses.find(c => c.id === courseId);
  const video = allVideos.find(v => v.id === videoId);
  const currentVideoIndex = allVideos.findIndex(v => v.id === videoId);
  const nextVideo = allVideos[currentVideoIndex + 1];
  const previousVideo = allVideos[currentVideoIndex - 1];

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseInt(e.target.value);
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newVolume = Math.max(0, Math.min(1, percentage));
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const handleProgressDrag = (clientX: number) => {
    if (!progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newTime = percentage * duration;
    setCurrentTime(newTime);
  };

  const handleComplete = () => {
    setIsCompleted(true);
  };

  // Note functions
  const handleAddNote = () => {
    if (noteContent.trim()) {
      if (editingNote !== null) {
        // Update existing note
        setNotes(notes.map(note =>
          note.id === editingNote
            ? { ...note, content: noteContent, createdAt: new Date() }
            : note
        ));
        setEditingNote(null);
      } else {
        // Add new note
        const newNote: Note = {
          id: Date.now(),
          timestamp: currentTime,
          content: noteContent,
          createdAt: new Date()
        };
        setNotes([...notes, newNote]);
      }
      setNoteContent('');
      setIsAddingNote(false);
    }
  };

  const handleEditNote = (noteId: number) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setEditingNote(noteId);
      setNoteContent(note.content);
      setIsAddingNote(true);
    }
  };

  const handleDeleteNote = (noteId: number) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  const handleJumpToTimestamp = (timestamp: number) => {
    setCurrentTime(timestamp);
    // In a real implementation, this would seek the video player
    console.log(`Jumping to timestamp: ${timestamp} seconds`);
  };

  const handleCancelNote = () => {
    setNoteContent('');
    setEditingNote(null);
    setIsAddingNote(false);
  };

  // Progress bar drag handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && progressBarRef.current) {
        handleProgressDrag(e.clientX);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, duration]);

  const handleNextVideo = () => {
    if (nextVideo && !nextVideo.isLocked) {
      onNavigate('video-player', { category, courseId, videoId: nextVideo.id });
    }
  };

  const handlePreviousVideo = () => {
    if (previousVideo) {
      onNavigate('video-player', { category, courseId, videoId: previousVideo.id });
    }
  };

  if (!course || !video) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Video not found</h1>
          <Button onClick={() => onNavigate('course-videos', { category, courseId })}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Course
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Back Button */}
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => onNavigate('course-videos', { category, courseId })}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Course
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            {/* Video Placeholder */}
            <div className="relative bg-black aspect-video">
              <img
                src="https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=450&fit=crop"
                alt={video.title}
                className="w-full h-full object-cover"
              />

              {/* Play Button Overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Button
                    size="lg"
                    className="w-20 h-20 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white"
                    onClick={handlePlayPause}
                  >
                    <Play className="w-8 h-8 text-white ml-1" />
                  </Button>
                </div>
              )}

              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-white mb-1">
                    <span className="text-left">{formatTime(currentTime)}</span>
                    <span className="text-right">{formatTime(duration)}</span>
                  </div>

                  {/* Progress Bar Container */}
                  <div
                    ref={progressBarRef}
                    style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: '#4b5563',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                    onMouseDown={(e) => {
                      setIsDragging(true);
                      handleProgressDrag(e.clientX);
                    }}
                  >
                    {/* Progress Fill */}
                    <div
                      style={{
                        width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%',
                        height: '100%',
                        backgroundColor: '#14b8a6',
                        borderRadius: '4px'
                      }}
                    />

                    {/* Draggable Thumb */}
                    <div
                      style={{
                        position: 'absolute',
                        width: '16px',
                        height: '16px',
                        backgroundColor: 'white',
                        border: '2px solid #14b8a6',
                        borderRadius: '50%',
                        left: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        cursor: 'grab',
                        zIndex: 10
                      }}
                    />
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                      onClick={handlePreviousVideo}
                      disabled={!previousVideo}
                    >
                      <SkipBack className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5 ml-1" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                      onClick={handleNextVideo}
                      disabled={!nextVideo || nextVideo.isLocked}
                    >
                      <SkipForward className="w-4 h-4" />
                    </Button>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={toggleMute}
                        className="p-1 text-white hover:text-white/80"
                      >
                        {isMuted ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>

                      {/* Volume Bar Container */}
                      <div
                        style={{
                          width: '80px',
                          height: '8px',
                          backgroundColor: '#4b5563',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          position: 'relative'
                        }}
                        onClick={handleVolumeSliderClick}
                      >
                        {/* Volume Fill */}
                        <div
                          style={{
                            width: isMuted ? '0%' : `${volume * 100}%`,
                            height: '100%',
                            backgroundColor: '#14b8a6',
                            borderRadius: '4px'
                          }}
                        />

                        {/* Volume Thumb */}
                        <div
                          style={{
                            position: 'absolute',
                            width: '12px',
                            height: '12px',
                            backgroundColor: 'white',
                            border: '2px solid #14b8a6',
                            borderRadius: '50%',
                            left: isMuted ? '0%' : `${volume * 100}%`,
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            cursor: 'pointer',
                            zIndex: 10
                          }}
                        />
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                      onClick={() => setIsAddingNote(!isAddingNote)}
                    >
                      <StickyNote className="w-4 h-4" />
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <Maximize className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Video Title and Description */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400" />
                )}
                <h1 className="text-2xl font-bold">{video.title}</h1>
              </div>

              <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                <span>{video.duration}</span>
                <span>•</span>
                <span>{course.title}</span>
                <span>•</span>
                <span>{course.instructor}</span>
              </div>

              {video.description && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{video.description}</p>
                </div>
              )}

              {/* Complete Button */}
              {!isCompleted && (
                <Button onClick={handleComplete} className="w-full rounded-xl">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Completed
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Course Content Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Course Content</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {course.videos.map((v, index) => (
                  <div
                    key={v.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      v.id === video.id
                        ? 'bg-[var(--teal-50)] border border-[var(--teal-200)]'
                        : v.isLocked
                        ? 'bg-gray-50 opacity-60 cursor-not-allowed'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      if (!v.isLocked) {
                        onNavigate('video-player', { category, courseId, videoId: v.id });
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {v.isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : v.isLocked ? (
                        <span className="w-4 h-4 text-gray-400">🔒</span>
                      ) : (
                        <Circle className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="text-xs text-muted-foreground w-4">
                        {index + 1}.
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${v.isLocked ? 'text-gray-500' : v.id === video.id ? 'font-semibold' : ''}`}>
                        {v.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{v.duration}</p>
                    </div>
                    {v.id === videoId && (
                      <Play className="w-4 h-4 text-[var(--teal-500)]" />
                    )}
                  </div>
                ))}
              </div>

              {/* Notes Section */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <StickyNote className="w-4 h-4 text-[var(--teal-500)]" />
                    <h3 className="font-semibold">Notes ({notes.length})</h3>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setShowNotes(!showNotes)}
                  >
                    {showNotes ? 'Hide' : 'Show'}
                  </Button>
                </div>

                {showNotes && (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {/* Add Note Input */}
                    {isAddingNote && (
                      <Card className="border-[var(--teal-200)]">
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2 mb-2">
                            <Badge className="bg-[var(--teal-100)] text-[var(--teal-700)] text-xs">
                              {formatTime(currentTime)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Current position
                            </span>
                          </div>
                          <textarea
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            placeholder="Take a note..."
                            className="w-full p-2 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--teal-500)]"
                            rows={3}
                          />
                          <div className="flex justify-end gap-2 mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleCancelNote}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={handleAddNote}
                              className="bg-[var(--teal-500)] text-white"
                            >
                              {editingNote ? 'Update' : 'Add Note'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Notes List */}
                    {notes.length === 0 && !isAddingNote && (
                      <div className="text-center py-4 text-muted-foreground text-sm">
                        <StickyNote className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No notes yet. Click the note button to add one!</p>
                      </div>
                    )}

                    {notes.sort((a, b) => a.timestamp - b.timestamp).map((note) => (
                      <Card
                        key={note.id}
                        className="border hover:border-[var(--teal-200)] transition-colors cursor-pointer"
                        onClick={() => handleJumpToTimestamp(note.timestamp)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-[var(--teal-100)] text-[var(--teal-700)] text-xs">
                                {formatTime(note.timestamp)}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {note.createdAt.toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditNote(note.id);
                                }}
                              >
                                <Edit2 className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteNote(note.id);
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-foreground">{note.content}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Add Note Button */}
                {!isAddingNote && (
                  <Button
                    variant="outline"
                    className="w-full border-dashed border-[var(--teal-300)] hover:border-[var(--teal-400)] hover:bg-[var(--teal-50)] transition-colors"
                    onClick={() => setIsAddingNote(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Note at {formatTime(currentTime)}
                  </Button>
                )}
              </div>

              {/* Next Video */}
              {nextVideo && !nextVideo.isLocked && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Next Video</h4>
                  <div
                    className="p-3 bg-[var(--teal-50)] rounded-lg cursor-pointer hover:bg-[var(--teal-100)] transition-colors"
                    onClick={handleNextVideo}
                  >
                    <p className="font-medium text-sm mb-1">{nextVideo.title}</p>
                    <p className="text-xs text-muted-foreground">{nextVideo.duration}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}