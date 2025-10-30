'use client';

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  BookOpen,
  Target,
  Plus,
  CheckCircle,
  Edit3,
  X
} from 'lucide-react';

interface ScheduleEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  duration: string;
  type: 'course' | 'mission' | 'study' | 'other';
  completed?: boolean;
  description?: string;
}

interface DateMark {
  date: string; // YYYY-MM-DD format
  color: string;
  note?: string;
}


interface SchedulePageProps {
  onNavigate?: (page: string) => void;
}

export function SchedulePage({ onNavigate }: SchedulePageProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);
  const [hoveredDayEvents, setHoveredDayEvents] = useState<ScheduleEvent[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<ScheduleEvent>>({
    title: '',
    time: '',
    duration: '',
    type: 'other',
    description: ''
  });
  const [newMark, setNewMark] = useState<{ color: string; note: string }>({
    color: '#3B82F6',
    note: ''
  });

  // Sample schedule data - you can connect this to your database later
  const [events, setEvents] = useState<ScheduleEvent[]>([
    {
      id: '1',
      title: 'TypeScript Course - Lesson 1',
      date: new Date(2025, 9, 31), // Oct 31, 2025
      time: '10:00 AM',
      duration: '1h 30m',
      type: 'course',
      completed: true,
      description: 'Introduction to TypeScript basics'
    },
    {
      id: '2',
      title: 'React Patterns Study Session',
      date: new Date(2025, 10, 1), // Nov 1, 2025
      time: '2:00 PM',
      duration: '2h',
      type: 'study',
      description: 'Advanced React patterns and hooks'
    },
    {
      id: '3',
      title: 'Daily Mission: Code Review',
      date: new Date(2025, 10, 2), // Nov 2, 2025
      time: '4:00 PM',
      duration: '30m',
      type: 'mission',
      description: 'Review and optimize code snippets'
    },
    {
      id: '4',
      title: 'UI/UX Design Workshop',
      date: new Date(2025, 10, 3), // Nov 3, 2025
      time: '11:00 AM',
      duration: '1h 45m',
      type: 'course',
      description: 'Design principles and user experience'
    },
  ]);

  // Date marks for manual color marking
  const [dateMarks, setDateMarks] = useState<DateMark[]>([
    { date: '2025-11-05', color: '#10B981', note: 'Important deadline' },
    { date: '2025-11-10', color: '#F59E0B', note: 'Meeting with team' },
    { date: '2025-11-15', color: '#EF4444', note: 'Project presentation' },
  ]);

  const availableColors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // amber
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#14B8A6', // teal
    '#F97316', // orange
  ];

  // Helper functions

  const getDateMark = (date: Date): DateMark | null => {
    const dateKey = getDateKey(date);
    return dateMarks.find(mark => mark.date === dateKey) || null;
  };

  const addDateMark = (date: Date, color: string, note?: string) => {
    const dateKey = getDateKey(date);
    const existingMarkIndex = dateMarks.findIndex(mark => mark.date === dateKey);

    if (existingMarkIndex >= 0) {
      // Update existing mark
      const updatedMarks = [...dateMarks];
      updatedMarks[existingMarkIndex] = { date: dateKey, color, note };
      setDateMarks(updatedMarks);
    } else {
      // Add new mark
      setDateMarks([...dateMarks, { date: dateKey, color, note }]);
    }
  };

  const removeDateMark = (date: Date) => {
    const dateKey = getDateKey(date);
    setDateMarks(dateMarks.filter(mark => mark.date !== dateKey));
  };

  const addEvent = (event: Omit<ScheduleEvent, 'id'>) => {
    const newEventWithId: ScheduleEvent = {
      ...event,
      id: Date.now().toString(),
      date: selectedDate,
    };
    setEvents([...events, newEventWithId]);
    setNewEvent({ title: '', time: '', duration: '', type: 'other', description: '' });
    setShowEventModal(false);
  };

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event =>
      event.date.toDateString() === date.toDateString()
    );
  };

  const getDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleDayRightClick = (e: React.MouseEvent, date: Date) => {
    e.preventDefault();
    setSelectedDate(date);
    setShowMarkModal(true);
  };

  const handleAddEvent = () => {
    setShowEventModal(true);
  };

  const handleDayHover = (date: Date) => {
    setHoveredDay(date);
    const dayEvents = getEventsForDate(date);
    setHoveredDayEvents(dayEvents);
  };

  const handleDayLeave = () => {
    setHoveredDay(null);
    setHoveredDayEvents([]);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-16 border border-gray-200 bg-gray-50/30 rounded-lg aspect-square"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const dateMark = getDateMark(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();

      // Determine background color
      let bgColorClass = 'bg-white border-gray-200';
      if (isToday) {
        bgColorClass = 'bg-gradient-to-br from-blue-500 to-teal-500 border-blue-600 shadow-lg';
      } else if (dateMark) {
        bgColorClass = 'border-2 shadow-md';
      }

      days.push(
        <div
          key={day}
          onClick={() => handleDayClick(date)}
          onContextMenu={(e) => handleDayRightClick(e, date)}
          onMouseEnter={() => handleDayHover(date)}
          onMouseLeave={handleDayLeave}
          className={`h-16 border p-1 cursor-pointer transition-all duration-200 hover:shadow-md hover:z-10 rounded-lg relative overflow-hidden group aspect-square hover:scale-105 ${
            bgColorClass
          } ${isSelected ? 'ring-2 ring-teal-500 ring-offset-1 shadow-lg z-20' : ''}`}
          style={dateMark && !isToday ? { backgroundColor: dateMark.color, borderColor: dateMark.color } : {}}
        >
          {/* Day number */}
          <div className={`text-xs font-bold ${
            isToday ? 'text-white' :
            dateMark ? 'text-white' :
            'text-gray-900'
          }`}>
            {day}
          </div>

          {/* Date mark indicator */}
          {dateMark && !isToday && (
            <div className="absolute top-1 right-1">
              <div className="w-2 h-2 bg-white rounded-full opacity-70"></div>
            </div>
          )}

          {/* Events indicator */}
          {dayEvents.length > 0 && (
            <div className="absolute bottom-1 right-1">
              <div className={`w-2 h-2 rounded-full ${
                isToday ? 'bg-white' :
                dayEvents.some(e => e.type === 'course') ? 'bg-blue-500' :
                dayEvents.some(e => e.type === 'mission') ? 'bg-green-500' :
                dayEvents.some(e => e.type === 'study') ? 'bg-purple-500' :
                'bg-gray-500'
              }`}></div>
              {dayEvents.length > 1 && (
                <div className={`absolute -top-1 -right-1 w-3 h-3 ${
                  isToday ? 'bg-white text-blue-600' : 'bg-red-500 text-white'
                } text-xs rounded-full flex items-center justify-center font-bold`}>
                  {dayEvents.length}
                </div>
              )}
            </div>
          )}

          {/* Today badge */}
          {isToday && (
            <div className="absolute top-1 left-1">
              <div className="px-1 py-0.5 bg-white/90 text-blue-600 text-xs font-bold rounded">
                TODAY
              </div>
            </div>
          )}

        </div>
      );
    }

    return days;
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  const getEventTypeIcon = (type: ScheduleEvent['type']) => {
    switch (type) {
      case 'course': return <BookOpen className="w-4 h-4" />;
      case 'mission': return <Target className="w-4 h-4" />;
      case 'study': return <Clock className="w-4 h-4" />;
      default: return <CalendarIcon className="w-4 h-4" />;
    }
  };

  const getEventTypeColor = (type: ScheduleEvent['type']) => {
    switch (type) {
      case 'course': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'mission': return 'text-green-600 bg-green-50 border-green-200';
      case 'study': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
          My Schedule
        </h1>
        <p className="text-gray-600 text-lg">Plan and organize your learning activities</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 hover:bg-[var(--teal-50)] rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-1 text-sm bg-[var(--teal-100)] text-[var(--teal-700)] rounded-lg hover:bg-[var(--teal-200)] transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 hover:bg-[var(--teal-50)] rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Day names */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map(day => (
                <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-700">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {renderCalendarDays()}
            </div>
          </div>
        </div>

        {/* Event Details Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 sticky top-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">
                {hoveredDay ? 'Day Details' : 'Selected Date'}
              </h3>
              {hoveredDay && (
                <button
                  onClick={() => {
                    setHoveredDay(null);
                    setHoveredDayEvents([]);
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Date display */}
            <div className="text-sm font-medium text-gray-700 mb-3">
              {(hoveredDay || selectedDate).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })}
            </div>

            {/* Date mark info */}
            {getDateMark(hoveredDay || selectedDate) && (
              <div className="mb-4 p-3 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getDateMark(hoveredDay || selectedDate)?.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">Marked Date</span>
                </div>
                {getDateMark(hoveredDay || selectedDate)?.note && (
                  <p className="text-xs text-gray-600">{getDateMark(hoveredDay || selectedDate)?.note}</p>
                )}
              </div>
            )}

            {/* Add Event Button */}
            <div className="mb-4">
              <button
                onClick={handleAddEvent}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[var(--teal-500)] text-white rounded-lg hover:bg-[var(--teal-600)] transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Event
              </button>
            </div>

            {/* Events list */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {(hoveredDayEvents.length > 0 ? hoveredDayEvents : selectedDateEvents).length === 0 ? (
                <div className="text-center py-6">
                  <CalendarIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No events scheduled</p>
                  <p className="text-xs text-gray-400 mt-1">Right-click a day to mark it, or click "Add Event"</p>
                </div>
              ) : (
                (hoveredDayEvents.length > 0 ? hoveredDayEvents : selectedDateEvents).map(event => (
                  <div
                    key={event.id}
                    className={`p-3 rounded-lg border ${getEventTypeColor(event.type)} ${
                      event.completed ? 'opacity-75' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getEventTypeIcon(event.type)}
                        <h4 className="font-medium text-xs">{event.title}</h4>
                      </div>
                      {event.completed && (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      )}
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>{event.time} • {event.duration}</span>
                      </div>
                      {event.description && (
                        <p className="text-gray-600 text-xs">{event.description}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick stats */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-medium text-gray-900">
                    {getEventsForDate(new Date()).length}
                  </div>
                  <div className="text-gray-500">Today</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900">
                    {events.filter(e => e.completed).length}
                  </div>
                  <div className="text-gray-500">Done</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Color Mark Modal */}
      {showMarkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Mark Date</h3>
              <button
                onClick={() => setShowMarkModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">
                Mark {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Choose Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewMark({ ...newMark, color })}
                      className={`w-12 h-12 rounded-lg border-2 transition-all ${
                        newMark.color === color ? 'border-gray-900 scale-110' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
                <input
                  type="text"
                  value={newMark.note}
                  onChange={(e) => setNewMark({ ...newMark, note: e.target.value })}
                  placeholder="Add a note for this date..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (newMark.color) {
                    addDateMark(selectedDate, newMark.color, newMark.note);
                    setShowMarkModal(false);
                    setNewMark({ color: '#3B82F6', note: '' });
                  }
                }}
                className="flex-1 px-4 py-2 bg-[var(--teal-500)] text-white rounded-lg hover:bg-[var(--teal-600)] transition-colors font-medium text-sm"
              >
                Mark Date
              </button>
              <button
                onClick={() => {
                  removeDateMark(selectedDate);
                  setShowMarkModal(false);
                  setNewMark({ color: '#3B82F6', note: '' });
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Event</h3>
              <button
                onClick={() => setShowEventModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Enter event title..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="text"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    placeholder="10:00 AM"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={newEvent.duration}
                    onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value })}
                    placeholder="1h 30m"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as ScheduleEvent['type'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                >
                  <option value="course">Course</option>
                  <option value="mission">Mission</option>
                  <option value="study">Study</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Add event description..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  if (newEvent.title && newEvent.time && newEvent.duration) {
                    addEvent(newEvent as Omit<ScheduleEvent, 'id'>);
                  }
                }}
                disabled={!newEvent.title || !newEvent.time || !newEvent.duration}
                className="flex-1 px-4 py-2 bg-[var(--teal-500)] text-white rounded-lg hover:bg-[var(--teal-600)] transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Event
              </button>
              <button
                onClick={() => {
                  setShowEventModal(false);
                  setNewEvent({ title: '', time: '', duration: '', type: 'other', description: '' });
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}