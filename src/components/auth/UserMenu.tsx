'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { User, LogOut, Heart, Star, Settings } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

// Profile image component that tries multiple possible locations for the user's avatar
const ProfileImage = ({ user }: { user: SupabaseUser }) => {
  // Try all possible locations for the profile image
  const possibleImageUrls = [
    user.user_metadata?.avatar_url,
    user.user_metadata?.picture,
    user.user_metadata?.user_picture,
    user.user_metadata?.profile, 
    user.user_metadata?.photo,
    user.identities?.[0]?.identity_data?.avatar_url,
    user.identities?.[0]?.identity_data?.picture,
    user.app_metadata?.picture,
    user.app_metadata?.avatar_url
  ].filter(Boolean); // Remove undefined/null values

  const [imgSrc, setImgSrc] = useState<string | null>(possibleImageUrls[0] || null);
  const [imgError, setImgError] = useState(false);

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
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ top: 0, right: 0 });

  // Handle mounting for portal rendering
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Calculate position of dropdown
  useEffect(() => {
    if (buttonRef.current && isOpen) {
      const rect = buttonRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth < 768;
      
      setPosition({
        top: isMobile ? rect.bottom + 10 : rect.bottom + 10,
        right: isMobile ? window.innerWidth - rect.right - (rect.width / 2) + 10 : window.innerWidth - rect.right
      });
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && 
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleMenuItemClick = (callback?: () => void) => {
    // Stop event propagation
    return (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsOpen(false);
      if (callback) callback();
    };
  };

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
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#ffc107]">
          <ProfileImage user={user} />
        </div>
        <span className="hidden md:inline font-medium">
          {user.email || 'User'}
        </span>
      </button>

      {isOpen && mounted && createPortal(
        <div 
          ref={menuRef}
          className="fixed w-[calc(100vw-2rem)] md:w-72 bg-[#222] border-2 border-[#ffc107] rounded-lg shadow-2xl overflow-hidden text-left"
          style={{
            top: `${position.top}px`,
            right: `${position.right}px`,
            boxShadow: '0 0 20px rgba(255, 193, 7, 0.5), 0 10px 30px rgba(0, 0, 0, 0.8)',
            zIndex: 999999,
            pointerEvents: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-[#ffc107]/40 bg-gradient-to-b from-[#222] to-[#111]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#ffc107] shadow-2xl" style={{boxShadow: '0 0 10px rgba(255, 193, 7, 0.3)'}}>
                <ProfileImage user={user} />
              </div>
              <div>
                <p className="font-bold text-[#ffc107] text-lg">
                  {user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-white text-sm">{user.email}</p>
              </div>
            </div>
          </div>
          
          <div className="py-1 bg-[#222]">
            <a
              href="/profile" 
              className="flex items-center gap-3 px-4 py-3 hover:bg-black/50 transition-colors cursor-pointer"
              onClick={handleMenuItemClick()}
            >
              <Settings className="w-5 h-5 text-[#ffc107]" />
              <span className="text-white font-medium">Profile Settings</span>
            </a>
            
            <a
              href="/favorites" 
              className="flex items-center gap-3 px-4 py-3 hover:bg-black/50 transition-colors cursor-pointer"
              onClick={handleMenuItemClick()}
            >
              <Heart className="w-5 h-5 text-[#ffc107]" />
              <span className="text-white font-medium">Favorite Restaurants</span>
            </a>
            
            {/* Disabled version of the Reviews link */}
            <div className="flex items-center gap-3 px-4 py-3 opacity-50 cursor-not-allowed">
              <Star className="w-5 h-5 text-[#ffc107]" />
              <span className="text-white font-medium">My Reviews (Coming Soon)</span>
            </div>
          </div>
          
          <div className="border-t border-[#ffc107]/40 py-1 bg-gradient-to-t from-[#111] to-[#222]">
            <button
              onClick={handleMenuItemClick(signOut)}
              className="flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-black/50 hover:text-red-200 transition-colors w-full text-left"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
} 