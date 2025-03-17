import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@googlemaps/google-maps-services-js';
import { classifyHalalStatus } from '@/utils/halal/classifier';
import { saveToCache, getFromCache, generateRestaurantDetailsCacheKey, CACHE_EXPIRY } from '@/utils/cacheUtils';

// Initialize Google Maps client
const client = new Client({});

// Cache settings
const PLACE_DETAILS_CACHE_TTL = CACHE_EXPIRY.RESTAURANT_DETAILS; // 72 hours

// Daily API call limit tracking
const API_CALLS = {
  count: 0,
  resetDate: new Date().setHours(0, 0, 0, 0),
  limit: 500 // Self-imposed daily limit
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const placeId = params.id;
  
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
    
    // Make API request
    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        fields: [
          'name',
          'place_id',
          'formatted_address',
          'formatted_phone_number',
          'geometry',
          'opening_hours',
          'photos',
          'price_level',
          'rating',
          'reviews',
          'types',
          'url',
          'user_ratings_total',
          'website',
          'vicinity'
        ],
        key: process.env.GOOGLE_MAPS_API_KEY || '',
      },
    });

    if (response.data.status !== 'OK') {
      console.error('Google API error:', response.data.status);
      return NextResponse.json({ error: 'Failed to fetch restaurant details' }, { status: 500 });
    }

    const place = response.data.result;
    
    // Process and format the response
    const restaurant = {
      id: place.place_id || '',
      placeId: place.place_id || '',
      name: place.name || '',
      cuisineType: place.types?.filter(type => 
        !['restaurant', 'food', 'point_of_interest', 'establishment'].includes(type)
      ).join(', ') || 'Restaurant',
      rating: place.rating || 0,
      address: place.formatted_address || place.vicinity || '',
      phone: place.formatted_phone_number || '',
      coordinates: {
        lat: place.geometry?.location.lat || 0,
        lng: place.geometry?.location.lng || 0
      },
      openingHours: place.opening_hours?.weekday_text || [],
      priceLevel: place.price_level || 0,
      website: place.website || place.url || '',
      photos: place.photos?.map(photo => 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`
      ) || [],
      // Add the first photo as the main image
      image: place.photos && place.photos.length > 0 
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photoreference=${place.photos[0].photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`
        : '',
      reviews: place.reviews?.map(review => ({
        author: review.author_name,
        rating: review.rating,
        text: review.text,
        time: review.time,
        profilePhotoUrl: review.profile_photo_url
      })) || [],
      reviewCount: place.user_ratings_total || 0,
      description: '',
      priceRange: priceRangeToDollarSigns(place.price_level || 0),
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

// Helper function to parse opening hours

// Helper function to infer cuisine type from place types

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