"use client";

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import { toast } from 'sonner';
import AuthModal from './auth/AuthModal';

// Custom event for favorite changes
export const FAVORITE_CHANGED_EVENT = 'favorite-changed';

interface FavoriteButtonProps {
  restaurantId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showBackground?: boolean;
}

export default function FavoriteButton({
  restaurantId,
  className = '',
  size = 'md',
  showBackground = true,
}: FavoriteButtonProps) {
  const { user, isLoading } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Size mappings
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  // Check if restaurant is in favorites when component mounts
  useEffect(() => {
    const checkIfFavorite = async () => {
      if (!user) return;
      
      try {
        const { data } = await supabase
          .from('favorites')
          .select()
          .eq('user_id', user.id)
          .eq('restaurant_id', restaurantId)
          .single();
          
        if (data) {
          setIsFavorite(true);
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };
    
    if (user) {
      checkIfFavorite();
    }
  }, [user, restaurantId]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading || isUpdating) return;
    
    if (!user) {
      // Show toast message explaining they need to sign in
      toast.info(
        <div className="flex flex-col space-y-2">
          <span className="font-medium">Sign in required</span>
          <span className="text-sm">You need to sign in to save favorite restaurants</span>
        </div>,
        {
          duration: 4000,
          action: {
            label: "Sign in",
            onClick: () => setShowAuthModal(true)
          },
        }
      );
      
      // Show auth modal
      setShowAuthModal(true);
      return;
    }
    
    setIsUpdating(true);
    
    try {
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('restaurant_id', restaurantId);
          
        if (error) throw error;
        
        setIsFavorite(false);
        toast.success('Removed from favorites');

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent(FAVORITE_CHANGED_EVENT, { 
          detail: { restaurantId, isFavorite: false } 
        }));
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            restaurant_id: restaurantId
          });
          
        if (error) throw error;
        
        setIsFavorite(true);
        toast.success('Added to favorites');

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent(FAVORITE_CHANGED_EVENT, { 
          detail: { restaurantId, isFavorite: true } 
        }));
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
      toast.error('Failed to update favorites');
    } finally {
      setIsUpdating(false);
    }
  };

  const buttonClasses = `
    ${showBackground ? 'bg-black bg-opacity-70 p-2 rounded-full' : ''}
    ${isFavorite ? 'hover:bg-red-600' : 'hover:bg-gray-700'} 
    transition-colors
    ${isUpdating ? 'animate-pulse' : ''}
    ${className}
  `;

  return (
    <>
      <button
        onClick={toggleFavorite}
        className={buttonClasses}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart 
          className={`${sizeMap[size]} ${isFavorite ? 'text-red-500 fill-red-500' : 'text-white'}`} 
        />
      </button>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        redirectTo={typeof window !== 'undefined' ? window.location.pathname : '/'}
      />
    </>
  );
} 