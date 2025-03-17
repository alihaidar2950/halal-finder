"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrentLocation, RestaurantWithDistance } from '@/utils/locationUtils';
import RestaurantCardGrid from '@/components/RestaurantCardGrid';
import SearchBar from '@/components/SearchBar';
import CuisineFilter from '@/components/CuisineFilter';
import { 
  getFromCache, 
  saveToCache, 
  generateSearchCacheKey, 
  CACHE_EXPIRY,
  clearCache
} from "@/utils/cacheUtils";

// Create a separate client component to use the hooks
function RestaurantsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const cuisineFilter = searchParams.get("cuisine") || "";
  const [restaurants, setRestaurants] = useState<RestaurantWithDistance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [maxDistance, setMaxDistance] = useState(20); // Default 20km radius
  const [activeCuisine, setActiveCuisine] = useState(cuisineFilter || "all");
  const [fromCache, setFromCache] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [cacheKey, setCacheKey] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  // Add keyboard shortcut for debug mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+D to toggle debug mode
      if (e.altKey && e.key === 'd') {
        setDebugMode(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Clear cache and refresh data
  const handleClearCache = () => {
    clearCache();
    const params = new URLSearchParams(searchParams.toString());
    params.set("forceRefresh", "true");
    router.push(`/restaurants?${params.toString()}`);
  };

  // Update active cuisine when URL parameter changes
  useEffect(() => {
    setActiveCuisine(cuisineFilter || "all");
  }, [cuisineFilter]);

  // Handle cuisine filter change
  const handleCuisineChange = (cuisine: string) => {
    setActiveCuisine(cuisine);
    
    // Update URL with new cuisine parameter
    const params = new URLSearchParams(searchParams.toString());
    
    if (cuisine === "all") {
      params.delete("cuisine");
    } else {
      params.set("cuisine", cuisine);
    }
    
    // Keep the search query if it exists
    if (!query) {
      params.delete("q");
    }
    
    // Add forceRefresh parameter to ensure fresh results
    params.set("forceRefresh", "true");
    
    router.push(`/restaurants?${params.toString()}`);
  };

  // Handle distance filter change
  const handleDistanceChange = (distance: number) => {
    setMaxDistance(distance);
    
    // Update URL with new distance parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set("distance", distance.toString());
    
    // Add forceRefresh to ensure fresh results
    params.set("forceRefresh", "true");
    
    router.push(`/restaurants?${params.toString()}`);
  };

  // Main effect to fetch restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      // Clear debug info for new searches
      setDebugInfo([]);
      setLoading(true);
      
      try {
        // Try to get current location
        let location;
        let usingDefaultLocation = false;
        
        try {
          location = await getCurrentLocation();
        } catch (locationError) {
          // Fallback to default location (Ottawa)
          location = { lat: 45.4215, lng: -75.6972 };
          usingDefaultLocation = true;
          setDebugInfo(prev => [...prev, `Location error: ${locationError instanceof Error ? locationError.message : 'Unknown error'}`]);
        }
        
        // Check if we should force refresh
        const forceRefresh = searchParams.get("forceRefresh") === "true";
        if (forceRefresh) {
          setDebugInfo(prev => [...prev, "Force refresh requested, bypassing cache"]);
        }
        
        // Generate cache key
        const radius = maxDistance * 1000; // Convert km to meters
        const searchTerm = query || cuisineFilter || "";
        const computedCacheKey = generateSearchCacheKey(
          searchTerm, 
          location.lat, 
          location.lng, 
          radius,
          cuisineFilter || undefined
        );
        setCacheKey(computedCacheKey);
        
        // Try to get cached results
        let cachedResults = null;
        if (!forceRefresh) {
          cachedResults = getFromCache<RestaurantWithDistance[]>(computedCacheKey);
          
          if (cachedResults) {
            setDebugInfo(prev => [...prev, `Using cached results for: ${computedCacheKey}`]);
          }
        }
        
        if (cachedResults) {
          // Use cached results
          setRestaurants(cachedResults);
          setLoading(false);
          setFromCache(true);
          
          // Set error message if using default location
          if (usingDefaultLocation) {
            setError("Using default location (Ottawa, Canada). Enable location services for better results.");
          } else {
            setError(null);
          }
          
          return;
        }
        
        // Build API URL for fresh results
        setFromCache(false);
        setDebugInfo(prev => [...prev, `Fetching fresh results for: ${searchTerm || 'all restaurants'}`]);
        
        // Construct API URL with appropriate parameters
        let apiUrl = `/api/restaurants?lat=${location.lat}&lng=${location.lng}&radius=${radius}`;
        
        if (query) {
          apiUrl += `&keyword=${encodeURIComponent(query)}`;
        }
        
        if (cuisineFilter) {
          apiUrl += `&cuisine=${encodeURIComponent(cuisineFilter)}`;
        }
        
        if (forceRefresh) {
          apiUrl += `&refresh=true`;
        }
        
        setDebugInfo(prev => [...prev, `API URL: ${apiUrl}`]);
        
        // Fetch restaurants
        const response = await fetch(apiUrl, { method: "GET" });
        
        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        const results = data.restaurants || [];
        
        // Save to cache if we have results
        if (results.length > 0) {
          saveToCache(computedCacheKey, results, CACHE_EXPIRY.SEARCH_RESULTS);
        }
        
        setRestaurants(results);
        
        // Set error if using default location
        if (usingDefaultLocation) {
          setError("Using default location (Ottawa, Canada). Enable location services for better results.");
        } else {
          setError(null);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        setError('Failed to fetch restaurants. Please try again later.');
        setLoading(false);
        setFromCache(false);
      }
    };
    
    fetchRestaurants();
  }, [query, cuisineFilter, maxDistance, searchParams]);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-black text-white">
      <div className="mb-8">
        <Link href="/" className="text-[#ffc107] hover:text-[#e6b006] flex items-center gap-2">
          <span>←</span> Back to Home
        </Link>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">
          <span className="text-[#ffc107]">FIND</span> RESTAURANTS
        </h1>
        <div className="h-[1px] w-16 bg-gray-800 mb-6"></div>
        <SearchBar />
      </div>
      
      {/* Filters Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Cuisine Filter */}
        <div>
          <h2 className="text-xl font-bold mb-4">Filter by Cuisine:</h2>
          <CuisineFilter 
            activeCuisine={activeCuisine} 
            onCuisineChange={handleCuisineChange} 
          />
        </div>
        
        {/* Distance Filter */}
        <div>
          <h2 className="text-xl font-bold mb-4">Filter by Distance:</h2>
          <div className="flex flex-wrap gap-4 mt-8">
            {[5, 10, 20, 40].map((distance) => (
              <button
                key={distance}
                onClick={() => handleDistanceChange(distance)}
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
      </div>
      
      {/* Debug Info Panel */}
      {debugMode && cacheKey && (
        <div className="mb-4 p-4 bg-gray-900 border border-gray-700 rounded text-sm">
          <div className="flex justify-between items-center mb-2">
            <p className="text-white font-semibold">Debug Info (Alt+D to toggle)</p>
            <button 
              onClick={handleClearCache}
              className="bg-[#ffc107] hover:bg-[#e6b006] text-black px-3 py-1 rounded text-xs font-medium"
            >
              Clear Cache Now
            </button>
          </div>
          <div className="font-mono text-xs mt-2">
            <p>Cache Key: <span className="text-[#ffc107]">{cacheKey}</span></p>
            <p className="mt-1">Query: &ldquo;<span className="text-green-400">{query || '(empty)'}</span>&rdquo;</p>
            <p className="mt-1">Cuisine Filter: &ldquo;<span className="text-blue-400">{cuisineFilter || '(none)'}</span>&rdquo;</p>
            <p className="mt-1">Distance Filter: <span className="text-purple-400">{maxDistance}km</span></p>
            <p className="mt-1">From Cache: <span className={fromCache ? "text-green-400" : "text-red-400"}>{fromCache ? "Yes" : "No"}</span></p>
            <p className="mt-1">Force Refresh: <span className={searchParams.get("forceRefresh") === "true" ? "text-green-400" : "text-red-400"}>
              {searchParams.get("forceRefresh") === "true" ? "Yes" : "No"}
            </span></p>
            
            {debugInfo.length > 0 && (
              <div className="mt-3 border-t border-gray-700 pt-2">
                <p className="text-gray-400 mb-1">Debug Log:</p>
                <div className="bg-black bg-opacity-50 p-2 mt-1 max-h-32 overflow-y-auto">
                  {debugInfo.map((info, index) => (
                    <p key={index} className="text-xs text-gray-400">{info}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cached results notice */}
      {!loading && !error && fromCache && (
        <div className="mb-4 text-gray-400 flex justify-between items-center">
          <div>
            Found <span className="text-[#ffc107]">{restaurants.length}</span> result{restaurants.length !== 1 ? 's' : ''} 
            <span className="text-gray-500 italic ml-2 group relative">
              (from cache)
              <span className="hidden group-hover:block absolute left-0 -bottom-8 w-48 bg-black border border-gray-700 p-1 text-xs z-50">
                Press Alt+D to see debug info
              </span>
            </span>
          </div>
          
          <button 
            onClick={handleClearCache}
            className="text-xs px-3 py-1 rounded bg-[#1c1c1c] hover:bg-[#ffc107] hover:text-black text-gray-400 hover:text-black transition-colors border border-gray-700 hover:border-[#ffc107]"
          >
            Clear Cache & Refresh
          </button>
        </div>
      )}
      
      {/* Error display */}
      {error && (
        <div className="bg-[#1c1c1c] border border-red-800 text-red-400 p-4 rounded mb-8">
          <p className="font-semibold mb-2">Notice</p>
          <p>{error}</p>
        </div>
      )}
      
      {/* Loading indicator */}
      {loading && (
        <div className="py-16 text-center">
          <div className="animate-spin h-12 w-12 border-4 border-[#ffc107] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="mt-4 text-gray-400">Searching for halal restaurants...</p>
        </div>
      )}
      
      {/* Results */}
      {!loading && restaurants.length > 0 && (
        <div className="pb-12">
          <RestaurantCardGrid 
            restaurants={restaurants}
            fromCache={fromCache}
            onRefresh={handleClearCache}
            maxDistance={maxDistance}
          />
        </div>
      )}
      
      {/* No results */}
      {!loading && !error && restaurants.length === 0 && (
        <div className="text-center py-16 bg-[#1c1c1c] border border-gray-800 rounded-lg p-8">
          <div className="mb-4 text-4xl">🍔</div>
          <h3 className="text-xl font-semibold mb-2 text-white">No restaurants found</h3>
          <p className="text-gray-400 mb-4">
            {query 
              ? `No matching halal restaurants found for "${query}".` 
              : "No halal restaurants found with your current filters."}
          </p>
          <p className="text-gray-500 text-sm">
            Try searching with different keywords, cuisine types, or increasing your search radius.
          </p>
        </div>
      )}
    </div>
  );
}

// Loading fallback component
function RestaurantsLoading() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-black text-white">
      <div className="py-16 text-center">
        <div className="animate-spin h-12 w-12 border-4 border-[#ffc107] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="mt-4 text-gray-400">Loading restaurant search...</p>
      </div>
    </div>
  );
}

// Main export component with Suspense
export default function RestaurantsPage() {
  return (
    <Suspense fallback={<RestaurantsLoading />}>
      <RestaurantsContent />
    </Suspense>
  );
} 