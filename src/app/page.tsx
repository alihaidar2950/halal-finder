"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import GoogleMapComponent from "@/components/maps/GoogleMapComponent";
import { 
  getCurrentLocation, 
  RestaurantWithDistance
} from "@/utils/locationUtils";
import { fetchNearbyRestaurants } from "@/services/restaurantService";
import { MapPin, Utensils, Award, Phone, Mail, ChevronRight } from "lucide-react";
import RestaurantCardGrid from "@/components/RestaurantCardGrid";

export default function Home() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyRestaurants, setNearbyRestaurants] = useState<RestaurantWithDistance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [maxDistance, setMaxDistance] = useState(5); // Default 5km radius
  const [locationPermissionRequested, setLocationPermissionRequested] = useState(false);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    // Function to get user location and fetch nearby restaurants
    const fetchLocationAndRestaurants = async () => {
      try {
        setLoading(true);
        const location = await getCurrentLocation();
        setUserLocation(location);
        
        // Fetch restaurants from Google Places API
        const results = await fetchNearbyRestaurants(
          location.lat,
          location.lng,
          maxDistance * 1000 // Convert km to meters
        );
        
        // Check if results are from cache
        setFromCache(results.length > 0 && results[0].fromCache === true);
        setNearbyRestaurants(results);
        setLoading(false);
      } catch (error) {
        // Create a more informative error message
        let errorMessage = "Unable to access your location.";
        
        if (error instanceof Error) {
          if (error.message.includes("timed out")) {
            errorMessage = "Location detection timed out. Using default location (Ottawa, Canada).";
          } else if (error.message.includes("denied")) {
            errorMessage = "Location access was denied. Please enable location services to see nearby restaurants.";
          } else {
            errorMessage = `Location error: Using default location (Ottawa, Canada). ${error.message}`;
          }
        }
        
        setError(errorMessage);
        setLoading(false);
        
        // Fallback to a default location (Ottawa center)
        const defaultLocation = { lat: 45.4215, lng: -75.6972 };
        setUserLocation(defaultLocation);
        
        // Fetch restaurants from Google Places API with default location
        try {
          const restaurants = await fetchNearbyRestaurants(
            defaultLocation.lat,
            defaultLocation.lng,
            maxDistance * 1000
          );
          
          setNearbyRestaurants(restaurants);
        } catch {
          // Catch any errors that occur during fetch
          setError("Unable to fetch restaurants with default location. Please try again later.");
        }
      }
    };

    // Only fetch location if user has requested it
    if (locationPermissionRequested) {
      fetchLocationAndRestaurants();
    } else {
      setLoading(false);
    }
  }, [locationPermissionRequested, maxDistance]);

  const handleLocationRequest = () => {
    setLocationPermissionRequested(true);
  };

  const filterByMaxDistance = async (maxDist: number) => {
    setMaxDistance(maxDist);
    
    if (userLocation) {
      setLoading(true);
      const restaurants = await fetchNearbyRestaurants(
        userLocation.lat,
        userLocation.lng,
        maxDist * 1000 // Convert km to meters
      );
      setNearbyRestaurants(restaurants);
      setLoading(false);
    }
  };

  const filteredRestaurants = nearbyRestaurants.filter(
    restaurant => restaurant.distance <= maxDistance * 1000
  );

  // Add a new function to refresh data by clearing cache and re-fetching
  const refreshData = async () => {
    if (userLocation) {
      setLoading(true);
      setFromCache(false);
      
      // Re-fetch restaurants data
      const restaurants = await fetchNearbyRestaurants(
        userLocation.lat,
        userLocation.lng,
        maxDistance * 1000, // Convert km to meters
        true // Force refresh (skip cache)
      );
      
      setNearbyRestaurants(restaurants);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] overflow-hidden">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-[10%] w-40 h-40 animate-float-slow opacity-20 hidden md:block">
            <svg viewBox="0 0 24 24" className="w-full h-full text-[#4CAF50]">
              <path fill="currentColor" d="M12,3C16.42,3 20,4.79 20,7C20,9.21 16.42,11 12,11C7.58,11 4,9.21 4,7C4,4.79 7.58,3 12,3M4,9C4,11.21 7.58,13 12,13C16.42,13 20,11.21 20,9V12C20,14.21 16.42,16 12,16C7.58,16 4,14.21 4,12V9M4,14C4,16.21 7.58,18 12,18C16.42,18 20,16.21 20,14V17C20,19.21 16.42,21 12,21C7.58,21 4,19.21 4,17V14Z" />
            </svg>
          </div>
          <div className="absolute top-1/3 right-[15%] w-32 h-32 animate-float-medium opacity-20 hidden md:block">
            <svg viewBox="0 0 24 24" className="w-full h-full text-[#ffc107] rotate-45">
              <path fill="currentColor" d="M12,3C16.42,3 20,4.79 20,7C20,9.21 16.42,11 12,11C7.58,11 4,9.21 4,7C4,4.79 7.58,3 12,3M4,9C4,11.21 7.58,13 12,13C16.42,13 20,11.21 20,9V12C20,14.21 16.42,16 12,16C7.58,16 4,14.21 4,12V9M4,14C4,16.21 7.58,18 12,18C16.42,18 20,16.21 20,14V17C20,19.21 16.42,21 12,21C7.58,21 4,19.21 4,17V14Z" />
            </svg>
          </div>
          <div className="absolute bottom-1/4 left-[20%] w-24 h-24 animate-float-fast opacity-20 hidden md:block">
            <svg viewBox="0 0 24 24" className="w-full h-full text-[#4CAF50]">
              <path fill="currentColor" d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
            </svg>
          </div>
        </div>
        
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5"
          alt="Food background"
          className="absolute h-full w-full object-cover object-center z-0"
        />
        
        {/* Content */}
        <div className="relative z-20 h-full flex flex-col items-center justify-center">
          <div className="container mx-auto px-6 text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-32 h-[3px] bg-[#ffc107]"></div>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight">
              <div className="relative inline-block">
                <span className="text-[#ffc107] drop-shadow-[0_0_10px_rgba(255,193,7,0.5)]">HALAL</span>
              </div>
              <div className="relative inline-block ml-4">
                <span className="text-white">FINDER</span>
                <div className="absolute -top-6 -right-12 transform rotate-12 hidden md:block">
                  <div className="bg-[#ffc107] text-black text-xs font-bold rounded-full w-16 h-16 flex items-center justify-center">
                    <div className="transform -rotate-12">
                      <div className="text-sm uppercase">NEW</div>
                    </div>
                  </div>
                </div>
              </div>
            </h1>
            
            <div className="flex justify-center mb-12">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-[1px] bg-[#ffc107]"></div>
                <div className="text-[#ffc107]">
                  <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <path fill="currentColor" d="M11,9H13V15H11V9M11,5H13V7H11V5M6,5H8V7H6V5M6,9H8V11H6V9M6,13H8V15H6V13M6,17H8V19H6V17M10,5H12V7H10V5M10,17H12V19H10V17M14,5H16V7H14V5M14,9H16V11H14V9M14,13H16V15H14V13M14,17H16V19H14V17M18,5H20V7H18V5M18,9H20V11H18V9M18,13H20V15H18V13M18,17H20V19H18V17Z" />
                  </svg>
                </div>
                <div className="w-12 h-[1px] bg-[#ffc107]"></div>
              </div>
            </div>
            
            <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-12">
              Discover the finest halal restaurants near you. Search by location or cuisine to find authentic halal dining options.
            </p>
            
            <div className="max-w-3xl mx-auto">
              {!locationPermissionRequested ? (
                <button 
                  onClick={handleLocationRequest}
                  className="uppercase tracking-wider border-2 border-[#ffc107] hover:bg-[#ffc107] hover:text-black transition-all duration-300 px-10 py-3 text-[#ffc107]"
                >
                  FIND RESTAURANTS NEAR ME
                </button>
              ) : (
                <SearchBar />
              )}
            </div>
            
            <div className="mt-16 grid grid-cols-3 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              {[
                { label: "Restaurants", value: "1000+", icon: "🍽️" },
                { label: "Cuisines", value: "25+", icon: "🌮" },
                { label: "Countries", value: "15+", icon: "🌎" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 rounded-full bg-[#ffc107]/20 border border-[#ffc107]/50 flex items-center justify-center text-2xl">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm uppercase tracking-wider text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#0a0a0a] border-t border-gray-800 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-16 h-16 animate-float-slow opacity-30">
            <div className="w-full h-full rounded-full bg-[#4CAF50]/20"></div>
          </div>
        </div>

        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-3">
              <div className="relative inline-block">
                <span className="text-[#ffc107] drop-shadow-[0_0_8px_rgba(255,193,7,0.3)]">PREMIUM</span>
                <span className="relative ml-2 text-white">EXPERIENCE</span>
                <div className="absolute -top-6 -right-10 transform rotate-12">
                  <div className="bg-[#ffc107] text-black text-xs rounded-full w-12 h-12 flex items-center justify-center font-bold">
                    <div className="transform -rotate-12">NEW</div>
                  </div>
                </div>
              </div>
            </h2>
            <div className="h-[1px] w-24 bg-gray-800 mx-auto mt-6 mb-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-[#ffc107]/0 via-[#ffc107]/5 to-[#ffc107]/0 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="flex justify-center mb-6">
                  <div className="inline-block p-4 border-2 border-[#ffc107] rounded-full">
                    <Utensils className="h-8 w-8 text-[#ffc107]" />
                  </div>
                </div>
                <h3 className="uppercase text-sm tracking-widest mb-4 text-[#ffc107]">FRESH HALAL FOOD</h3>
                <p className="text-gray-400 text-sm mx-auto max-w-xs">
                  Every restaurant we feature is carefully vetted to ensure they serve fresh, authentic halal cuisine.
                </p>
                <div className="absolute -top-4 -right-4 bg-[#ffc107] text-black font-bold rounded-full w-14 h-14 flex items-center justify-center transform rotate-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span>100%</span>
                </div>
              </div>
            </div>
            
            <div className="text-center relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-[#ffc107]/0 via-[#ffc107]/5 to-[#ffc107]/0 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="flex justify-center mb-6">
                  <div className="inline-block p-4 border-2 border-[#ffc107] rounded-full">
                    <MapPin className="h-8 w-8 text-[#ffc107]" />
                  </div>
                </div>
                <h3 className="uppercase text-sm tracking-widest mb-4 text-[#ffc107]">SPECIAL CUISINE</h3>
                <p className="text-gray-400 text-sm mx-auto max-w-xs">
                  Discover a diverse range of halal cuisines from around the world, from traditional to modern fusion.
                </p>
                <div className="absolute -top-4 -right-4 bg-[#ffc107] text-black font-bold rounded-full w-14 h-14 flex items-center justify-center transform rotate-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span>24/7</span>
                </div>
              </div>
            </div>
            
            <div className="text-center relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-[#ffc107]/0 via-[#ffc107]/5 to-[#ffc107]/0 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="flex justify-center mb-6">
                  <div className="inline-block p-4 border-2 border-[#ffc107] rounded-full">
                    <Award className="h-8 w-8 text-[#ffc107]" />
                  </div>
                </div>
                <h3 className="uppercase text-sm tracking-widest mb-4 text-[#ffc107]">BEST SERVICE</h3>
                <p className="text-gray-400 text-sm mx-auto max-w-xs">
                  We highlight restaurants known for their exceptional service and dining experiences.
                </p>
                <div className="absolute -top-4 -right-4 bg-[#ffc107] text-black font-bold rounded-full w-14 h-14 flex items-center justify-center transform rotate-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span>5★</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[5%] w-24 h-24 animate-float-slow opacity-20">
            <svg viewBox="0 0 24 24" className="w-full h-full text-[#4CAF50]">
              <path fill="currentColor" d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
            </svg>
          </div>
          <div className="absolute bottom-[15%] right-[8%] w-20 h-20 animate-float-medium opacity-20">
            <svg viewBox="0 0 24 24" className="w-full h-full text-[#4CAF50] rotate-45">
              <path fill="currentColor" d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
            </svg>
          </div>
        </div>

        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#ffc107]/0 via-[#ffc107]/20 to-[#ffc107]/0 rounded-lg blur opacity-70"></div>
                <div className="relative overflow-hidden border-2 border-[#ffc107]/50 rounded-sm">
                  <img
                    src="https://images.unsplash.com/photo-1514326640560-7d063ef2aed5"
                    alt="Elegant restaurant interior"
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <div className="inline-block bg-[#ffc107] text-black px-4 py-1 text-sm font-bold uppercase tracking-wider mb-2">
                      Est. 2023
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-[#ffc107] text-black font-bold rounded-full w-24 h-24 flex items-center justify-center transform rotate-12 shadow-xl shadow-[#ffc107]/20">
                  <div className="transform -rotate-12 text-center">
                    <div className="text-xs uppercase">Quality</div>
                    <div className="text-xl font-bold">100%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2">
              <div className="mb-8">
                <div className="text-[#ffc107] uppercase tracking-widest font-bold mb-2">About Us</div>
                <h2 className="text-4xl font-bold mb-6 relative">
                  <span className="text-[#ffc107] drop-shadow-[0_0_8px_rgba(255,193,7,0.3)]">THE HALAL</span>
                  <span className="text-white ml-2">FINDER</span>
                </h2>
                <div className="flex items-center mb-8">
                  <div className="h-[2px] w-16 bg-[#ffc107]"></div>
                  <div className="mx-4">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#ffc107]">
                      <path fill="currentColor" d="M11,9H13V15H11V9M11,5H13V7H11V5M6,5H8V7H6V5M6,9H8V11H6V9M6,13H8V15H6V13M6,17H8V19H6V17M10,5H12V7H10V5M10,17H12V19H10V17M14,5H16V7H14V5M14,9H16V11H14V9M14,13H16V15H14V13M14,17H16V19H14V17M18,5H20V7H18V5M18,9H20V11H18V9M18,13H20V15H18V13M18,17H20V19H18V17Z" />
                    </svg>
                  </div>
                  <div className="h-[2px] w-16 bg-[#ffc107]"></div>
                </div>
              </div>

              <div className="space-y-6 text-gray-300">
                <p className="text-lg leading-relaxed">
                  The HALAL FINDER is your premier destination for discovering authentic halal cuisine around you. Our platform connects food enthusiasts with certified halal restaurants, ensuring a dining experience that respects your dietary preferences.
                </p>
                <p className="text-lg leading-relaxed">
                  From traditional favorites to modern culinary innovations, we&apos;ve curated the finest halal establishments to satisfy your cravings and expand your palate.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 text-[#ffc107]">
                      <svg viewBox="0 0 24 24" className="w-6 h-6">
                        <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z" />
                      </svg>
                    </div>
                    <div className="font-medium">Certified Halal</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 text-[#ffc107]">
                      <svg viewBox="0 0 24 24" className="w-6 h-6">
                        <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z" />
                      </svg>
                    </div>
                    <div className="font-medium">Global Cuisines</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 text-[#ffc107]">
                      <svg viewBox="0 0 24 24" className="w-6 h-6">
                        <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z" />
                      </svg>
                    </div>
                    <div className="font-medium">User Reviews</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 text-[#ffc107]">
                      <svg viewBox="0 0 24 24" className="w-6 h-6">
                        <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z" />
                      </svg>
                    </div>
                    <div className="font-medium">GPS Integration</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nearby Restaurants Section (conditionally rendered) */}
      {locationPermissionRequested && (
        <section id="nearby-restaurants" className="py-20 bg-[#0a0a0a] border-t border-gray-800">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">
                <span className="text-[#ffc107]">NEAR</span> YOU
              </h2>
              <div className="h-[1px] w-24 bg-gray-800 mx-auto mb-4"></div>
              <div className="uppercase text-sm tracking-widest text-gray-400">Halal Restaurants</div>
            </div>
            
            {loading ? (
              <div className="py-16 text-center">
                <div className="animate-spin h-12 w-12 border-4 border-[#ffc107] border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-400">{userLocation ? "Searching for restaurants..." : "Detecting your location..."}</p>
              </div>
            ) : error ? (
              <div className="bg-[#1c1c1c] border border-red-800 text-red-400 px-4 py-3 rounded mb-6">
                {error}
              </div>
            ) : (
              <>
                <div className="mb-12">
                  <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <button
                      onClick={() => filterByMaxDistance(5)}
                      className={`px-6 py-2 border-2 rounded-none ${
                        maxDistance === 5 
                          ? "bg-[#ffc107] text-black border-[#ffc107]" 
                          : "bg-transparent text-white border-gray-700 hover:border-[#ffc107] hover:text-[#ffc107]"
                      } transition-colors`}
                    >
                      Within 5km
                    </button>
                    <button
                      onClick={() => filterByMaxDistance(10)}
                      className={`px-6 py-2 border-2 rounded-none ${
                        maxDistance === 10 
                          ? "bg-[#ffc107] text-black border-[#ffc107]" 
                          : "bg-transparent text-white border-gray-700 hover:border-[#ffc107] hover:text-[#ffc107]"
                      } transition-colors`}
                    >
                      Within 10km
                    </button>
                    <button
                      onClick={() => filterByMaxDistance(20)}
                      className={`px-6 py-2 border-2 rounded-none ${
                        maxDistance === 20 
                          ? "bg-[#ffc107] text-black border-[#ffc107]" 
                          : "bg-transparent text-white border-gray-700 hover:border-[#ffc107] hover:text-[#ffc107]"
                      } transition-colors`}
                    >
                      Within 20km
                    </button>
                    <button
                      onClick={() => filterByMaxDistance(40)}
                      className={`px-6 py-2 border-2 rounded-none ${
                        maxDistance === 40 
                          ? "bg-[#ffc107] text-black border-[#ffc107]" 
                          : "bg-transparent text-white border-gray-700 hover:border-[#ffc107] hover:text-[#ffc107]"
                      } transition-colors`}
                    >
                      Within 40km
                    </button>
                  </div>
                  
                  <p className="text-center text-gray-400 mb-10">
                    Showing <span className="text-[#ffc107]">{filteredRestaurants.length}</span> restaurants within <span className="text-[#ffc107]">{maxDistance}km</span>
                  </p>
                </div>
                
                <div className="mb-16 rounded-none overflow-hidden border border-gray-800">
                  {userLocation && (
                    <GoogleMapComponent 
                      restaurants={filteredRestaurants} 
                      center={userLocation}
                      zoom={12}
                    />
                  )}
                </div>
                
                {filteredRestaurants.length > 0 ? (
                  <div className="pb-12">
                    <RestaurantCardGrid 
                      restaurants={filteredRestaurants}
                      fromCache={fromCache}
                      onRefresh={refreshData}
                      maxDistance={maxDistance}
                    />
                  </div>
                ) : (
                  <div className="text-center py-16 bg-[#121212] border border-gray-800 rounded-none">
                    <h3 className="text-xl font-bold text-white mb-4">No halal restaurants found nearby</h3>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                      Try increasing your search radius or try a different location.
                    </p>
                    <button
                      onClick={() => filterByMaxDistance(maxDistance + 10)}
                      className="border-2 border-[#ffc107] text-[#ffc107] hover:bg-[#ffc107] hover:text-black px-8 py-3 uppercase tracking-wider transition-all duration-300"
                    >
                      Expand Search
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}
      
      {/* Cuisines Section */}
      <section className="py-20 bg-[#0a0a0a] border-t border-gray-800 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[15%] right-[5%] w-20 h-20 animate-float-slow opacity-20">
            <svg viewBox="0 0 24 24" className="w-full h-full text-[#4CAF50]">
              <path fill="currentColor" d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
            </svg>
          </div>
          <div className="absolute bottom-[10%] left-[8%] w-16 h-16 animate-float-medium opacity-20">
            <svg viewBox="0 0 24 24" className="w-full h-full text-[#4CAF50]">
              <path fill="currentColor" d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
            </svg>
          </div>
        </div>

        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-3 relative inline-block">
              <span className="text-[#ffc107] drop-shadow-[0_0_8px_rgba(255,193,7,0.3)]">OUR</span>
              <span className="text-white ml-2">MENU</span>
              <div className="absolute -top-4 right-0 transform rotate-12">
                <div className="w-12 h-12 bg-[#ffc107] text-black text-xs rounded-full flex items-center justify-center font-bold">
                  <div className="transform -rotate-12">HOT</div>
                </div>
              </div>
            </h2>
            <div className="flex items-center justify-center mt-6 mb-8">
              <div className="h-[1px] w-12 bg-[#ffc107]"></div>
              <div className="mx-4">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#ffc107]">
                  <path fill="currentColor" d="M11,9H13V15H11V9M11,5H13V7H11V5M6,5H8V7H6V5M6,9H8V11H6V9M6,13H8V15H6V13M6,17H8V19H6V17M10,5H12V7H10V5M10,17H12V19H10V17M14,5H16V7H14V5M14,9H16V11H14V9M14,13H16V15H14V13M14,17H16V19H14V17M18,5H20V7H18V5M18,9H20V11H18V9M18,13H20V15H18V13M18,17H20V19H18V17Z" />
                </svg>
              </div>
              <div className="h-[1px] w-12 bg-[#ffc107]"></div>
            </div>
            <p className="text-gray-400 max-w-xl mx-auto">
              Explore a variety of cuisines from around the world, all certified halal.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Turkish", image: "https://images.unsplash.com/photo-1561626423-a51b45aef0a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", price: "$18" },
              { name: "Lebanese", image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", price: "$22" },
              { name: "Indian", image: "https://images.unsplash.com/photo-1596797038530-2c107aa7ad9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", price: "$20" },
              { name: "Malaysian", image: "https://images.unsplash.com/photo-1563245156-e9c49cf16b22?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", price: "$15" },
              { name: "Indonesian", image: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", price: "$19" },
              { name: "Mediterranean", image: "https://images.unsplash.com/photo-1540914124281-342587941389?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", price: "$24" },
            ].map((cuisine, index) => (
              <div key={index} className="group relative overflow-hidden border border-gray-800 bg-[#090909] hover:border-[#ffc107]/30 transition-all duration-500 rounded-lg">
                <div className="absolute -right-4 -top-4">
                  <div className="bg-[#ffc107] text-black font-bold rounded-full w-16 h-16 flex items-center justify-center transform rotate-12 shadow-lg shadow-[#ffc107]/20">
                    <span>{cuisine.price}</span>
                  </div>
                </div>
                <div className="h-48 overflow-hidden">
                  <img
                    src={cuisine.image}
                    alt={cuisine.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col items-center justify-center">
                  <h3 className="text-xl font-bold uppercase tracking-wider text-white mb-2">{cuisine.name}</h3>
                  <div className="flex items-center">
                    <div className="w-8 h-[1px] bg-[#ffc107]"></div>
                    <div className="mx-2">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#ffc107]">
                        <path fill="currentColor" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
                      </svg>
                    </div>
                    <div className="w-8 h-[1px] bg-[#ffc107]"></div>
                  </div>
                  <p className="text-gray-400 text-sm mt-3 text-center">
                    Authentic {cuisine.name} cuisine with certified halal ingredients.
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/search" className="inline-flex items-center justify-center bg-[#0a0a0a] border border-[#ffc107] text-[#ffc107] hover:bg-[#ffc107] hover:text-[#0a0a0a] px-8 py-3 rounded-sm uppercase text-sm tracking-wider font-bold transition-colors duration-300">
              Explore All Cuisines
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Simplified version since we already have the MainLayout footer */}
      <footer className="bg-black text-white py-12 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <h3 className="text-xl font-bold mb-6">
                <span className="text-[#ffc107]">HALAL</span>FINDER
              </h3>
              <p className="text-gray-400 mb-4">
                Discover premium halal dining experiences around you with confidence.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="h-10 w-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-[#ffc107] hover:border-[#ffc107]">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="h-10 w-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-[#ffc107] hover:border-[#ffc107]">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="h-10 w-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-[#ffc107] hover:border-[#ffc107]">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-[#ffc107] text-sm uppercase tracking-wider mb-6">QUICK LINKS</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-gray-400 hover:text-[#ffc107]">ABOUT US</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-[#ffc107]">PRIVACY POLICY</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-[#ffc107]">TERMS & CONDITIONS</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-[#ffc107]">CONTACT</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-[#ffc107] text-sm uppercase tracking-wider mb-6">CUISINES</h4>
              <ul className="space-y-3">
                <li><Link href="/cuisines/american" className="text-gray-400 hover:text-[#ffc107]">AMERICAN</Link></li>
                <li><Link href="/cuisines/indian" className="text-gray-400 hover:text-[#ffc107]">INDIAN</Link></li>
                <li><Link href="/cuisines/middle-eastern" className="text-gray-400 hover:text-[#ffc107]">MIDDLE EASTERN</Link></li>
                <li><Link href="/cuisines/asian" className="text-gray-400 hover:text-[#ffc107]">ASIAN</Link></li>
                <li><Link href="/cuisines/turkish" className="text-gray-400 hover:text-[#ffc107]">TURKISH</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-[#ffc107] text-sm uppercase tracking-wider mb-6">CONTACT US</h4>
              <div className="space-y-4">
                <p className="flex items-center space-x-3 text-gray-400">
                  <MapPin className="h-5 w-5 text-[#ffc107]" />
                  <span>Ottawa, ON, Canada</span>
                </p>
                <p className="flex items-center space-x-3 text-gray-400">
                  <Phone className="h-5 w-5 text-[#ffc107]" />
                  <span>+1 613-555-5555</span>
                </p>
                <p className="flex items-center space-x-3 text-gray-400">
                  <Mail className="h-5 w-5 text-[#ffc107]" />
                  <span>info@halalfinder.com</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Halal Finder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
