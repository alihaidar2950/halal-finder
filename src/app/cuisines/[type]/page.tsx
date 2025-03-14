"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { cuisineTypes } from '@/data/menuData';
import Link from 'next/link';
import { MapPin, ArrowLeft, RefreshCw } from 'lucide-react';
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
      <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-serif italic mb-4">Cuisine Type Not Found</h1>
        <p className="mb-8 text-gray-600">The cuisine type you&apos;re looking for doesn&apos;t exist or may have been removed.</p>
        <Link href="/" className="uppercase tracking-wider border-2 border-black hover:bg-black hover:text-white transition-all duration-300 px-8 py-3">
          Back to Home
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero section with cuisine type */}
      <section 
        className="relative py-40 flex items-center justify-center text-white"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2938&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="container relative z-10 px-6 text-center">
          <div className="text-7xl mb-4">{cuisine?.icon}</div>
          <h1 className="font-serif italic text-5xl mb-4">
            {cuisine?.name} Cuisine
          </h1>
          <div className="uppercase text-sm tracking-widest mb-6">
            Discover Authentic Halal {cuisine?.name} Restaurants
          </div>
          
          <Link href="/" className="inline-flex items-center text-white hover:text-orange-300 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="uppercase tracking-wider text-sm">Back to Home</span>
          </Link>
        </div>
      </section>
      
      <section className="py-20">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="py-16 text-center">
              <div className="animate-spin h-12 w-12 border-4 border-amber-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Searching for halal {cuisine.name.toLowerCase()} restaurants...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-5 rounded-lg mb-8">
              {error}
            </div>
          ) : restaurants.length > 0 ? (
            <div>
              <div className="text-center mb-16">
                <h2 className="font-serif italic text-4xl mb-3">
                  {cuisine?.name} Restaurants
                </h2>
                <div className="uppercase text-sm tracking-widest">
                  Halal Certified Near You
                </div>
              </div>
              
              {fromCache && (
                <div className="mb-12 flex justify-end">
                  <button 
                    onClick={handleRefresh}
                    className="flex items-center text-sm bg-white border border-gray-300 hover:border-amber-600 text-gray-800 px-4 py-2 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Results
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
            <div className="text-center py-24 bg-gray-50 rounded-lg">
              <div className="text-7xl mb-8">{cuisine?.icon}</div>
              <h2 className="font-serif italic text-3xl mb-4">No {cuisine.name} Restaurants Found</h2>
              <p className="text-gray-600 mb-10 max-w-xl mx-auto">
                We couldn&apos;t find any {cuisine.name.toLowerCase()} halal restaurants near your location. 
                This might be because:
              </p>
              <ul className="text-gray-600 mb-12 max-w-xl mx-auto text-left list-disc pl-10">
                <li className="mb-3">There are no results within the search radius</li> 
                <li className="mb-3">The restaurants near you aren&apos;t specifically labeled as {cuisine.name.toLowerCase()}</li>
                <li className="mb-3">Your location services may need to be refreshed</li>
              </ul>
              <div className="flex flex-wrap gap-6 justify-center">
                <Link href="/" className="uppercase tracking-wider border-2 border-black hover:bg-black hover:text-white transition-all duration-300 px-8 py-3 inline-flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  Explore All Restaurants
                </Link>
                <button 
                  onClick={handleRefresh}
                  className="uppercase tracking-wider border-2 border-gray-400 text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-all duration-300 px-8 py-3 inline-flex items-center"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 