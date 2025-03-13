import { NextResponse } from 'next/server';
import { Client } from '@googlemaps/google-maps-services-js';
import { classifyHalalStatus } from '@/utils/halal/classifier';

// Initialize Google Maps client
const client = new Client({});

type Params = { params: { id: string } };

export async function GET(
  request: Request,
  { params }: Params
) {
  // Convert params to a plain value to avoid the async params issue
  const placeId = String(params.id);

  if (!placeId) {
    return NextResponse.json(
      { error: 'Restaurant ID is required' },
      { status: 400 }
    );
  }

  try {
    // Fetch place details from Google Places API
    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        key: process.env.GOOGLE_MAPS_API_KEY || '',
        fields: [
          'name',
          'formatted_address',
          'formatted_phone_number',
          'rating',
          'user_ratings_total',
          'price_level',
          'website',
          'opening_hours',
          'photos',
          'types',
          'geometry',
          'vicinity',
          'reviews',
        ],
      },
    });

    // Get place details from API response
    const place = response.data.result;

    // Format the restaurant data to match our application model
    const restaurant = {
      id: place.place_id || placeId,
      name: place.name || 'Unknown Restaurant',
      description: place.types?.join(', ') || '',
      address: place.formatted_address || place.vicinity || '',
      phone: place.formatted_phone_number || '',
      cuisineType: inferCuisineType(place.types || []),
      priceRange: place.price_level ? '$'.repeat(place.price_level) : '$$',
      rating: place.rating || 0,
      coordinates: {
        lat: place.geometry?.location.lat || 0,
        lng: place.geometry?.location.lng || 0,
      },
      // Get the first photo if available
      image: place.photos?.[0]
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${place.photos[0].photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`
        : undefined,
      // Additional information specific to the detail view
      website: place.website || '',
      reviewCount: place.user_ratings_total || 0,
      hours: parseOpeningHours(place.opening_hours),
      reviews: place.reviews?.map((review: { 
        author_name: string; 
        rating: number; 
        text: string; 
        relative_time_description: string 
      }) => ({
        author: review.author_name,
        rating: review.rating,
        text: review.text,
        time: review.relative_time_description,
      })) || [],
      photos: place.photos?.slice(0, 5).map((photo: { photo_reference: string }) => 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`
      ) || [],
    };

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
    return NextResponse.json(
      { error: 'Failed to fetch restaurant details' },
      { status: 500 }
    );
  }
}

// Helper function to parse opening hours
function parseOpeningHours(openingHours?: { weekday_text?: string[] }) {
  if (!openingHours || !openingHours.weekday_text) {
    return [];
  }
  
  return openingHours.weekday_text.map((day: string) => {
    const [dayName, hours] = day.split(': ');
    return { day: dayName, hours };
  });
}

// Helper function to infer cuisine type from place types
function inferCuisineType(types: string[]): string {
  // Map Google place types to our cuisine categories
  const typeMap: Record<string, string> = {
    'restaurant': 'restaurant',
    'food': 'restaurant',
    'meal_takeaway': 'restaurant',
    'meal_delivery': 'restaurant',
    'bakery': 'bakery',
    'cafe': 'cafe',
    'bar': 'bar',
    'indian_restaurant': 'indian',
    'chinese_restaurant': 'asian',
    'japanese_restaurant': 'asian',
    'thai_restaurant': 'asian',
    'vietnamese_restaurant': 'asian',
    'korean_restaurant': 'asian',
    'italian_restaurant': 'italian',
    'mexican_restaurant': 'mexican',
    'middle_eastern_restaurant': 'middle_eastern',
    'lebanese_restaurant': 'lebanese',
    'turkish_restaurant': 'turkish',
    'mediterranean_restaurant': 'mediterranean',
    'american_restaurant': 'american',
  };

  // Try to find a matching cuisine type
  for (const type of types) {
    if (typeMap[type]) {
      return typeMap[type];
    }
  }

  // If we can't find a match, default to 'restaurant'
  return 'halal';
} 