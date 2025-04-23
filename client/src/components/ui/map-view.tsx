import { useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// This is a simple map component that would be integrated with a real mapping service like Mapbox or Google Maps
interface MapViewProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  height?: string | number;
  width?: string | number;
  className?: string;
  showMarker?: boolean;
  onMapClick?: (lat: number, lng: number) => void;
  markers?: Array<{
    lat: number;
    lng: number;
    title?: string;
    onClick?: () => void;
  }>;
}

export function MapView({
  latitude,
  longitude,
  zoom = 14,
  height = "300px",
  width = "100%",
  className = "",
  showMarker = true,
  onMapClick,
  markers = []
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate map loading
    // In a real implementation, this would initialize a map from a service like Mapbox or Google Maps
    const mapContainer = mapRef.current;
    if (!mapContainer) return;

    // If we had a real map API, we would initialize it here
    const initMap = () => {
      // This is where we would add the map and markers
      // For now, we'll just add some placeholder content
      mapContainer.innerHTML = `
        <div class="flex items-center justify-center h-full w-full bg-gray-100 rounded-lg relative">
          <div class="absolute inset-0 overflow-hidden">
            ${showMarker || markers.length > 0 ? 
              `<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>` : ''
            }
          </div>
          <div class="z-10 bg-white p-2 rounded shadow text-sm">
            Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}
          </div>
        </div>
      `;

      // Add event listener for map clicks
      if (onMapClick) {
        mapContainer.addEventListener('click', (e) => {
          // Simulate clicking on the map to get coordinates
          // In a real implementation, we would get the actual coordinates from the map API
          const rect = mapContainer.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          // Simulate latitude and longitude based on click position
          const simulatedLat = latitude + (((rect.height / 2) - y) / rect.height) * 0.01;
          const simulatedLng = longitude + ((x - (rect.width / 2)) / rect.width) * 0.01;
          
          onMapClick(simulatedLat, simulatedLng);
        });
      }
    };

    // Initialize the map with a small delay to simulate loading
    const timer = setTimeout(initMap, 300);
    
    return () => {
      clearTimeout(timer);
    };
  }, [latitude, longitude, zoom, showMarker, onMapClick, markers]);

  return (
    <div 
      ref={mapRef}
      className={`rounded-lg overflow-hidden ${className}`}
      style={{ height, width }}
    >
      <Skeleton className="h-full w-full" />
    </div>
  );
}

export default MapView;
