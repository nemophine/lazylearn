import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { registerSchema, loginSchema, updateProfileSchema } from '../utils/validation';
import { AuthRequest } from '../middleware/auth';

export class AuthController {
  // Register new user
  static async register(req: Request, res: Response): Promise<void> {
    try {
      // Validate input
      const { error, value } = registerSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.details.map(detail => detail.message)
        });
        return;
      }

      // Register user
      const result = await AuthService.register(value);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('already exists')) {
          res.status(409).json({ error: error.message });
        } else {
          res.status(500).json({ error: 'Registration failed', message: error.message });
        }
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  }

  // Login user
  static async login(req: Request, res: Response): Promise<void> {
    try {
      // Validate input
      const { error, value } = loginSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.details.map(detail => detail.message)
        });
        return;
      }

      // Login user
      const result = await AuthService.login(value);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Invalid email or password')) {
          res.status(401).json({ error: error.message });
        } else {
          res.status(500).json({ error: 'Login failed', message: error.message });
        }
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  }

  // Get current user profile
  static async getMe(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  }

  // Update user profile
  static async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      // Validate input
      const { error, value } = updateProfileSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.details.map(detail => detail.message)
        });
        return;
      }

      // Update user profile logic would go here
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }

  // Logout (client-side mainly, but we can add server-side token blacklisting if needed)
  static async logout(req: Request, res: Response): Promise<void> {
    try {
      // In a real implementation, you might want to add token blacklisting
      // For now, we'll just return success - client should discard the token
      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      res.status(500).json({ error: 'Logout failed' });
    }
  }
}