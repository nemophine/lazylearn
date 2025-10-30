// Main Backend Application with Database Integration
// Tech Stack: Node.js + Express + TypeScript + PostgreSQL + Kysely

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { db, testConnection } from './db';
import { UserModel } from './models/User';
import type { AuthResponse, ApiResponse } from './db/types';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// JWT Helper Functions
const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const verifyToken = (token: string): { userId: number } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded) {
      return decoded as { userId: number };
    }
    return null;
  } catch (error) {
    return null;
  }
};

// Authentication Middleware
const authenticateToken = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required',
    } as ApiResponse);
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token',
    } as ApiResponse);
  }

  // Verify user exists
  const user = await UserModel.findById(decoded.userId);
  if (!user) {
    return res.status(403).json({
      success: false,
      message: 'User not found',
    } as ApiResponse);
  }

  // Attach user to request object
  (req as any).user = user;
  next();
};

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ===== HEALTH CHECK =====
app.get('/api/health', async (req, res) => {
  try {
    const dbConnected = await testConnection();

    res.json({
      status: 'OK',
      message: 'Backend server is running',
      database: dbConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// ===== AUTHENTICATION ROUTES =====

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and name are required',
      } as ApiResponse);
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      } as ApiResponse);
    }

    if (!email.includes('@') || !email.includes('.')) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      } as ApiResponse);
    }

    // Create user
    const result = await UserModel.create({
      email: email.toLowerCase().trim(),
      password_hash: password,
      name: name.trim(),
      level: 1,
      experience_points: 0,
      total_hours_learned: 0,
      streak_days: 0,
      preferences: JSON.stringify({}),
    });

    if (!result.success || !result.data) {
      return res.status(400).json(result);
    }

    // Generate JWT token
    const token = generateToken(result.data.id);

    // Log activity
    await UserModel.logActivity(result.data.id, 'user_registered', result.data.id, {
      email: result.data.email,
      name: result.data.name,
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: result.data.id,
          email: result.data.email,
          name: result.data.name,
          avatar_url: result.data.avatar_url,
          level: result.data.level,
          experience_points: result.data.experience_points,
          total_hours_learned: result.data.total_hours_learned,
          streak_days: result.data.streak_days,
          preferences: result.data.preferences,
          created_at: result.data.created_at,
          updated_at: result.data.updated_at,
        },
        token,
      },
    } as AuthResponse);

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as ApiResponse);
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      } as ApiResponse);
    }

    // Find user
    const user = await UserModel.findByEmail(email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      } as ApiResponse);
    }

    // Verify password
    const isPasswordValid = await UserModel.verifyPassword(user, password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      } as ApiResponse);
    }

    // Update streak
    await UserModel.updateStreak(user.id);

    // Generate JWT token
    const token = generateToken(user.id);

    // Log activity
    await UserModel.logActivity(user.id, 'user_login', user.id, {
      email: user.email,
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar_url: user.avatar_url,
          level: user.level,
          experience_points: user.experience_points,
          total_hours_learned: user.total_hours_learned,
          streak_days: user.streak_days,
          preferences: user.preferences,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
        token,
      },
    } as AuthResponse);

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as ApiResponse);
  }
});

// Logout user
app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  try {
    const user = (req as any).user;

    // Log activity
    await UserModel.logActivity(user.id, 'user_logout', user.id);

    res.json({
      success: true,
      message: 'Logout successful',
    } as ApiResponse);

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as ApiResponse);
  }
});

// Get current user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = (req as any).user;

    // Get user stats
    const stats = await UserModel.getStats(user.id);

    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar_url: user.avatar_url,
          level: user.level,
          experience_points: user.experience_points,
          total_hours_learned: user.total_hours_learned,
          streak_days: user.streak_days,
          preferences: user.preferences,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
        stats,
      },
    } as ApiResponse);

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as ApiResponse);
  }
});

// Update user profile
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = (req as any).user;
    const { name, avatar_url, preferences } = req.body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;
    if (preferences !== undefined) updateData.preferences = preferences;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update',
      } as ApiResponse);
    }

    const result = await UserModel.update(user.id, updateData);

    if (!result.success || !result.data) {
      return res.status(400).json(result);
    }

    // Log activity
    await UserModel.logActivity(user.id, 'profile_updated', user.id, updateData);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: result.data.id,
          email: result.data.email,
          name: result.data.name,
          avatar_url: result.data.avatar_url,
          level: result.data.level,
          experience_points: result.data.experience_points,
          total_hours_learned: result.data.total_hours_learned,
          streak_days: result.data.streak_days,
          preferences: result.data.preferences,
          created_at: result.data.created_at,
          updated_at: result.data.updated_at,
        },
      },
    } as ApiResponse);

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error instanceof Error ? error.message : 'Unknown error',
    } as ApiResponse);
  }
});

// ===== ERROR HANDLING =====

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    error: `Cannot ${req.method} ${req.originalUrl}`,
  } as ApiResponse);
});

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  } as ApiResponse);
});

// ===== SERVER START =====

const startServer = async () => {
  try {
    // Test database connection
    console.log('🔄 Testing database connection...');
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.error('❌ Database connection failed. Please check your database configuration.');
      process.exit(1);
    }

    // Start server
    app.listen(PORT, () => {
      console.log('\n🚀 LazyLearn Backend Server Started Successfully!');
      console.log('📍 Server URL:', `http://localhost:${PORT}`);
      console.log('🗄️  Database: PostgreSQL (Connected)');
      console.log('🔍 Query Builder: Kysely (Type-safe)');
      console.log('🔐 Authentication: JWT + Bcrypt');
      console.log('\n📚 Available API Endpoints:');
      console.log('   Health Check:   GET  /api/health');
      console.log('   Register:       POST /api/auth/register');
      console.log('   Login:          POST /api/auth/login');
      console.log('   Logout:         POST /api/auth/logout');
      console.log('   Get Profile:    GET  /api/user/profile');
      console.log('   Update Profile: PUT  /api/user/profile');
      console.log('\n⚡ Ready to accept requests!\n');
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM. Shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();

export default app;