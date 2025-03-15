'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { FaGoogle, FaFacebook, FaXTwitter } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';

interface SignInFormProps {
  redirectTo?: string;
}

export default function SignInForm({ redirectTo = '/' }: SignInFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signInWithOAuth } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      } else {
        router.push(redirectTo);
      }
    } catch (e) {
      setError('An unexpected error occurred');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'twitter') => {
    try {
      setIsLoading(true);
      setError(null);
      
      const redirectUrl = `${window.location.origin}/auth/callback?redirectTo=${redirectTo}`;
      const { error } = await signInWithOAuth(provider, redirectUrl);
      
      if (error) {
        setError(error.message);
        setIsLoading(false);
      }
      // No need to set isLoading to false on success as we'll be redirected
    } catch (e) {
      setError('An unexpected error occurred');
      console.error(e);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-orange-500">Sign In</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-orange-500 focus:border-orange-500"
            placeholder="your@email.com"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-orange-500 focus:border-orange-500"
            placeholder="••••••••"
          />
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-3 gap-3">
          <button
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            aria-label="Sign in with Google"
          >
            <FaGoogle className="text-red-600 text-xl" />
          </button>
          
          <button
            onClick={() => handleSocialLogin('facebook')}
            disabled={isLoading}
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            aria-label="Sign in with Facebook"
          >
            <FaFacebook className="text-blue-600 text-xl" />
          </button>
          
          <button
            onClick={() => handleSocialLogin('twitter')}
            disabled={isLoading}
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            aria-label="Sign in with X (Twitter)"
          >
            <FaXTwitter className="text-black text-xl" />
          </button>
        </div>
      </div>
      
      <div className="text-center mt-6">
        <p className="text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-orange-500 hover:text-orange-600 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
} 