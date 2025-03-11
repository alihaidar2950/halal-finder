"use client";

import { useState, useCallback, useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { Restaurant } from "@/data/menuData";
import { useRouter } from "next/navigation";

// You would replace this with your actual API key
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const containerStyle = {
  width: "100%",
  height: "500px",
};

// Ottawa center coordinates as default
const defaultCenter = {
  lat: 45.4215,
  lng: -75.6972,
};

interface GoogleMapComponentProps {
  restaurants: Restaurant[];
  center?: { lat: number; lng: number };
  zoom?: number;
}

export default function GoogleMapComponent({
  restaurants,
  center = defaultCenter,
  zoom = 13,
}: GoogleMapComponentProps) {
  const router = useRouter();
  const [selectedPlace, setSelectedPlace] = useState<Restaurant | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const handleMarkerClick = (restaurant: Restaurant) => {
    setSelectedPlace(restaurant);
  };

  const navigateToRestaurant = (id: string) => {
    router.push(`/restaurants/${id}`);
  };

  if (loadError) {
    return <div className="p-4 text-red-500">Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div className="p-4">Loading maps...</div>;
  }

  return (
    <div className="rounded-lg overflow-hidden shadow-lg">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      >
        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            position={restaurant.coordinates}
            onClick={() => handleMarkerClick(restaurant)}
            icon={{
              url: "/images/map-marker.svg",
              scaledSize: new window.google.maps.Size(30, 30),
            }}
          />
        ))}

        {selectedPlace && (
          <InfoWindow
            position={selectedPlace.coordinates}
            onCloseClick={() => setSelectedPlace(null)}
          >
            <div className="p-2 max-w-xs">
              <h3 className="font-bold text-gray-800">{selectedPlace.name}</h3>
              <p className="text-xs text-gray-600 mb-1">{selectedPlace.cuisineType}</p>
              <p className="text-sm text-gray-700 mb-2">{selectedPlace.address}</p>
              <button
                onClick={() => navigateToRestaurant(selectedPlace.id)}
                className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-orange-600 transition-colors"
              >
                View Details
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
} 