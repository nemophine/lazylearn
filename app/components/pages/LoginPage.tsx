'use client';

import { useState } from 'react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Chrome, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface LoginPageProps {
  onNavigate: (page: string) => void;
  onLoginSuccess: () => void;
  onGoogleSignIn: () => void;
  onLineSignIn: () => void;
  isFirstTimeUser: boolean;
}

export function LoginPage({
  onNavigate,
  onLoginSuccess,
  onGoogleSignIn,
  onLineSignIn,
  isFirstTimeUser
}: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      onLoginSuccess();
      onNavigate('home');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--teal-50)] to-[var(--mint)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => onNavigate('home')}
          className="mb-6 flex items-center gap-2 text-[var(--teal-600)] hover:text-[var(--teal-700)] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        {/* Login Card */}
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">
                {isFirstTimeUser ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p className="text-muted-foreground">
                {isFirstTimeUser
                  ? 'Join our learning community today'
                  : 'Sign in to continue your learning journey'
                }
              </p>
            </div>

            {/* Social Login */}
            <div className="space-y-3 mb-6">
              <Button
                onClick={onGoogleSignIn}
                className="w-full h-12 rounded-xl border border-border bg-white hover:bg-gray-50 text-gray-700"
                variant="outline"
              >
                <Chrome className="w-5 h-5 mr-3" />
                Continue with Google
              </Button>

              <Button
                onClick={onLineSignIn}
                className="w-full h-12 rounded-xl bg-green-500 hover:bg-green-600 text-white"
                disabled
              >
                <MessageCircle className="w-5 h-5 mr-3" />
                Continue with LINE (Coming Soon)
              </Button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-muted-foreground">Or continue with email</span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 h-12 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 pr-11 h-12 rounded-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              {!isFirstTimeUser && (
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
                className="w-full h-12 rounded-xl bg-[var(--teal-400)] hover:bg-[var(--teal-500)] text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isFirstTimeUser ? 'Creating Account...' : 'Signing In...'}
                  </div>
                ) : (
                  isFirstTimeUser ? 'Create Account' : 'Sign In'
                )}
              </Button>
            </form>

            {/* Switch Auth Mode */}
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                {isFirstTimeUser ? 'Already have an account?' : "Don't have an account?"}
                <button
                  type="button"
                  onClick={() => onNavigate(isFirstTimeUser ? 'login' : 'register')}
                  className="ml-1 text-[var(--teal-600)] hover:text-[var(--teal-700)] font-medium"
                >
                  {isFirstTimeUser ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Terms */}
        <p className="text-xs text-center text-muted-foreground mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}