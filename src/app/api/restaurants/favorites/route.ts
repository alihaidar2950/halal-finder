import { NextRequest, NextResponse } from 'next/server';
import { Restaurant } from '@/data/menuData';
import { fetchRestaurantDetails } from '@/services/restaurantService';

/**
 * GET handler for favorites API
 */
export async function GET(request: NextRequest) {
  // Get query parameters
  const { searchParams } = request.nextUrl;
  const ids = searchParams.get('ids');
  
  if (!ids) {
    return NextResponse.json({ error: 'Missing restaurant ids' }, { status: 400 });
  }
  
  try {
    // Split the comma-separated IDs
    const restaurantIds = ids.split(',');
    
    // Fetch details for each restaurant ID
    const restaurantPromises = restaurantIds.map(async (id) => {
      try {
        return await fetchRestaurantDetails(id);
      } catch (error) {
        console.error(`Error fetching restaurant ${id}:`, error);
        return null;
      }
    });
    
    // Wait for all promises to resolve
    const restaurantsWithNulls = await Promise.all(restaurantPromises);
    
    // Filter out any null results
    const restaurants = restaurantsWithNulls.filter(
      (restaurant): restaurant is Restaurant => restaurant !== null
    );
    
    return NextResponse.json({ restaurants });
  } catch (error) {
    console.error('Error fetching favorite restaurants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorite restaurants' },
      { status: 500 }
    );
  }
} 