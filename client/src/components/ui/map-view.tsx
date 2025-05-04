import { useEffect, useRef, useState } from "react";

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

// This is a simplified map view component that simulates a map interface
// In a real application, this would be replaced with a proper map library like Google Maps or Mapbox
export function MapView({
  latitude,
  longitude,
  zoom = 10,
  markers = [],
  height = "400px",
  width = "100%",
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setIsMapLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

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
      {!isMapLoaded ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <>
          {/* Simple map background with grid */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to right, #d1d5db 1px, transparent 1px),
                              linear-gradient(to bottom, #d1d5db 1px, transparent 1px)`,
              backgroundSize: `${zoom * 5}px ${zoom * 5}px`,
              backgroundPosition: "center",
            }}
          ></div>

          {/* Display center point */}
          <div
            className="absolute rounded-full bg-primary/10 border-4 border-primary"
            style={{
              height: "40px",
              width: "40px",
              left: "calc(50% - 20px)",
              top: "calc(50% - 20px)",
            }}
            title="Center"
          ></div>

          {/* Display markers */}
          {markers.map((marker, index) => {
            // Calculate position relative to center point
            const latOffset = (marker.lat - latitude) * zoom * 20;
            const lngOffset = (marker.lng - longitude) * zoom * 20;

            return (
              <div
                key={index}
                className="absolute flex flex-col items-center cursor-pointer"
                style={{
                  transform: `translate(-50%, -100%)`,
                  top: `calc(50% - ${latOffset}px)`,
                  left: `calc(50% + ${lngOffset}px)`,
                }}
                onClick={marker.onClick}
                title={marker.title}
              >
                <div className="flex flex-col items-center">
                  <div className="bg-white text-xs font-semibold py-1 px-2 rounded shadow-md mb-1 max-w-[150px] truncate">
                    {marker.title}
                  </div>
                  <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white"></div>
                </div>
                <div className="h-6 w-6 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-white text-xs shadow-lg">
                  P
                </div>
              </div>
            );
          })}

          {/* Simple attribution */}
          <div className="absolute bottom-1 right-1 text-xs text-gray-500 bg-white/70 px-1 rounded">
            EasyPark Map View
          </div>
        </>
      )}
    </div>
  );
}

export default MapView;