import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Register new user
router.post('/register', AuthController.register);

// Login user
router.post('/login', AuthController.login);

// Logout user
router.post('/logout', AuthController.logout);

// Get current user profile (protected route)
router.get('/me', authenticateToken, AuthController.getMe);

// Update user profile (protected route)
router.put('/profile', authenticateToken, AuthController.updateProfile);

export default router;