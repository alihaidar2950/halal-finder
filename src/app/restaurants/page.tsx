"use client";

import React, { useState, useEffect } from 'react';
import { getCurrentLocation, RestaurantWithDistance } from '@/utils/locationUtils';
import { fetchNearbyRestaurants } from '@/services/restaurantService';
import RestaurantCardGrid from '@/components/RestaurantCardGrid';
import SearchBar from '@/components/SearchBar';

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<RestaurantWithDistance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [maxDistance, setMaxDistance] = useState(20); // Default 20km radius

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      
      try {
        // Try to get current location
        let location;
        try {
          location = await getCurrentLocation();
        } catch (error) {
          // Fallback to default location (Ottawa)
          location = { lat: 45.4215, lng: -75.6972 };
          setError("Using default location (Ottawa, Canada). Enable location services for better results.");
        }
        
        // Fetch restaurants
        const results = await fetchNearbyRestaurants(
          location.lat,
          location.lng,
          maxDistance * 1000 // Convert km to meters
        );
        
        setRestaurants(results);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        setError('Failed to fetch restaurants. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchRestaurants();
  }, [maxDistance]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">
        <span className="text-[#ffc107]">Halal</span> Restaurants
      </h1>
      
      <div className="mb-8">
        <SearchBar />
      </div>
      
      {error && (
        <div className="bg-[#1c1c1c] border border-red-800 text-red-400 p-4 mb-8 rounded">
          {error}
        </div>
      )}
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Filter by Distance</h2>
        <div className="flex flex-wrap gap-4">
          {[5, 10, 20, 40].map((distance) => (
            <button
              key={distance}
              onClick={() => setMaxDistance(distance)}
              className={`px-6 py-2 border-2 rounded-none ${
                maxDistance === distance 
                  ? "bg-[#ffc107] text-black border-[#ffc107]" 
                  : "bg-transparent text-white border-gray-700 hover:border-[#ffc107] hover:text-[#ffc107]"
              } transition-colors`}
            >
              Within {distance}km
            </button>
          ))}
        </div>
      </div>
      
      {loading ? (
        <div className="py-16 text-center">
          <div className="animate-spin h-12 w-12 border-4 border-[#ffc107] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Searching for halal restaurants...</p>
        </div>
      ) : restaurants.length > 0 ? (
        <RestaurantCardGrid 
          restaurants={restaurants}
          maxDistance={maxDistance}
        />
      ) : (
        <div className="text-center py-16 bg-[#121212] border border-gray-800 rounded-none">
          <h3 className="text-xl font-bold text-white mb-4">No halal restaurants found</h3>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Try increasing your search radius or try a different location.
          </p>
        </div>
      )}
    </div>
  );
} 