'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { User, LogOut, Heart, Star, Settings } from 'lucide-react';

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) {
    return (
      <div className="flex gap-4">
        <Link
          href="/signin"
          className="px-4 py-2 text-orange-500 hover:text-orange-600 font-medium"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center">
          <User className="w-5 h-5" />
        </div>
        <span className="hidden md:inline font-medium">
          {user.email?.split('@')[0] || 'User'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <p className="font-bold">{user.email?.split('@')[0] || 'User'}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm truncate">{user.email}</p>
          </div>
          
          <div className="py-2">
            <Link 
              href="/profile" 
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-5 h-5 text-gray-500" />
              <span>Profile Settings</span>
            </Link>
            
            <Link 
              href="/favorites" 
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Heart className="w-5 h-5 text-gray-500" />
              <span>Favorite Restaurants</span>
            </Link>
            
            <Link 
              href="/reviews" 
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Star className="w-5 h-5 text-gray-500" />
              <span>My Reviews</span>
            </Link>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 py-2">
            <button
              onClick={() => {
                signOut();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full text-left"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 