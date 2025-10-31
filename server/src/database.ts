import dotenv from 'dotenv';

dotenv.config();

// Mock database for testing (in-memory)
class MockPool {
  private users: any[] = [];
  private nextId = 1;

  async query(text: string, params?: any[]) {
    console.log(`Mock DB Query: ${text}`, params);

    // Simulate database operations
    if (text.includes('INSERT INTO users')) {
      const [email, password_hash, name] = params;

      // Check if user already exists
      const existingUser = this.users.find(u => u.email === email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const newUser = {
        id: this.nextId++,
        email,
        password_hash,
        name,
        level: 1,
        points: 0,
        created_at: new Date(),
        updated_at: new Date()
      };

      this.users.push(newUser);
      return { rows: [newUser], rowCount: 1 };
    }

    if (text.includes('SELECT * FROM users WHERE email')) {
      const [email] = params;
      const user = this.users.find(u => u.email === email);
      return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
    }

    if (text.includes('SELECT * FROM users WHERE id')) {
      const [id] = params;
      const user = this.users.find(u => u.id.toString() === id);
      return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
    }

    if (text.includes('DELETE FROM users')) {
      const [id] = params;
      const initialLength = this.users.length;
      this.users = this.users.filter(u => u.id.toString() !== id);
      return { rowCount: initialLength - this.users.length };
    }

    if (text.includes('UPDATE users')) {
      const [id, name] = params;
      const user = this.users.find(u => u.id.toString() === id);
      if (user && name) {
        user.name = name;
        user.updated_at = new Date();
        return { rows: [user], rowCount: 1 };
      }
      return { rows: [], rowCount: 0 };
    }

    // Default response
    return { rows: [], rowCount: 0 };
  }
}

const pool = new MockPool();

console.log('🗄️  Using mock database for testing (no PostgreSQL required)');

export default pool;