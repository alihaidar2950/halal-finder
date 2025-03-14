"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { cuisineTypes } from '@/data/menuData';
import Link from 'next/link';
import { MapPin, Search, RefreshCw } from 'lucide-react';
import { fetchRestaurantsByCuisine } from '@/services/restaurantService';
import { getCurrentLocation, RestaurantWithDistance } from '@/utils/locationUtils';
import RestaurantCardGrid from '@/components/RestaurantCardGrid';

export default function CuisinePage() {
  // Use the useParams hook instead of receiving params as a prop
  const params = useParams();
  const cuisineType = params.type as string;
  
  const cuisine = cuisineTypes.find(c => c.id === cuisineType);
  
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<RestaurantWithDistance[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  
  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        setLoading(true);
        
        // Get user location
        const location = await getCurrentLocation();
        setUserLocation(location);
        
        // Fetch restaurants by cuisine
        const results = await fetchRestaurantsByCuisine(
          location.lat,
          location.lng,
          cuisineType,
          10000 // 10km radius
        );
        
        setRestaurants(results);
        setFromCache(results.length > 0 && results[0].fromCache === true);
        setLoading(false);
      } catch (error) {
        console.error("Error loading restaurants:", error);
        setError("Unable to load restaurants. Please try again later.");
        setLoading(false);
      }
    };
    
    loadRestaurants();
  }, [cuisineType]);
  
  const handleRefresh = async () => {
    if (userLocation) {
      setLoading(true);
      
      const results = await fetchRestaurantsByCuisine(
        userLocation.lat,
        userLocation.lng,
        cuisineType,
        10000,
        true // Force refresh
      );
      
      setRestaurants(results);
      setLoading(false);
    }
  };
  
  if (!cuisine) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-orange-500 mb-4">Cuisine Type Not Found</h1>
        <p className="mb-6">The cuisine type you&apos;re looking for doesn&apos;t exist or may have been removed.</p>
        <Link href="/" className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-full text-white">
          Back to Home
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="text-orange-500 hover:text-orange-600 flex items-center gap-2">
            <span>←</span> Back to Home
          </Link>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            {cuisine?.icon} Halal {cuisine?.name} Restaurants
          </h1>
          <p className="text-gray-400">
            Discover the best halal {cuisine?.name.toLowerCase()} restaurants near you
          </p>
        </div>
        
        {loading ? (
          <div className="py-12 text-center">
            <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Searching for halal {cuisine.name.toLowerCase()} restaurants...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900 border border-red-800 text-white px-4 py-3 rounded mb-6">
            {error}
          </div>
        ) : restaurants.length > 0 ? (
          <div>
            {fromCache && (
              <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-3 flex justify-between items-center">
                <p className="text-amber-700 text-sm">Results loaded from cache</p>
                <button 
                  onClick={handleRefresh}
                  className="flex items-center text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 px-2 py-1 rounded"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Refresh
                </button>
              </div>
            )}
            
            <RestaurantCardGrid 
              restaurants={restaurants.filter(restaurant => 
                restaurant.halalStatus !== 'unknown'
              )}
              fromCache={fromCache}
              onRefresh={handleRefresh}
            />
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-800 rounded-lg">
            <Search className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No {cuisine.name} Restaurants Found</h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              We couldn&apos;t find any {cuisine.name.toLowerCase()} halal restaurants near your location. 
              This might be because:
            </p>
            <ul className="text-gray-400 mb-6 max-w-md mx-auto text-left list-disc pl-10">
              <li className="mb-2">There are no results within the search radius</li> 
              <li className="mb-2">The restaurants near you aren&apos;t specifically labeled as {cuisine.name.toLowerCase()}</li>
              <li className="mb-2">Your location services may need to be refreshed</li>
            </ul>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Explore All Restaurants
              </Link>
              <button 
                onClick={handleRefresh}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center"
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 