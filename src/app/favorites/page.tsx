'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import RestaurantCard from '@/components/RestaurantCard';
import { Restaurant } from '@/data/menuData';
import { Heart } from 'lucide-react';
import { FAVORITE_CHANGED_EVENT } from '@/components/FavoriteButton';
import { toast } from 'sonner';

// Interface for restaurant data stored in Supabase
interface StoredRestaurant {
  restaurant_id: string;
  restaurant_name?: string;
  address?: string;
  image_url?: string;
  rating?: number;
  price_range?: string;
  cuisine_type?: string;
  coordinates?: { lat: number; lng: number };
  halal_status?: string;
  last_updated?: string;
}

// Type for halal status
type HalalStatus = 'fully_halal' | 'halal_options' | 'halal_ingredients' | 'not_halal' | 'unknown';

export default function FavoritesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Redirect to sign in if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      console.log('No user logged in, redirecting to sign in page');
      router.push('/signin');
    }
  }, [isLoading, user, router]);

  // Function to fetch favorites
  const fetchFavorites = async () => {
    if (!user) {
      console.log('No user, not fetching favorites');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching favorites for user: ${user.id}`);
      
      // Fetch favorites with all restaurant data
      const { data: storedFavorites, error: supabaseError } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id);
      
      if (supabaseError) {
        console.error('Supabase error fetching favorites:', supabaseError);
        throw supabaseError;
      }
      
      console.log(`Found ${storedFavorites?.length || 0} favorites in database`);
      
      if (storedFavorites && storedFavorites.length > 0) {
        // Convert stored favorites to Restaurant objects
        const restaurants = storedFavorites.map((fav: StoredRestaurant) => {
          // Check if we have complete details or just an ID
          const hasDetails = !!fav.restaurant_name;
          
          if (hasDetails) {
            // Return a Restaurant object using the stored details
            return {
              id: fav.restaurant_id,
              name: fav.restaurant_name || 'Unknown Restaurant',
              address: fav.address || '',
              image: fav.image_url,
              rating: fav.rating || 0,
              priceRange: fav.price_range || '$$',
              cuisineType: fav.cuisine_type || 'restaurant',
              coordinates: fav.coordinates || { lat: 0, lng: 0 },
              halalStatus: (fav.halal_status || 'unknown') as HalalStatus,
              fromCache: true,
              description: `Favorite since ${new Date(fav.last_updated || '').toLocaleDateString()}`
            } as Restaurant;
          } else {
            // For legacy favorites that only have the ID, we'll need to fetch details
            // This is the fallback and should be rare after implementing this update
            console.log(`Missing details for restaurant: ${fav.restaurant_id}, need to fetch from API`);
            return null;
          }
        }).filter(Boolean) as Restaurant[];
        
        setFavoriteRestaurants(restaurants);
        
        // Check if we need to fetch any missing restaurants
        const missingDetailCount = storedFavorites.length - restaurants.length;
        if (missingDetailCount > 0) {
          // This is for legacy favorites that don't have details stored
          // We'll handle it in a simplified way for now
          console.log(`${missingDetailCount} restaurants need API fetching (legacy favorites)`);
          
          // Get IDs of favorites without details
          const incompleteIds = storedFavorites
            .filter(fav => !fav.restaurant_name)
            .map(fav => fav.restaurant_id);
          
          if (incompleteIds.length > 0) {
            // Fetch details from API for these IDs only
            try {
              const apiUrl = `/api/restaurants/favorites?ids=${incompleteIds.join(',')}`;
              console.log(`Fetching missing details from API: ${apiUrl}`);
              
              const response = await fetch(apiUrl);
              
              if (!response.ok) {
                console.error(`API error: ${response.status}`);
                toast.error(`Couldn't load all favorites`);
              } else {
                const data = await response.json();
                if (data.restaurants && data.restaurants.length > 0) {
                  // Add the fetched restaurants to our list
                  setFavoriteRestaurants(prev => [...prev, ...data.restaurants]);
                  
                  // Update the stored favorites with complete details for next time
                  data.restaurants.forEach(async (restaurant: Restaurant) => {
                    await supabase
                      .from('favorites')
                      .update({
                        restaurant_name: restaurant.name,
                        address: restaurant.address,
                        image_url: restaurant.image,
                        rating: restaurant.rating,
                        price_range: restaurant.priceRange,
                        cuisine_type: restaurant.cuisineType,
                        coordinates: restaurant.coordinates,
                        halal_status: restaurant.halalStatus,
                        last_updated: new Date().toISOString()
                      })
                      .eq('user_id', user.id)
                      .eq('restaurant_id', restaurant.id);
                  });
                  
                  console.log(`Updated ${data.restaurants.length} favorites with complete details`);
                }
              }
            } catch (apiError) {
              console.error('Error fetching missing restaurant details:', apiError);
            }
          }
        }
      } else {
        console.log('No favorites found for user');
        setFavoriteRestaurants([]);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setError('Failed to load your favorite restaurants. Please try again later.');
      toast.error('Error loading favorites');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch user's favorite restaurants
  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  // Listen for favorite changes
  useEffect(() => {
    const handleFavoriteChange = () => {
      console.log('Favorite changed event received, refreshing favorites');
      fetchFavorites();
    };

    window.addEventListener(FAVORITE_CHANGED_EVENT, handleFavoriteChange);
    
    return () => {
      window.removeEventListener(FAVORITE_CHANGED_EVENT, handleFavoriteChange);
    };
  }, [user]);
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-[70vh] flex justify-center items-center">
          <div className="animate-spin h-12 w-12 border-4 border-[#ffc107] border-t-transparent rounded-full"></div>
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
          <Heart className="text-[#ffc107] mr-3 h-8 w-8" />
          Favorite Restaurants
        </h1>
        
        {error && (
          <div className="bg-[#1c1c1c] border border-red-800 text-red-400 p-4 mb-8 rounded">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="py-12 text-center">
            <div className="animate-spin h-12 w-12 border-4 border-[#ffc107] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading your favorites...</p>
          </div>
        ) : favoriteRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteRestaurants.map(restaurant => (
              <div key={restaurant.id}>
                <RestaurantCard restaurant={restaurant} showFavoriteButton={true} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#1c1c1c] rounded-lg">
            <Heart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Favorites Yet</h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              You haven&apos;t saved any favorite restaurants yet. Explore restaurants and add them to your favorites!
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-[#ffc107] hover:bg-[#e6af06] text-black px-6 py-3 rounded-lg"
            >
              Explore Restaurants
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
} 