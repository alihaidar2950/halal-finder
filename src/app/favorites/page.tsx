'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import RestaurantCard from '@/components/RestaurantCard';
import { Restaurant } from '@/data/menuData';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Redirect to sign in if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signin');
    }
  }, [isLoading, user, router]);
  
  // Fetch user's favorite restaurants
  useEffect(() => {
    const getFavorites = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch favorites join with restaurant data
        const { data: favorites, error } = await supabase
          .from('favorites')
          .select('restaurant_id')
          .eq('user_id', user.id);
        
        if (error) {
          throw error;
        }
        
        if (favorites && favorites.length > 0) {
          // Get the restaurant IDs
          const restaurantIds = favorites.map(fav => fav.restaurant_id);
          
          // Now we would fetch the restaurant details from your API
          // This is a placeholder - in a real app you'd fetch from your restaurant API
          const response = await fetch(`/api/restaurants/favorites?ids=${restaurantIds.join(',')}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch restaurant details');
          }
          
          const { restaurants } = await response.json();
          setFavoriteRestaurants(restaurants);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getFavorites();
  }, [user]);
  
  const removeFavorite = async (restaurantId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('restaurant_id', restaurantId);
      
      if (error) {
        throw error;
      }
      
      // Update the UI by removing the restaurant
      setFavoriteRestaurants(prev => 
        prev.filter(restaurant => restaurant.id !== restaurantId)
      );
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-[70vh] flex justify-center items-center">
          <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
        </div>
      </MainLayout>
    );
  }
  
  if (!user) {
    return null; // Will redirect via useEffect
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 flex items-center">
          <Heart className="text-orange-500 mr-3 h-8 w-8" />
          Favorite Restaurants
        </h1>
        
        {loading ? (
          <div className="py-12 text-center">
            <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading your favorites...</p>
          </div>
        ) : favoriteRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteRestaurants.map(restaurant => (
              <div key={restaurant.id} className="relative">
                <RestaurantCard restaurant={restaurant} />
                <button
                  onClick={() => removeFavorite(restaurant.id)}
                  className="absolute top-3 right-3 bg-black bg-opacity-70 p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <Heart className="h-5 w-5 text-white fill-white" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-800 rounded-lg">
            <Heart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Favorites Yet</h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              You haven&apos;t saved any favorite restaurants yet. Explore restaurants and add them to your favorites!
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg"
            >
              Explore Restaurants
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
} 