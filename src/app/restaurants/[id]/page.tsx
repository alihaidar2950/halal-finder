"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MapPinIcon, PhoneIcon, StarIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import PlaceholderImage from '@/components/PlaceholderImage';
import { fetchRestaurantDetails } from '@/services/restaurantService';
import { Restaurant } from '@/data/menuData';
import dynamic from 'next/dynamic';
import { HalalStatusInfo } from '@/components/halal/HalalStatusInfo';
import { Database, RefreshCw } from 'lucide-react';
import { clearCache } from '@/utils/cacheUtils';
import FavoriteButton from '@/components/FavoriteButton';

// Import the map component dynamically to prevent SSR issues
const GoogleMapComponent = dynamic(
  () => import('@/components/maps/GoogleMapComponent'),
  { ssr: false }
);

// Define what we expect our restaurant object to have
interface ExtendedRestaurant extends Restaurant {
  menu?: Array<{
    name: string;
    description: string;
    price: number;
    image?: string;
  }>;
  hours?: Array<{
    day: string;
    hours: string;
  }>;
  photos?: string[];
  website?: string;
}

export default function RestaurantDetailPage() {
  // Use the useParams hook instead of receiving params as a prop
  const params = useParams();
  const restaurantId = params.id as string;
  
  const [restaurant, setRestaurant] = useState<ExtendedRestaurant | null>(null);
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
      setRestaurant(data as ExtendedRestaurant);
      
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
  }, [restaurantId]);

  const handleRefresh = () => {
    fetchData(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-white">
        <div className="animate-spin h-12 w-12 border-4 border-[#ffc107] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading restaurant details...</p>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-white">
        <h1 className="text-3xl font-bold mb-4">Restaurant Not Found</h1>
        <p className="mb-8 text-gray-400">{error || "The restaurant you're looking for doesn't exist or has been removed."}</p>
        <Link href="/" className="bg-[#ffc107] hover:bg-[#e6b006] text-black px-6 py-2 rounded-none">
          Return to Home
        </Link>
      </div>
    );
  }

  const { name, description, priceRange, image, rating, cuisineType, address, phone, coordinates } = restaurant;
  const hours = restaurant.hours || [];
  const additionalPhotos = restaurant.photos || [];
  const website = restaurant.website || '';

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="text-[#ffc107] hover:text-[#e6b006] flex items-center gap-2">
            <span>←</span> Back to Home
          </Link>
        </div>
        
        {fromCache && (
          <div className="mb-6 bg-[#1c1c1c] border border-gray-800 rounded-none p-3 flex justify-between items-center">
            <div className="flex items-center">
              <Database className="h-5 w-5 text-[#ffc107] mr-2" />
              <p className="text-gray-300 text-sm">Details loaded from cache</p>
            </div>
            <button 
              onClick={handleRefresh}
              className="flex items-center text-xs bg-[#2c2c2c] hover:bg-[#3c3c3c] text-gray-200 px-2 py-1 rounded"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </button>
          </div>
        )}

        {/* Hero Section */}
        <div className="relative h-96 mb-10 overflow-hidden border border-gray-800">
          {image ? (
            <img 
              src={image} 
              alt={name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <PlaceholderImage 
              name={name} 
              className="w-full h-full"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex flex-wrap justify-between items-end">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="bg-[#ffc107] text-black px-3 py-1 uppercase text-xs font-bold">
                    {cuisineType}
                  </span>
                  <span className="bg-[#121212] text-white px-3 py-1 uppercase text-xs font-bold">
                    {priceRange}
                  </span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">{name}</h1>
                <div className="flex items-center space-x-1 text-[#ffc107]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon 
                      key={i} 
                      className={`h-5 w-5 ${i < Math.floor(rating) ? 'text-[#ffc107] fill-[#ffc107]' : 'text-gray-600'}`} 
                    />
                  ))}
                  <span className="ml-2 text-white">{rating}</span>
                </div>
              </div>
              
              {/* Add Favorite Button */}
              <div className="mt-4 md:mt-0">
                <FavoriteButton 
                  restaurantId={restaurantId}
                  size="lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* About Section */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4">
                <span className="text-[#ffc107]">ABOUT</span> THE RESTAURANT
              </h2>
              <div className="h-[1px] w-16 bg-gray-800 mb-6"></div>
              <p className="text-gray-400">
                {description || "No description available for this restaurant."}
              </p>
            </div>

            {/* Halal Status Section */}
            <div className="mb-10 bg-[#121212] border border-gray-800 p-6">
              <h2 className="text-xl font-bold mb-6">
                <span className="text-[#ffc107]">HALAL</span> STATUS
              </h2>
              {restaurant.halalStatus ? (
                <HalalStatusInfo 
                  status={restaurant.halalStatus} 
                  confidence={restaurant.halalConfidence || 0} 
                  isChain={restaurant.isChainRestaurant || false}
                  verified={restaurant.isHalalVerified || false}
                />
              ) : (
                <p className="text-gray-400">No halal status information available for this restaurant.</p>
              )}
            </div>

            {/* Menu Section (if available) */}
            {restaurant.menu && restaurant.menu.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-4">
                  <span className="text-[#ffc107]">POPULAR</span> DISHES
                </h2>
                <div className="h-[1px] w-16 bg-gray-800 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {restaurant.menu.map((item, index) => (
                    <div key={index} className="bg-[#121212] border border-gray-800 p-5 flex">
                      {item.image && (
                        <div className="w-20 h-20 mr-4">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <h3 className="font-bold text-white">{item.name}</h3>
                          <span className="text-[#ffc107] font-bold">${item.price}</span>
                        </div>
                        <p className="text-sm text-gray-400">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Photos Gallery (if available) */}
            {additionalPhotos.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-4">
                  <span className="text-[#ffc107]">PHOTO</span> GALLERY
                </h2>
                <div className="h-[1px] w-16 bg-gray-800 mb-6"></div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {additionalPhotos.map((photo, index) => (
                    <div key={index} className="aspect-square overflow-hidden border border-gray-800">
                      <img 
                        src={photo} 
                        alt={`${name} - photo ${index+1}`} 
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Contact & Info Card */}
            <div className="bg-[#121212] border border-gray-800 p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">
                <span className="text-[#ffc107]">CONTACT</span> INFORMATION
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPinIcon className="h-5 w-5 text-[#ffc107] mt-0.5" />
                  <span className="text-gray-300">{address}</span>
                </div>
                
                {phone && (
                  <div className="flex items-center space-x-3">
                    <PhoneIcon className="h-5 w-5 text-[#ffc107]" />
                    <a href={`tel:${phone}`} className="text-gray-300 hover:text-[#ffc107]">
                      {phone}
                    </a>
                  </div>
                )}
                
                {website && (
                  <div className="flex items-center space-x-3">
                    <GlobeAltIcon className="h-5 w-5 text-[#ffc107]" />
                    <a 
                      href={website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-[#ffc107] truncate"
                    >
                      {website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Map */}
            {coordinates && (
              <div className="bg-[#121212] border border-gray-800 p-6 mb-6">
                <h3 className="text-lg font-bold mb-4">
                  <span className="text-[#ffc107]">LOCATION</span>
                </h3>
                <div className="h-64 border border-gray-800">
                  <GoogleMapComponent 
                    restaurants={[restaurant]} 
                    center={coordinates}
                    zoom={15}
                  />
                </div>
                <div className="mt-4">
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center bg-[#232323] hover:bg-[#343434] text-white border border-[#ffc107] px-4 py-2 transition-colors"
                  >
                    GET DIRECTIONS
                  </a>
                </div>
              </div>
            )}

            {/* Opening Hours */}
            {hours.length > 0 && (
              <div className="bg-[#121212] border border-gray-800 p-6">
                <h3 className="text-lg font-bold mb-4">
                  <span className="text-[#ffc107]">OPENING</span> HOURS
                </h3>
                <ul className="space-y-2">
                  {hours.map((hour, index) => (
                    <li key={index} className="flex justify-between">
                      <span className="text-gray-400">{hour.day}</span>
                      <span className="text-white font-medium">{hour.hours}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 