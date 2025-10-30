// User Model - Database operations for users
// Type-safe database operations using Kysely

import bcrypt from 'bcryptjs';
import { db } from '../db';
import type {
  User,
  NewUser,
  UpdateUser,
  ApiResponse
} from '../db/types';

export class UserModel {
  private static readonly BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12');

  // Create a new user
  static async create(userData: NewUser): Promise<ApiResponse<User>> {
    try {
      // Hash password
      const passwordHash = await bcrypt.hash(userData.password_hash, this.BCRYPT_ROUNDS);

      // Insert user
      const result = await db
        .insertInto('users')
        .values({
          ...userData,
          password_hash: passwordHash,
          preferences: JSON.stringify(userData.preferences || {}),
        })
        .returning([
          'id',
          'email',
          'name',
          'avatar_url',
          'level',
          'experience_points',
          'total_hours_learned',
          'streak_days',
          'last_active_date',
          'preferences',
          'created_at',
          'updated_at'
        ])
        .executeTakeFirst();

      if (!result) {
        return {
          success: false,
          message: 'Failed to create user',
        };
      }

      const user: User = {
        ...result,
        preferences: JSON.parse(result.preferences || '{}'),
      };

      return {
        success: true,
        message: 'User created successfully',
        data: user,
      };
    } catch (error) {
      console.error('Error creating user:', error);

      // Handle unique constraint violation
      if (error instanceof Error && error.message.includes('unique constraint')) {
        return {
          success: false,
          message: 'Email already exists',
        };
      }

      return {
        success: false,
        message: 'Failed to create user',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Find user by email
  static async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await db
        .selectFrom('users')
        .selectAll()
        .where('email', '=', email)
        .executeTakeFirst();

      if (!result) {
        return null;
      }

      return {
        ...result,
        preferences: JSON.parse(result.preferences || '{}'),
      };
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  // Find user by ID
  static async findById(id: number): Promise<User | null> {
    try {
      const result = await db
        .selectFrom('users')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst();

      if (!result) {
        return null;
      }

      return {
        ...result,
        preferences: JSON.parse(result.preferences || '{}'),
      };
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }

  // Verify user password
  static async verifyPassword(user: User, password: string): Promise<boolean> {
    try {
      // Need to get the password hash from database since User type doesn't include it
      const userWithPassword = await db
        .selectFrom('users')
        .select('password_hash')
        .where('id', '=', user.id)
        .executeTakeFirst();

      if (!userWithPassword) {
        return false;
      }

      return await bcrypt.compare(password, userWithPassword.password_hash);
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  }

  // Update user
  static async update(id: number, updateData: UpdateUser): Promise<ApiResponse<User>> {
    try {
      const updateValues: any = { ...updateData };

      // Handle preferences
      if (updateData.preferences) {
        updateValues.preferences = JSON.stringify(updateData.preferences);
      }

      // Add updated timestamp
      updateValues.updated_at = new Date();

      const result = await db
        .updateTable('users')
        .set(updateValues)
        .where('id', '=', id)
        .returning([
          'id',
          'email',
          'name',
          'avatar_url',
          'level',
          'experience_points',
          'total_hours_learned',
          'streak_days',
          'last_active_date',
          'preferences',
          'created_at',
          'updated_at'
        ])
        .executeTakeFirst();

      if (!result) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      const user: User = {
        ...result,
        preferences: JSON.parse(result.preferences || '{}'),
      };

      return {
        success: true,
        message: 'User updated successfully',
        data: user,
      };
    } catch (error) {
      console.error('Error updating user:', error);
      return {
        success: false,
        message: 'Failed to update user',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Update user level and experience
  static async updateExperience(id: number, experienceGained: number): Promise<ApiResponse<User>> {
    try {
      const user = await this.findById(id);
      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      const newExperience = user.experience_points + experienceGained;
      const newLevel = Math.floor(newExperience / 1000) + 1; // 1000 XP per level

      return await this.update(id, {
        experience_points: newExperience,
        level: newLevel,
      });
    } catch (error) {
      console.error('Error updating user experience:', error);
      return {
        success: false,
        message: 'Failed to update experience',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Update user streak
  static async updateStreak(id: number): Promise<ApiResponse<User>> {
    try {
      const user = await this.findById(id);
      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      const today = new Date();
      const lastActive = user.last_active_date ? new Date(user.last_active_date) : null;

      let newStreak = user.streak_days;

      if (lastActive) {
        const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff === 1) {
          // Continue streak
          newStreak += 1;
        } else if (daysDiff > 1) {
          // Reset streak
          newStreak = 1;
        }
        // If daysDiff === 0, same day, don't change streak
      } else {
        // First time active
        newStreak = 1;
      }

      return await this.update(id, {
        streak_days: newStreak,
        last_active_date: today,
      });
    } catch (error) {
      console.error('Error updating user streak:', error);
      return {
        success: false,
        message: 'Failed to update streak',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Log user activity
  static async logActivity(
    userId: number,
    activityType: string,
    relatedId?: number,
    metadata?: Record<string, any>
  ): Promise<boolean> {
    try {
      await db
        .insertInto('user_activity_log')
        .values({
          user_id: userId,
          activity_type: activityType,
          related_id: relatedId || null,
          metadata: JSON.stringify(metadata || {}),
          created_at: new Date(),
        })
        .execute();

      return true;
    } catch (error) {
      console.error('Error logging activity:', error);
      return false;
    }
  }

  // Get user stats
  static async getStats(userId: number) {
    try {
      const [
        coursesEnrolled,
        coursesCompleted,
        lessonsCompleted,
        totalTime,
        achievements,
        currentStreak
      ] = await Promise.all([
        // Total courses enrolled
        db
          .selectFrom('user_course_progress')
          .select(({ fn }) => [fn.count<number>('id').as('count')])
          .where('user_id', '=', userId)
          .executeTakeFirst(),

        // Total courses completed
        db
          .selectFrom('user_course_progress')
          .select(({ fn }) => [fn.count<number>('id').as('count')])
          .where('user_id', '=', userId)
          .where('is_completed', '=', true)
          .executeTakeFirst(),

        // Total lessons completed
        db
          .selectFrom('user_lesson_progress')
          .select(({ fn }) => [fn.count<number>('id').as('count')])
          .where('user_id', '=', userId)
          .where('is_completed', '=', true)
          .executeTakeFirst(),

        // Total time spent
        db
          .selectFrom('user_lesson_progress')
          .select(({ fn }) => [fn.sum<number>('watch_time_minutes').as('total')])
          .where('user_id', '=', userId)
          .executeTakeFirst(),

        // Total achievements
        db
          .selectFrom('user_achievements')
          .select(({ fn }) => [fn.count<number>('id').as('count')])
          .where('user_id', '=', userId)
          .executeTakeFirst(),

        // Current streak (from user table)
        db
          .selectFrom('users')
          .select('streak_days')
          .where('id', '=', userId)
          .executeTakeFirst(),
      ]);

      return {
        coursesEnrolled: coursesEnrolled?.count || 0,
        coursesCompleted: coursesCompleted?.count || 0,
        lessonsCompleted: lessonsCompleted?.count || 0,
        totalHours: Math.floor((totalTime?.total || 0) / 60),
        achievements: achievements?.count || 0,
        currentStreak: currentStreak?.streak_days || 0,
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        coursesEnrolled: 0,
        coursesCompleted: 0,
        lessonsCompleted: 0,
        totalHours: 0,
        achievements: 0,
        currentStreak: 0,
      };
    }
  }

  // Delete user (soft delete by setting inactive status)
  static async delete(id: number): Promise<ApiResponse<null>> {
    try {
      const result = await db
        .deleteFrom('users')
        .where('id', '=', id)
        .executeTakeFirst();

      if (result.numDeletedRows === 0) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      return {
        success: true,
        message: 'User deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting user:', error);
      return {
        success: false,
        message: 'Failed to delete user',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}