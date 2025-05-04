import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface Marker {
  lat: number;
  lng: number;
  title: string;
  onClick?: () => void;
}

interface MapViewProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  markers?: Marker[];
  height?: string;
  width?: string;
}

export function MapView({
  latitude,
  longitude,
  zoom = 14,
  markers = [],
  height = "400px",
  width = "100%",
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [googleMarkers, setGoogleMarkers] = useState<any[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    if (window.google?.maps) {
      setIsScriptLoaded(true);
      return;
    }

    // Get API key from environment variable
    // Using hard-coded key as fallback to ensure it works even if env var isn't loaded properly
    const googleMapsApiKey = 'AIzaSyAanMM_SHlW67y28F-0wAeGWDJ40ocn16A';
    
    // Setup callback for when Google Maps script loads
    window.initMap = () => {
      setIsScriptLoaded(true);
    };

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;
    script.onerror = (err) => {
      console.error("Google Maps script failed to load", err);
    };
    
    document.head.appendChild(script);

    return () => {
      // Cleanup if component unmounts
      window.initMap = () => {};
      // Only try to remove if it's still in the document
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Initialize Google Map when script is loaded
  useEffect(() => {
    if (!isScriptLoaded || !mapRef.current) return;
    
    const mapOptions = {
      center: { lat: latitude, lng: longitude },
      zoom: zoom,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
    };

    const googleMap = new window.google.maps.Map(mapRef.current, mapOptions);
    setMap(googleMap);
    setIsMapLoaded(true);
  }, [isScriptLoaded, mapRef, latitude, longitude, zoom]);

  // Add markers when the map is loaded or markers change
  useEffect(() => {
    if (!map || !isMapLoaded) return;
    
    // Clear previous markers
    googleMarkers.forEach(marker => marker.setMap(null));
    
    // Create new markers
    const newMarkers = markers.map(marker => {
      const googleMarker = new window.google.maps.Marker({
        position: { lat: marker.lat, lng: marker.lng },
        map: map,
        title: marker.title,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: '#f03e3e',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: 8,
        }
      });
      
      if (marker.onClick) {
        googleMarker.addListener('click', marker.onClick);
      }
      
      // Add info window for each marker
      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div class="p-2 text-sm"><strong>${marker.title}</strong></div>`
      });
      
      googleMarker.addListener('mouseover', () => {
        infoWindow.open(map, googleMarker);
      });
      
      googleMarker.addListener('mouseout', () => {
        infoWindow.close();
      });
      
      return googleMarker;
    });
    
    setGoogleMarkers(newMarkers);
  }, [map, isMapLoaded, markers]);

  return (
    <div
      ref={mapRef}
      style={{
        height,
        width,
        backgroundColor: "#e5e7eb",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {!isScriptLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="ml-3 text-gray-600">Loading map...</span>
        </div>
      )}
    </div>
  );
}

export default MapView;