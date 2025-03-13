"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MapPinIcon, PhoneIcon, StarIcon, ClockIcon, MapIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import PlaceholderImage from '@/components/PlaceholderImage';
import { fetchRestaurantDetails } from '@/services/restaurantService';
import { Restaurant } from '@/data/menuData';
import dynamic from 'next/dynamic';
import { HalalStatusInfo } from '@/components/halal/HalalStatusInfo';
import { Database, RefreshCw } from 'lucide-react';
import { clearCache } from '@/utils/cacheUtils';

// Import the map component dynamically to prevent SSR issues
const GoogleMapComponent = dynamic(
  () => import('@/components/maps/GoogleMapComponent'),
  { ssr: false }
);

export default function RestaurantDetailPage() {
  // Use the useParams hook instead of receiving params as a prop
  const params = useParams();
  const restaurantId = params.id as string;
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  const fetchData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      
      // If forcing refresh, clear this restaurant's cache
      if (forceRefresh) {
        clearCache();
      }
      
      const data = await fetchRestaurantDetails(restaurantId);
      setRestaurant(data);
      
      // Check if the data came from cache
      setFromCache(!!data?.fromCache);
      
      setLoading(false);
    } catch {
      setError('Unable to fetch restaurant details. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [restaurantId, fetchData]);

  const handleRefresh = () => {
    fetchData(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading restaurant details...</p>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Restaurant Not Found</h1>
        <p className="mb-8">{error || "The restaurant you're looking for doesn't exist or has been removed."}</p>
        <Link href="/" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg">
          Return to Home
        </Link>
      </div>
    );
  }

  const { name, description, priceRange, image, rating, cuisineType, address, phone, coordinates } = restaurant;
  const hours = restaurant.hours || [];
  const reviews = restaurant.reviews || [];
  const additionalPhotos = restaurant.photos || [];
  const website = restaurant.website || '';

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="text-orange-500 hover:text-orange-600 flex items-center gap-2">
            <span>←</span> Back to Home
          </Link>
        </div>
        
        {fromCache && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-3 flex justify-between items-center">
            <div className="flex items-center">
              <Database className="h-5 w-5 text-amber-500 mr-2" />
              <p className="text-amber-700 text-sm">Details loaded from cache</p>
            </div>
            <button 
              onClick={handleRefresh}
              className="flex items-center text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 px-2 py-1 rounded"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              {image ? (
                <img 
                  src={image} 
                  alt={name} 
                  className="w-full h-80 object-cover rounded-lg shadow-lg" 
                />
              ) : (
                <div className="w-full h-80">
                  <PlaceholderImage name={name} className="w-full h-full rounded-lg shadow-lg" />
                </div>
              )}
            </div>
            
            <h1 className="text-4xl font-bold mb-2">{name}</h1>
            
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                {cuisineType.charAt(0).toUpperCase() + cuisineType.slice(1)}
              </span>
              <span className="text-gray-600">{priceRange}</span>
              <div className="flex items-center">
                {Array(5).fill(0).map((_, i) => (
                  <StarIcon 
                    key={i} 
                    className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="ml-1 text-gray-600">{rating}/5</span>
                {restaurant.reviewCount && restaurant.reviewCount > 0 && (
                  <span className="ml-1 text-gray-500">({restaurant.reviewCount} reviews)</span>
                )}
              </div>
            </div>
            
            <p className="text-lg text-gray-700 mb-8">{description}</p>
            
            {/* Additional Photos */}
            {additionalPhotos.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {additionalPhotos.map((photoUrl: string, index: number) => (
                    <img 
                      key={index}
                      src={photoUrl}
                      alt={`${name} photo ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg shadow-md"
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Reviews Section */}
            {reviews.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
                <div className="space-y-6">
                  {reviews.map((review: { author: string; rating: number; text: string; time: string }, index: number) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold">{review.author}</div>
                        <div className="flex items-center">
                          {Array(5).fill(0).map((_, i) => (
                            <StarIcon 
                              key={i} 
                              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-1">{review.text}</p>
                      <p className="text-gray-500 text-xs">{review.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <MapIcon className="w-6 h-6 mr-2 text-orange-500" /> Location
              </h2>
              <div className="h-80 rounded-lg overflow-hidden shadow-lg mb-4">
                <GoogleMapComponent 
                  restaurants={[restaurant]} 
                  center={coordinates}
                  zoom={15}
                />
              </div>
              <p className="text-gray-600">{address}</p>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
              <h2 className="text-xl font-bold mb-4">Restaurant Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPinIcon className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-700">Address</h3>
                    <p className="text-gray-600">{address}</p>
                  </div>
                </div>
                
                {phone && (
                  <div className="flex items-start gap-3">
                    <PhoneIcon className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-gray-700">Phone</h3>
                      <p className="text-gray-600">{phone}</p>
                    </div>
                  </div>
                )}
                
                {website && (
                  <div className="flex items-start gap-3">
                    <GlobeAltIcon className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-gray-700">Website</h3>
                      <a 
                        href={website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:underline truncate block"
                      >
                        {website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </div>
                )}
                
                {hours.length > 0 && (
                  <div className="flex items-start gap-3 mt-4">
                    <ClockIcon className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-gray-700">Hours</h3>
                      <ul className="text-gray-600 space-y-1">
                        {hours.map((day, index) => (
                          <li key={index} className="flex justify-between">
                            <span className="font-medium w-36">{day.day}</span>
                            <span>{day.hours}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Halal Status Card */}
            {restaurant.halalStatus && (
              <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
                <HalalStatusInfo 
                  status={restaurant.halalStatus} 
                  confidence={restaurant.halalConfidence || 0} 
                  isChain={restaurant.isChainRestaurant || false}
                  verified={restaurant.isHalalVerified || false}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 