import { NextRequest, NextResponse } from 'next/server';
import { Client, LatLng } from '@googlemaps/google-maps-services-js';
import { Restaurant } from '@/data/menuData';
import { classifyHalalStatus } from '@/utils/halal/classifier';

const google = new Client({});

// Define halal-friendly cuisines
const HALAL_FRIENDLY_CUISINES = [
  'middle eastern',
  'lebanese',
  'turkish',
  'egyptian',
  'moroccan',
  'afghan',
  'pakistani',
  'syrian',
  'malaysian',
  'indonesian',
  'persian',
  'arab',
  'arabic'
];

// Cache to store fetched restaurant data
const restaurantCache = new Map<string, { data: Restaurant[], timestamp: number }>();
const CACHE_TTL = 3600000; // 1 hour cache TTL

/**
 * GET handler for the restaurants API
 */
export async function GET(request: NextRequest) {
  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const radius = searchParams.get('radius') || '5000'; // Default 5km
  const keyword = searchParams.get('keyword') || 'halal restaurant';
  const pagetoken = searchParams.get('pagetoken');
  
  if (!lat || !lng) {
    return NextResponse.json({ error: 'Missing latitude or longitude' }, { status: 400 });
  }
  
  try {
    // Build unique cache key based on request parameters
    const cacheKey = `${lat}-${lng}-${radius}-${keyword}-${pagetoken || ''}`;
    
    // Check if we have a fresh cached response
    const cachedData = restaurantCache.get(cacheKey);
    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_TTL)) {
      const restaurants = cachedData.data;
      return NextResponse.json({ restaurants, fromCache: true });
    }
    
    // Make request to Google Places API
    const response = await google.placesNearby({
      params: {
        key: process.env.GOOGLE_MAPS_API_KEY || '',
        location: { lat: parseFloat(lat), lng: parseFloat(lng) } as LatLng,
        radius: parseInt(radius),
        keyword,
        type: 'restaurant',
        pagetoken: pagetoken || undefined
      }
    });
    
    // Transform the response to our Restaurant format
    const restaurants: Restaurant[] = await Promise.all(
      response.data.results.map(async (place) => {
        const placeDetails = await getPlaceDetails(place.place_id || '');
        
        // Combine cuisine information
        let cuisineType = (place.types || [])
          .filter(type => !['restaurant', 'food', 'establishment', 'point_of_interest'].includes(type))
          .join(', ');
          
        // Improve cuisine categorization
        if (!cuisineType) {
          // Try to extract cuisine from name or formatted address
          const nameAndAddress = `${place.name || ''} ${place.vicinity || ''}`.toLowerCase();
          for (const cuisine of HALAL_FRIENDLY_CUISINES) {
            if (nameAndAddress.includes(cuisine)) {
              cuisineType = cuisine;
              break;
            }
          }
          
          // If still empty, set as "restaurant"
          if (!cuisineType) {
            cuisineType = "restaurant";
          }
        }

        // Extract description from reviews if any
        let description = placeDetails.editorial_summary?.overview || '';
        
        // If no editorial summary, build a description from reviews
        if (!description && placeDetails.reviews && placeDetails.reviews.length > 0) {
          const reviewTexts = placeDetails.reviews
            .slice(0, 3)
            .map(review => review.text.substring(0, 100) + '...')
            .join(' ');
          description = `User reviews: ${reviewTexts}`;
        }
        
        // Format reviews
        const reviews = placeDetails.reviews?.map(review => ({
          author: review.author_name,
          rating: review.rating,
          text: review.text,
          time: new Date(review.time * 1000).toISOString()
        })) || [];
        
        // Get coordinates safely
        const placeLat: number = place.geometry?.location.lat || 0;
        const placeLng: number = place.geometry?.location.lng || 0;
        
        // Get user coordinates from request params
        const userLat: number = parseFloat(lat || '0');
        const userLng: number = parseFloat(lng || '0');
        
        // Calculate distance
        const distance = calculateDistance(
          userLat, 
          userLng, 
          placeLat,
          placeLng
        );
        
        // Create restaurant object
        const restaurant: Restaurant = {
          id: place.place_id || '',
          name: place.name || '',
          description,
          cuisineType: cuisineType.charAt(0).toUpperCase() + cuisineType.slice(1),
          priceRange: place.price_level ? '$'.repeat(place.price_level) : '$$',
          rating: place.rating || 0,
          address: place.vicinity || '',
          phone: placeDetails.formatted_phone_number || '',
          coordinates: {
            lat: placeLat,
            lng: placeLng
          },
          image: place.photos?.[0] ? 
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}` : 
            undefined,
          website: placeDetails.website,
          reviews,
          reviewCount: place.user_ratings_total || 0,
          distance,
          formattedDistance: formatDistance(distance)
        };
        
        // Classify halal status
        const halalClassification = classifyHalalStatus(restaurant);
        restaurant.halalStatus = halalClassification.status;
        restaurant.halalConfidence = halalClassification.confidence;
        restaurant.isHalalVerified = halalClassification.verified;
        restaurant.isChainRestaurant = halalClassification.isChain;
        
        return restaurant;
      })
    );
    
    // Store in cache with timestamp
    restaurantCache.set(cacheKey, { data: restaurants, timestamp: Date.now() });
    
    return NextResponse.json({ restaurants, nextPageToken: response.data.next_page_token });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json({ error: 'Failed to fetch restaurants' }, { status: 500 });
  }
}

/**
 * Fetches detailed place information from Google Places API
 */
async function getPlaceDetails(placeId: string) {
  try {
    const response = await google.placeDetails({
      params: {
        key: process.env.GOOGLE_MAPS_API_KEY || '',
        place_id: placeId,
        fields: [
          'name', 'formatted_address', 'formatted_phone_number', 'website', 
          'opening_hours', 'editorial_summary', 'review', 'price_level'
        ]
      }
    });
    
    return response.data.result;
  } catch (error) {
    console.error('Error fetching place details:', error);
    return {};
  }
}

/**
 * Calculate distance between two sets of coordinates using Haversine formula
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Format distance for display
 */
function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
} 