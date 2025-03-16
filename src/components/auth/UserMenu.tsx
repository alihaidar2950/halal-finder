'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { User, LogOut, Heart, Star, Settings } from 'lucide-react';
import Image from 'next/image';

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
          className="px-4 py-2 text-[#ffc107] hover:text-[#e6b006] font-medium"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="px-4 py-2 bg-[#ffc107] hover:bg-[#e6b006] text-black rounded-lg font-medium"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  // Get user profile picture if available
  const userPhotoUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || null;
  
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        {userPhotoUrl ? (
          <Image 
            src={userPhotoUrl} 
            alt="Profile" 
            width={32} 
            height={32} 
            className="rounded-full w-8 h-8 object-cover"
          />
        ) : (
          <div className="w-8 h-8 bg-[#ffc107] text-black rounded-full flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
        )}
        <span className="hidden md:inline font-medium">
          {user.email || 'User'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              {userPhotoUrl ? (
                <Image 
                  src={userPhotoUrl} 
                  alt="Profile" 
                  width={40} 
                  height={40} 
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-[#ffc107] text-black rounded-full flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
              )}
              <div>
                <p className="font-bold">{user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{user.email}</p>
              </div>
            </div>
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