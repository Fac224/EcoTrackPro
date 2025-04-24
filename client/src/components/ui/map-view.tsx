import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

// Google Maps integration
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

// Load Google Maps script
const loadGoogleMapsScript = (callback: () => void) => {
  const existingScript = document.getElementById('googleMapsScript');
  if (!existingScript) {
    const script = document.createElement('script');
    // Use the API key directly from the environment variable
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAanMM_SHlW67y28F-0wAeGWDJ40ocn16A&libraries=places`;
    script.id = 'googleMapsScript';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (callback) callback();
    };
  } else if (callback) {
    callback();
  }
};

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
  const [isLoading, setIsLoading] = useState(true);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const googleMarkers = useRef<google.maps.Marker[]>([]);

  // Load Google Maps script
  useEffect(() => {
    loadGoogleMapsScript(() => {
      setIsScriptLoaded(true);
    });
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isScriptLoaded || !mapRef.current) return;
    
    setIsLoading(true);
    
    try {
      // Create map
      const googleMap = new google.maps.Map(mapRef.current, {
        center: { lat: latitude, lng: longitude },
        zoom: zoom,
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true
      });
      
      googleMapRef.current = googleMap;

      // Add main marker if specified
      if (showMarker) {
        const marker = new google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: googleMap,
          animation: google.maps.Animation.DROP,
        });
      }

      // Add markers
      markers.forEach(marker => {
        const googleMarker = new google.maps.Marker({
          position: { lat: marker.lat, lng: marker.lng },
          map: googleMap,
          title: marker.title,
          animation: google.maps.Animation.DROP,
        });

        if (marker.onClick) {
          googleMarker.addListener('click', marker.onClick);
        }

        googleMarkers.current.push(googleMarker);
      });

      // Add click listener
      if (onMapClick) {
        googleMap.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            onMapClick(e.latLng.lat(), e.latLng.lng());
          }
        });
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing Google Maps:', error);
      setIsLoading(false);
    }

    return () => {
      // Cleanup markers
      googleMarkers.current.forEach(marker => marker.setMap(null));
      googleMarkers.current = [];
    };
  }, [latitude, longitude, zoom, showMarker, onMapClick, markers, isScriptLoaded]);

  return (
    <div 
      className={`rounded-lg overflow-hidden relative ${className}`}
      style={{ height, width }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70 z-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
      <div 
        ref={mapRef}
        className="h-full w-full"
      />
    </div>
  );
}

export default MapView;
