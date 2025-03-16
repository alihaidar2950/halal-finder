'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { User, LogOut, Heart, Star, Settings } from 'lucide-react';

// Debug component to help find the profile image
const ProfileImage = ({ user }: { user: any }) => {
  // Try all possible locations for the profile image
  const possibleImageUrls = [
    user.user_metadata?.avatar_url,
    user.user_metadata?.picture,
    user.user_metadata?.user_picture,
    user.user_metadata?.profile, 
    user.user_metadata?.photo,
    // Try to access nested structures
    user.user_metadata?.identity?.avatar_url,
    user.user_metadata?.identity?.picture,
    user.identities?.[0]?.identity_data?.avatar_url,
    user.identities?.[0]?.identity_data?.picture,
    user.app_metadata?.picture,
    user.app_metadata?.avatar_url
  ].filter(Boolean); // Remove undefined/null values

  const [imgSrc, setImgSrc] = useState<string | null>(possibleImageUrls[0] || null);
  const [imgError, setImgError] = useState(false);

  console.log('Debug - All possible profile URLs:', possibleImageUrls);
  console.log('Debug - Selected URL:', imgSrc);

  if (!imgSrc || imgError) {
    return (
      <div className="bg-[#ffc107] text-black rounded-full flex items-center justify-center h-full w-full">
        <User className="w-[60%] h-[60%]" />
      </div>
    );
  }

  return (
    <img 
      src={imgSrc}
      alt="Profile" 
      className="h-full w-full object-cover"
      onError={() => {
        console.log('Image failed to load:', imgSrc);
        // Try the next URL if this one fails
        const currentIndex = possibleImageUrls.indexOf(imgSrc);
        if (currentIndex < possibleImageUrls.length - 1) {
          setImgSrc(possibleImageUrls[currentIndex + 1]);
        } else {
          setImgError(true);
        }
      }}
    />
  );
};

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Extended debugging
  useEffect(() => {
    if (user) {
      console.log('Full user object:', JSON.stringify(user, null, 2));
      console.log('User metadata:', user.user_metadata);
      console.log('User identities:', user.identities);
      console.log('App metadata:', user.app_metadata);
    }
  }, [user]);

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
  
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-700"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <ProfileImage user={user} />
        </div>
        <span className="hidden md:inline font-medium">
          {user.email || 'User'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 overflow-hidden text-left">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <ProfileImage user={user} />
              </div>
              <div>
                <p className="font-bold">{user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{user.email}</p>
              </div>
            </div>
            
            {/* Debug information - only visible in development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-2 text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-auto max-h-32">
                <p className="font-bold">Debug Info:</p>
                <p>Provider: {user.app_metadata?.provider || 'unknown'}</p>
                <p>Has Picture: {!!user.user_metadata?.picture ? 'Yes' : 'No'}</p>
                <p>Has Avatar: {!!user.user_metadata?.avatar_url ? 'Yes' : 'No'}</p>
              </div>
            )}
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