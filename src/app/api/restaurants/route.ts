import { NextResponse } from 'next/server';
import { Client, PlaceType1 } from '@googlemaps/google-maps-services-js';
import { classifyHalalStatus } from '@/utils/halal/classifier';

// Initialize Google Maps client
const client = new Client({});

export async function GET(request: Request) {
  // Get URL query parameters
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const radius = searchParams.get('radius') || '5000'; // Default 5km
  const keyword = searchParams.get('keyword') || 'halal restaurant'; // Default search term

  // Check for required parameters
  if (!lat || !lng) {
    return NextResponse.json(
      { error: 'Latitude and longitude are required parameters' },
      { status: 400 }
    );
  }

  try {
    // Search for nearby halal restaurants using Places API
    const response = await client.placesNearby({
      params: {
        location: { lat: parseFloat(lat), lng: parseFloat(lng) },
        radius: parseInt(radius),
        type: PlaceType1.restaurant,
        keyword,
        key: process.env.GOOGLE_MAPS_API_KEY || '',
        opennow: true // Optional: Only show places that are currently open
      },
    });

    // Map Google Places data to our application's format
    const restaurants = response.data.results.map(place => {
      // Basic restaurant data
      const restaurant = {
        id: place.place_id || `temp-${Math.random().toString(36).substring(2, 9)}`,
        name: place.name || 'Unnamed Restaurant',
        address: place.vicinity || 'Unknown Location',
        cuisineType: 'halal', // Default, as we're searching for halal restaurants
        rating: place.rating || 0,
        priceRange: place.price_level ? '$'.repeat(place.price_level) : '$$',
        coordinates: {
          lat: place.geometry?.location.lat || 0,
          lng: place.geometry?.location.lng || 0,
        },
        // Use the first photo if available
        image: place.photos?.[0]
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`
          : undefined,
        // We'll need to fetch these details separately
        phone: '',
        description: place.types?.join(', ') || '',
        distance: 0, // Will be calculated client-side
      };
      
      // Classify halal status based on available data
      const { status, confidence } = classifyHalalStatus(restaurant);
      
      // Add classification to restaurant data
      return {
        ...restaurant,
        halalStatus: status,
        halalConfidence: confidence
      };
    });

    return NextResponse.json({ restaurants });
  } catch (error) {
    console.error('Error fetching nearby restaurants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch nearby restaurants' },
      { status: 500 }
    );
  }
} 