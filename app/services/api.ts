// API service for backend communication

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      level: number;
      points: number;
      created_at: string;
      updated_at: string;
    };
    token: string;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  level: number;
  points: number;
  created_at: string;
  updated_at: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Register new user
  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return data;
  }

  // Login user
  async login(userData: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    return data;
  }

  // Logout user
  async logout(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    // Remove token from localStorage regardless of API response
    localStorage.removeItem('authToken');
  }

  // Get current user profile
  async getCurrentUser(): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch user profile');
    }

    return data.data.user;
  }

  // Update user profile
  async updateProfile(updateData: { name?: string }): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update profile');
    }

    return data.data.user;
  }

  // Store auth token in localStorage
  storeAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Get auth token from localStorage
  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Remove auth token from localStorage
  removeAuthToken(): void {
    localStorage.removeItem('authToken');
  }

  // Check if user is authenticated (has valid token)
  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    return !!token;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    return data;
  }
}

export const apiService = new ApiService();