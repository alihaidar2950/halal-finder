"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cuisineTypes } from "@/data/menuData";
import SearchBar from "@/components/SearchBar";
import GoogleMapComponent from "@/components/maps/GoogleMapComponent";
import RestaurantCard from "@/components/RestaurantCard";
import { 
  getCurrentLocation, 
  formatDistance,
  RestaurantWithDistance
} from "@/utils/locationUtils";
import { fetchNearbyRestaurants } from "@/services/restaurantService";
import { MapPin, Navigation } from "lucide-react";

export default function Home() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyRestaurants, setNearbyRestaurants] = useState<RestaurantWithDistance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [maxDistance, setMaxDistance] = useState(5); // Default 5km radius
  const [locationPermissionRequested, setLocationPermissionRequested] = useState(false);

  useEffect(() => {
    // Function to get user location and fetch nearby restaurants
    const fetchLocationAndRestaurants = async () => {
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
    restaurant => restaurant.distance <= maxDistance
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-black text-white p-4 border-b border-gray-800">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-orange-500">Halal Finder</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-orange-400">Home</Link>
            <Link href="/search" className="hover:text-orange-400">Search</Link>
            <Link href="#cuisines" className="hover:text-orange-400">Cuisines</Link>
            <Link href="#" className="hover:text-orange-400">About</Link>
            <Link href="#" className="hover:text-orange-400">Contact</Link>
          </nav>
          <div className="flex space-x-4">
            <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section with Search and Location Request */}
        <section className="relative bg-gray-900 py-24 mb-8">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          
          <div className="container mx-auto px-4 z-10 relative">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-4 text-white">Find <span className="text-orange-500">Halal</span> Restaurants Near You</h1>
              <p className="text-xl text-gray-300 mb-8">Discover the best halal restaurants for any cuisine, taste, and occasion</p>
              
              {!locationPermissionRequested ? (
                <div className="flex flex-col items-center">
                  <SearchBar />
                  <div className="mt-8 text-center">
                    <p className="text-lg text-gray-300 mb-4">Or find halal restaurants near your current location</p>
                    <button 
                      onClick={handleLocationRequest}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center justify-center mx-auto"
                    >
                      <MapPin className="mr-2 h-5 w-5" />
                      Use My Location
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <SearchBar />
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* Nearby Restaurants Section (conditionally rendered) */}
        {locationPermissionRequested && (
          <section id="nearby-restaurants" className="py-12 bg-gray-800">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8 flex items-center">
                <MapPin className="mr-3 h-8 w-8 text-orange-500" />
                Halal Restaurants Near You
              </h2>
              
              {loading ? (
                <div className="py-8 text-center">
                  <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p>{userLocation ? "Searching for restaurants..." : "Detecting your location..."}</p>
                </div>
              ) : error ? (
                <div className="bg-red-900 border border-red-800 text-white px-4 py-3 rounded mb-6">
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
                            : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                        }`}
                      >
                        Within 1km
                      </button>
                      <button
                        onClick={() => filterByMaxDistance(3)}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                          maxDistance === 3 
                            ? "bg-orange-500 text-white" 
                            : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                        }`}
                      >
                        Within 3km
                      </button>
                      <button
                        onClick={() => filterByMaxDistance(5)}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                          maxDistance === 5 
                            ? "bg-orange-500 text-white" 
                            : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                        }`}
                      >
                        Within 5km
                      </button>
                      <button
                        onClick={() => filterByMaxDistance(10)}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                          maxDistance === 10 
                            ? "bg-orange-500 text-white" 
                            : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                        }`}
                      >
                        Within 10km
                      </button>
                    </div>
                    
                    <p className="text-gray-400 mb-6">
                      Showing {filteredRestaurants.length} restaurants within {maxDistance}km
                    </p>
                  </div>
                  
                  <div className="mb-12 rounded-lg overflow-hidden">
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
                    <div className="text-center py-12 bg-gray-700 rounded-lg">
                      <h3 className="text-xl mb-2">No halal restaurants found nearby</h3>
                      <p className="text-gray-300 mb-4">
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
          </section>
        )}
        
        {/* Cuisines Section */}
        <section id="cuisines" className="py-16 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-orange-500">Explore Cuisines</h2>
              <p className="text-gray-300">Discover restaurants by your favorite cuisine</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {/* Skip the 'all' option which is at index 0 */}
              {cuisineTypes.slice(1).map(cuisine => (
                <Link 
                  key={cuisine.id} 
                  href={`/cuisines/${encodeURIComponent(cuisine.id)}`}
                  className="bg-gray-700 hover:bg-gray-600 rounded-lg p-6 text-center transition-all"
                >
                  <div className="text-4xl mb-3">{cuisine.icon}</div>
                  <h3 className="font-bold">{cuisine.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-black text-gray-300 py-12">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
          <div>
            <h3 className="text-xl font-bold mb-4 text-orange-500">CONTACT US</h3>
            <address className="not-italic">
              <p className="flex items-center mb-2">
                <span className="mr-2">📍</span> Ottawa, ON, Canada
              </p>
              <p className="flex items-center mb-2">
                <span className="mr-2">📞</span> +1 613-999-9999
              </p>
              <p className="flex items-center mb-2">
                <span className="mr-2">✉️</span> info@halalfinder.com
              </p>
            </address>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 text-orange-500">QUICK LINKS</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-orange-400">About Us</Link></li>
              <li><Link href="#" className="hover:text-orange-400">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-orange-400">Terms & Conditions</Link></li>
              <li><Link href="#" className="hover:text-orange-400">Add Your Restaurant</Link></li>
              <li><Link href="#" className="hover:text-orange-400">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 text-orange-500">CUISINES</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-orange-400">American</Link></li>
              <li><Link href="#" className="hover:text-orange-400">Indian</Link></li>
              <li><Link href="#" className="hover:text-orange-400">Asian</Link></li>
              <li><Link href="#" className="hover:text-orange-400">Lebanese</Link></li>
              <li><Link href="#" className="hover:text-orange-400">Turkish</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 text-orange-500">FOLLOW US</h3>
            <div className="flex space-x-4">
              <Link href="#" className="bg-gray-800 hover:bg-gray-700 h-10 w-10 rounded-full flex items-center justify-center">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="#" className="bg-gray-800 hover:bg-gray-700 h-10 w-10 rounded-full flex items-center justify-center">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="bg-gray-800 hover:bg-gray-700 h-10 w-10 rounded-full flex items-center justify-center">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto mt-8 pt-8 border-t border-gray-800 px-4">
          <p className="text-center">© 2024 Halal Finder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
