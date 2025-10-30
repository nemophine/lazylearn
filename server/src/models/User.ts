import pool from '../database';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  level: number;
  points: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserData {
  email: string;
  password_hash: string;
  name: string;
}

export interface UpdateUserData {
  name?: string;
  level?: number;
  points?: number;
}

export class UserModel {
  // Create new user
  static async create(userData: CreateUserData): Promise<User> {
    const query = `
      INSERT INTO users (email, password_hash, name, level, points)
      VALUES ($1, $2, $3, 1, 0)
      RETURNING *
    `;

    const values = [userData.email, userData.password_hash, userData.name];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Find user by email
  static async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  // Find user by ID
  static async findById(id: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Update user
  static async update(id: string, updateData: UpdateUserData): Promise<User | null> {
    const setClause = Object.keys(updateData)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const query = `
      UPDATE users
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;

    const values = [id, ...Object.values(updateData)];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  // Delete user
  static async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  }

  // Update user points and level
  static async updateUserPoints(id: string, points: number): Promise<User | null> {
    // Calculate level based on points (every 1000 points = 1 level)
    const level = Math.floor(points / 1000) + 1;

    const query = `
      UPDATE users
      SET points = $2, level = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id, points, level]);
    return result.rows[0] || null;
  }
}