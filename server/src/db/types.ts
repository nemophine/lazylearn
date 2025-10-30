// Database Types for Kysely
// This file defines the TypeScript interfaces for all database tables

import type { ColumnType, Generated } from 'kysely';

// Main Database Interface
export interface Database {
  // Users
  users: UserTable;

  // Course Structure
  course_categories: CourseCategoryTable;
  courses: CourseTable;
  subjects: SubjectTable;
  lessons: LessonTable;

  // Progress Tracking
  user_course_progress: UserCourseProgressTable;
  user_subject_progress: UserSubjectProgressTable;
  user_lesson_progress: UserLessonProgressTable;

  // Gamification
  missions: MissionTable;
  user_missions: UserMissionTable;
  achievements: AchievementTable;
  user_achievements: UserAchievementTable;

  // Activity & Sessions
  user_activity_log: UserActivityLogTable;
  user_sessions: UserSessionTable;
}

// Table Interfaces
export interface UserTable {
  id: Generated<number>;
  email: string;
  password_hash: string;
  name: string;
  avatar_url: string | null;
  level: number;
  experience_points: number;
  total_hours_learned: number;
  streak_days: number;
  last_active_date: Date | null;
  preferences: ColumnType<string, string, string>;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, never>;
}

export interface CourseCategoryTable {
  id: Generated<number>;
  name: string;
  description: string | null;
  icon: string | null;
  color: string;
  course_count: number;
  is_active: boolean;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, never>;
}

export interface CourseTable {
  id: Generated<number>;
  category_id: number | null;
  title: string;
  description: string | null;
  thumbnail: string | null;
  instructor: string | null;
  duration: string | null;
  level: string;
  price: number;
  rating: number;
  students_count: number;
  lessons_count: number;
  is_published: boolean;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, never>;
}

export interface SubjectTable {
  id: Generated<number>;
  course_id: number;
  title: string;
  description: string | null;
  thumbnail: string | null;
  difficulty: string;
  duration: string | null;
  total_lessons: number;
  order_index: number;
  is_published: boolean;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, never>;
}

export interface LessonTable {
  id: Generated<number>;
  subject_id: number;
  title: string;
  description: string | null;
  video_url: string | null;
  thumbnail: string | null;
  duration: string | null;
  content_type: string;
  order_index: number;
  views_count: number;
  is_free: boolean;
  is_published: boolean;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, never>;
}

export interface UserCourseProgressTable {
  id: Generated<number>;
  user_id: number;
  course_id: number;
  enrollment_date: ColumnType<Date, string | undefined, never>;
  completion_date: Date | null;
  progress_percentage: number;
  lessons_completed: number;
  total_lessons: number;
  time_spent_minutes: number;
  last_accessed: ColumnType<Date, string | undefined, never>;
  is_completed: boolean;
  is_bookmarked: boolean;
}

export interface UserSubjectProgressTable {
  id: Generated<number>;
  user_id: number;
  subject_id: number;
  enrollment_date: ColumnType<Date, string | undefined, never>;
  completion_date: Date | null;
  progress_percentage: number;
  lessons_completed: number;
  total_lessons: number;
  time_spent_minutes: number;
  last_accessed: ColumnType<Date, string | undefined, never>;
  is_completed: boolean;
}

export interface UserLessonProgressTable {
  id: Generated<number>;
  user_id: number;
  lesson_id: number;
  completion_date: Date | null;
  watch_time_minutes: number;
  is_completed: boolean;
  is_bookmarked: boolean;
  notes: string | null;
}

export interface MissionTable {
  id: Generated<number>;
  title: string;
  description: string | null;
  type: string;
  requirement_type: string | null;
  requirement_value: number;
  reward_points: number;
  reward_badge: string | null;
  difficulty: string;
  is_active: boolean;
  expires_at: Date | null;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, never>;
}

export interface UserMissionTable {
  id: Generated<number>;
  user_id: number;
  mission_id: number;
  status: string;
  progress_value: number;
  requirement_value: number;
  started_at: ColumnType<Date, string | undefined, never>;
  completed_at: Date | null;
  rewards_claimed: boolean;
}

export interface AchievementTable {
  id: Generated<number>;
  title: string;
  description: string | null;
  icon: string | null;
  badge_color: string;
  type: string | null;
  requirement_type: string | null;
  requirement_value: number;
  reward_points: number;
  is_secret: boolean;
  is_active: boolean;
  created_at: ColumnType<Date, string | undefined, never>;
}

export interface UserAchievementTable {
  id: Generated<number>;
  user_id: number;
  achievement_id: number;
  earned_at: ColumnType<Date, string | undefined, never>;
}

export interface UserActivityLogTable {
  id: Generated<number>;
  user_id: number;
  activity_type: string;
  related_id: number | null;
  metadata: ColumnType<string, string, string>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: ColumnType<Date, string | undefined, never>;
}

export interface UserSessionTable {
  id: Generated<number>;
  user_id: number;
  session_token: string;
  expires_at: Date;
  created_at: ColumnType<Date, string | undefined, never>;
  last_accessed: ColumnType<Date, string | undefined, never>;
  ip_address: string | null;
  user_agent: string | null;
  is_active: boolean;
}

// New User Insert Type (without generated fields)
export interface NewUser {
  email: string;
  password_hash: string;
  name: string;
  avatar_url?: string | null;
  level?: number;
  experience_points?: number;
  total_hours_learned?: number;
  streak_days?: number;
  last_active_date?: Date | null;
  preferences?: string;
}

// User Update Type (all fields optional)
export interface UpdateUser {
  email?: string;
  name?: string;
  avatar_url?: string | null;
  level?: number;
  experience_points?: number;
  total_hours_learned?: number;
  streak_days?: number;
  last_active_date?: Date | null;
  preferences?: string;
  updated_at?: Date;
}

// Common types for application
export interface User {
  id: number;
  email: string;
  name: string;
  avatar_url: string | null;
  level: number;
  experience_points: number;
  total_hours_learned: number;
  streak_days: number;
  last_active_date: Date | null;
  preferences: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface Course {
  id: number;
  category_id: number | null;
  title: string;
  description: string | null;
  thumbnail: string | null;
  instructor: string | null;
  duration: string | null;
  level: string;
  price: number;
  rating: number;
  students_count: number;
  lessons_count: number;
  is_published: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CourseCategory {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  color: string;
  course_count: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Response types for API
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: Omit<User, 'password_hash'>;
    token: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Select types for common queries
export interface UserSelect {
  id: number;
  email: string;
  name: string;
  avatar_url: string | null;
  level: number;
  experience_points: number;
  total_hours_learned: number;
  streak_days: number;
  last_active_date: Date | null;
  preferences: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface CourseSelect {
  id: number;
  category_id: number | null;
  title: string;
  description: string | null;
  thumbnail: string | null;
  instructor: string | null;
  duration: string | null;
  level: string;
  price: number;
  rating: number;
  students_count: number;
  lessons_count: number;
  is_published: boolean;
  created_at: Date;
  updated_at: Date;
}