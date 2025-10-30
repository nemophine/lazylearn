import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserModel, User, CreateUserData } from '../models/User';

export class AuthService {
  private static readonly SALT_ROUNDS = 12;
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
  private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

  // Register new user
  static async register(userData: { email: string; password: string; name: string }): Promise<{
    user: Omit<User, 'password_hash'>;
    token: string;
  }> {
    // Check if user already exists
    const existingUser = await UserModel.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const password_hash = await bcrypt.hash(userData.password, this.SALT_ROUNDS);

    // Create user
    const newUser: CreateUserData = {
      email: userData.email,
      password_hash,
      name: userData.name,
    };

    const createdUser = await UserModel.create(newUser);

    // Generate JWT token
    const token = this.generateToken(createdUser.id);

    // Return user without password hash
    const { password_hash: _, ...userWithoutPassword } = createdUser;

    return { user: userWithoutPassword, token };
  }

  // Login user
  static async login(userData: { email: string; password: string }): Promise<{
    user: Omit<User, 'password_hash'>;
    token: string;
  }> {
    // Find user by email
    const user = await UserModel.findByEmail(userData.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(userData.password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = this.generateToken(user.id);

    // Return user without password hash
    const { password_hash: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  // Get user by ID
  static async getUserById(id: string): Promise<Omit<User, 'password_hash'> | null> {
    const user = await UserModel.findById(id);
    if (!user) return null;

    const { password_hash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Generate JWT token
  private static generateToken(userId: string): string {
    const payload = { userId };
    // Use type assertion to bypass JWT typing issues
    return (jwt as any).sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    });
  }

  // Verify JWT token
  static verifyToken(token: string): { userId: string } {
    return jwt.verify(token, this.JWT_SECRET) as { userId: string };
  }
}