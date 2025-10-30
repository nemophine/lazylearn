const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';

// Simple in-memory user store
const users = [];
let nextId = 1;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'LazyLearn Backend API is running',
    timestamp: new Date().toISOString(),
  });
});

// Register user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({
        error: 'All fields are required',
        details: ['Email, password, and name are required']
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters long',
      });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({
        error: 'User with this email already exists'
      });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Create user
    const newUser = {
      id: nextId++,
      email,
      password_hash,
      name,
      level: 1,
      points: 0,
      created_at: new Date(),
      updated_at: new Date()
    };

    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id.toString() },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user without password
    const { password_hash: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: error.message || 'Unknown error'
    });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id.toString() },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user without password
    const { password_hash: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: error.message || 'Unknown error'
    });
  }
});

// Get current user
app.get('/api/auth/me', (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id.toString() === decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Invalid token - user not found' });
    }

    const { password_hash: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      data: { user: userWithoutPassword }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 LazyLearn Backend API server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
  console.log(`🗄️  Using simple in-memory database for testing`);
  console.log(`✅ Ready for registration and login testing!`);
});