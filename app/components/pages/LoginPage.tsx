'use client';

import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { apiService } from '../../services/api';

interface LoginPageProps {
  onNavigate: (page: string) => void;
  onLoginSuccess: () => void;
  isFirstTimeUser: boolean;
}

export function LoginPage({ onNavigate, onLoginSuccess, isFirstTimeUser }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(!isFirstTimeUser); // Show register for first-time users, login for returning users
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // Login user
        const response = await apiService.login({ email, password });
        apiService.storeAuthToken(response.data.token);

        // Mark user as having visited before
        if (typeof window !== 'undefined') {
          localStorage.setItem('hasVisitedBefore', 'true');
        }

        onLoginSuccess();
        onNavigate('profile');
      } else {
        // Register user
        const response = await apiService.register({ email, password, name });
        apiService.storeAuthToken(response.data.token);

        // Mark user as having visited before
        if (typeof window !== 'undefined') {
          localStorage.setItem('hasVisitedBefore', 'true');
        }

        onLoginSuccess();
        onNavigate('profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--teal-50)] to-[var(--blue-50)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Avatar className="w-12 h-12 bg-[var(--teal-500)]">
              <AvatarFallback className="text-white text-xl font-bold">LL</AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold text-[var(--teal-700)]">LazyLearn</h1>
          </div>
          <p className="text-[var(--muted-foreground)]">
            {isFirstTimeUser && !isLogin ? (
              <>
                🎉 Welcome to LazyLearn! <br />
                <span className="text-sm">Create your account and start your learning journey</span>
              </>
            ) : isLogin ? (
              'Welcome back! Sign in to continue'
            ) : (
              'Join us and start learning'
            )}
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            {/* First Time User Badge */}
            {isFirstTimeUser && !isLogin && (
              <div className="mb-6 text-center">
                <Badge className="bg-gradient-to-r from-[var(--teal-500)] to-[var(--blue-500)] text-white px-4 py-2 rounded-full">
                  ✨ New User Registration
                </Badge>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            {/* Back Button */}
            <Button
              variant="ghost"
              className="mb-6 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              onClick={() => onNavigate('home')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field for Registration */}
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--foreground)]">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--muted-foreground)] w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 h-12 rounded-xl border-[var(--border)]"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--muted-foreground)] w-4 h-4" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-[var(--border)]"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--muted-foreground)] w-4 h-4" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 rounded-xl border-[var(--border)]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password (only for login) */}
              {isLogin && (
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-[var(--teal-600)] hover:text-[var(--teal-700)]"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-[var(--teal-500)] hover:bg-[var(--teal-600)] text-white font-medium disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                  </div>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--border)]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[var(--background)] text-[var(--muted-foreground)]">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 rounded-xl border-[var(--border)] hover:bg-[var(--accent)]"
                >
                  <div className="w-5 h-5 bg-red-500 rounded-sm mr-3"></div>
                  Continue with Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 rounded-xl border-[var(--border)] hover:bg-[var(--accent)]"
                >
                  <div className="w-5 h-5 bg-blue-600 rounded-sm mr-3"></div>
                  Continue with Facebook
                </Button>
              </div>
            </form>

            {/* Toggle between Login and Register */}
            <div className="mt-6 text-center">
              <p className="text-sm text-[var(--muted-foreground)]">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[var(--teal-600)] hover:text-[var(--teal-700)] font-medium"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-[var(--muted-foreground)]">
          <p>
            By continuing, you agree to our{' '}
            <a href="#" className="text-[var(--teal-600)] hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-[var(--teal-600)] hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}