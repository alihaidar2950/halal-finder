"use client";

import { useState, useEffect } from "react";
import GoogleMapComponent from "@/components/maps/GoogleMapComponent";
import RestaurantCard from "@/components/RestaurantCard";
import { 
  getCurrentLocation, 
  formatDistance,
  RestaurantWithDistance
} from "@/utils/locationUtils";
import { fetchNearbyRestaurants } from "@/services/restaurantService";
import { MapPin, Navigation } from "lucide-react";
import Link from "next/link";

export default function NearbyPage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyRestaurants, setNearbyRestaurants] = useState<RestaurantWithDistance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [maxDistance, setMaxDistance] = useState(5); // Default 5km radius

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setLoading(true);
        const location = await getCurrentLocation();
        setUserLocation(location);
        
        // Fetch restaurants from Google Places API
        const restaurants = await fetchNearbyRestaurants(
          location.lat,
          location.lng,
          maxDistance * 1000 // Convert km to meters
        );
        
        setNearbyRestaurants(restaurants);
        setLoading(false);
      } catch {
        setError("Unable to access your location. Please enable location services.");
        setLoading(false);
        
        // Fallback to a default location (Ottawa center)
        const defaultLocation = { lat: 45.4215, lng: -75.6972 };
        setUserLocation(defaultLocation);
        
        // Fetch restaurants from Google Places API with default location
        const restaurants = await fetchNearbyRestaurants(
          defaultLocation.lat,
          defaultLocation.lng,
          maxDistance * 1000
        );
        
        setNearbyRestaurants(restaurants);
      }
    };

    fetchLocation();
  }, [maxDistance]);

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
    restaurant => restaurant.distance <= maxDistance
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="text-orange-500 hover:text-orange-600 flex items-center gap-2">
          <span>←</span> Back to Home
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-4 flex items-center">
        <MapPin className="mr-2 h-8 w-8 text-orange-500" />
        Halal Restaurants Near Me
      </h1>
      
      {loading ? (
        <div className="py-8 text-center">
          <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>{userLocation ? "Searching for restaurants..." : "Detecting your location..."}</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      ) : (
        <>
          <div className="mb-8">
            <div className="flex flex-wrap gap-3 mb-4">
              <button
                onClick={() => filterByMaxDistance(1)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  maxDistance === 1 
                    ? "bg-orange-500 text-white" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Within 1km
              </button>
              <button
                onClick={() => filterByMaxDistance(3)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  maxDistance === 3 
                    ? "bg-orange-500 text-white" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Within 3km
              </button>
              <button
                onClick={() => filterByMaxDistance(5)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  maxDistance === 5 
                    ? "bg-orange-500 text-white" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Within 5km
              </button>
              <button
                onClick={() => filterByMaxDistance(10)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  maxDistance === 10 
                    ? "bg-orange-500 text-white" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Within 10km
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              Showing {filteredRestaurants.length} restaurants within {maxDistance}km
            </p>
          </div>
          
          <div className="mb-12">
            {userLocation && (
              <GoogleMapComponent 
                restaurants={filteredRestaurants} 
                center={userLocation}
                zoom={12}
              />
            )}
          </div>
          
          {filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map(restaurant => (
                <div key={restaurant.id} className="relative">
                  <RestaurantCard restaurant={restaurant} />
                  <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <Navigation className="w-3 h-3 mr-1" />
                    {formatDistance(restaurant.distance)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-xl mb-2">No halal restaurants found nearby</h3>
              <p className="text-gray-600 mb-4">
                Try increasing your search radius or try a different location.
              </p>
              <button
                onClick={() => filterByMaxDistance(maxDistance + 5)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
              >
                Increase Search Radius (+5km)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
} 