import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { classifyHalalStatus } from '@/utils/halal/classifier';
import { saveToCache, getFromCache, generateRestaurantDetailsCacheKey, CACHE_EXPIRY } from '@/utils/cacheUtils';

// Cache settings
const PLACE_DETAILS_CACHE_TTL = CACHE_EXPIRY.RESTAURANT_DETAILS; // 72 hours

// Define essential field masks for reduced costs (Places API v1)
// Documentation: https://developers.google.com/maps/documentation/places/web-service/field-masks
const PLACE_DETAILS_FIELD_MASK = [
  'name',
  'id',
  'formattedAddress',
  'internationalPhoneNumber',
  'location',
  'rating',
  'userRatingCount',
  'photos.name',
  'priceLevel',
  'types',
  'websiteUri'
].join(',');

// Daily API call limit tracking
const API_CALLS = {
  count: 0,
  resetDate: new Date().setHours(0, 0, 0, 0),
  limit: 500 // Self-imposed daily limit
};

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const placeId = context.params.id;
  
  if (!placeId) {
    return NextResponse.json({ error: 'Missing place ID' }, { status: 400 });
  }

  try {
    // Reset API call counter if it's a new day
    const today = new Date().setHours(0, 0, 0, 0);
    if (today > API_CALLS.resetDate) {
      API_CALLS.count = 0;
      API_CALLS.resetDate = today;
    }
    
    // Check if we've reached our self-imposed API call limit
    if (API_CALLS.count >= API_CALLS.limit) {
      return NextResponse.json({ 
        error: 'Daily API limit reached',
        message: 'Please try again tomorrow or use cached data if available'
      }, { status: 429 });
    }
    
    // Generate cache key for this restaurant
    const cacheKey = generateRestaurantDetailsCacheKey(placeId);
    
    // Check for cached data first (unless refresh is explicitly requested)
    const shouldRefresh = request.nextUrl.searchParams.get('refresh') === 'true';
    if (!shouldRefresh) {
      const cachedDetails = getFromCache(cacheKey);
      if (cachedDetails) {
        return NextResponse.json({ 
          restaurant: cachedDetails, 
          fromCache: true 
        });
      }
    }
    
    // Increment API call counter
    API_CALLS.count++;
    
    // Google Places API v1 endpoint
    const apiUrl = `https://places.googleapis.com/v1/places/${placeId}`;
    
    // Make API request
    const response = await axios.get(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY || '',
        'X-Goog-FieldMask': PLACE_DETAILS_FIELD_MASK
      }
    });

    // Process and format the response
    const place = response.data;
    
    // Extract cuisine type from place types
    const cuisineType = (place.types || [])
      .filter((type: string) => 
        !['restaurant', 'food', 'point_of_interest', 'establishment'].includes(type)
      ).join(', ') || 'Restaurant';
    
    // Process and format the response for our application
    const restaurant = {
      id: place.id || '',
      placeId: place.id || '',
      name: place.displayName?.text || '',
      cuisineType: cuisineType.charAt(0).toUpperCase() + cuisineType.slice(1),
      rating: place.rating || 0,
      address: place.formattedAddress || '',
      phone: place.internationalPhoneNumber || '',
      coordinates: {
        lat: place.location?.latitude || 0,
        lng: place.location?.longitude || 0
      },
      priceLevel: place.priceLevel || 0,
      website: place.websiteUri || '',
      // Use smaller image sizes to reduce bandwidth and cost
      photos: place.photos?.map((photo: { name: string }) => 
        `https://places.googleapis.com/v1/${photo.name}/media?key=${process.env.GOOGLE_MAPS_API_KEY}&maxHeightPx=600&maxWidthPx=600`
      ) || [],
      // Add the first photo as the main image
      image: place.photos && place.photos.length > 0 
        ? `https://places.googleapis.com/v1/${place.photos[0].name}/media?key=${process.env.GOOGLE_MAPS_API_KEY}&maxHeightPx=800&maxWidthPx=800`
        : '',
      reviewCount: place.userRatingCount || 0,
      description: '',
      priceRange: priceRangeToDollarSigns(place.priceLevel || 0),
    };
    
    // Store in cache with location data for better proximity searches
    if (restaurant.coordinates) {
      saveToCache(
        cacheKey, 
        restaurant, 
        PLACE_DETAILS_CACHE_TTL,
        {
          lat: restaurant.coordinates.lat,
          lng: restaurant.coordinates.lng,
          radius: 100 // Small radius since this is a specific place
        }
      );
    }

    // Classify halal status
    const { status, confidence } = classifyHalalStatus(restaurant);
    
    // Add classification to restaurant data
    const classifiedRestaurant = {
      ...restaurant,
      halalStatus: status,
      halalConfidence: confidence
    };

    return NextResponse.json({ restaurant: classifiedRestaurant });
  } catch (error) {
    console.error('Error fetching restaurant details:', error);
    return NextResponse.json({ error: 'Failed to fetch restaurant details' }, { status: 500 });
  }
}

// Helper function to convert price level to dollar signs
function priceRangeToDollarSigns(priceLevel: number): string {
  switch (priceLevel) {
    case 0:
      return '$';
    case 1:
      return '$';
    case 2:
      return '$$';
    case 3:
      return '$$$';
    case 4:
      return '$$$$';
    default:
      return '$';
  }
} 