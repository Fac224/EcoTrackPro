import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Driveway } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { MapView } from "@/components/ui/map-view";
import { DrivewayCard } from "@/components/DrivewayCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatDate, formatTimeString } from "@/lib/utils";

interface MapSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchParams: {
    location: string;
    date?: string;
    startTime?: string;
    endTime?: string;
  };
}

const getGeocodeFromLocation = async (location: string) => {
  // This is a mock geocode function that returns coordinates for specific locations
  // In a real app, this would use the Google Geocoding API
  
  const locationMap: { [key: string]: { lat: number; lng: number } } = {
    "new york": { lat: 40.7128, lng: -74.0060 },
    "los angeles": { lat: 34.0522, lng: -118.2437 },
    "chicago": { lat: 41.8781, lng: -87.6298 },
    "san francisco": { lat: 37.7749, lng: -122.4194 },
    "miami": { lat: 25.7617, lng: -80.1918 },
    "austin": { lat: 30.2672, lng: -97.7431 },
    "seattle": { lat: 47.6062, lng: -122.3321 },
    "boston": { lat: 42.3601, lng: -71.0589 },
    "philadelphia": { lat: 39.9526, lng: -75.1652 },
    "houston": { lat: 29.7604, lng: -95.3698 },
    "phoenix": { lat: 33.4484, lng: -112.0740 },
    "san diego": { lat: 32.7157, lng: -117.1611 },
    "denver": { lat: 39.7392, lng: -104.9903 },
    "brooklyn": { lat: 40.6782, lng: -73.9442 },
  };

  // Search for a partial match
  const normalizedLocation = location.toLowerCase();
  for (const [key, coords] of Object.entries(locationMap)) {
    if (normalizedLocation.includes(key)) {
      return coords;
    }
  }

  // Default to San Francisco if no match is found
  return { lat: 37.7749, lng: -122.4194 };
};

export function MapSearchModal({ isOpen, onClose, searchParams }: MapSearchModalProps) {
  const [view, setView] = useState<"map" | "list">("map");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({ lat: 37.7749, lng: -122.4194 });
  const [isLoadingCoordinates, setIsLoadingCoordinates] = useState(false);

  // Get coordinates based on location
  useEffect(() => {
    if (searchParams.location) {
      setIsLoadingCoordinates(true);
      getGeocodeFromLocation(searchParams.location)
        .then(coords => {
          setCoordinates(coords);
          setIsLoadingCoordinates(false);
        })
        .catch(() => {
          setIsLoadingCoordinates(false);
        });
    }
  }, [searchParams.location]);

  // Build query params for API
  const queryParams: Record<string, string> = {};
  if (searchParams.location) queryParams.location = searchParams.location;
  if (searchParams.date) queryParams.date = searchParams.date;
  if (searchParams.startTime) queryParams.startTime = searchParams.startTime;
  if (searchParams.endTime) queryParams.endTime = searchParams.endTime;
  
  // Construct query string
  const queryString = new URLSearchParams(queryParams).toString();
  
  // Fetch driveways - using the main driveways endpoint, but in a real app we'd use a search-specific endpoint
  const { data: driveways, isLoading } = useQuery<Driveway[]>({
    queryKey: ['/api/driveways'],
    enabled: isOpen,
  });

  // Generate random positions near the searched coordinates for driveways
  const generateNearbyPositions = (baseLat: number, baseLng: number, count: number, radiusKm: number = 2) => {
    // Converts kilometers to degrees (approximately)
    const kmToDegLat = 0.009;
    const kmToDegLng = 0.009 / Math.cos(baseLat * Math.PI / 180);
    
    return Array.from({ length: count }, (_, i) => {
      // Generate random offsets within the radius
      const randomOffsetLat = (Math.random() - 0.5) * 2 * radiusKm * kmToDegLat;
      const randomOffsetLng = (Math.random() - 0.5) * 2 * radiusKm * kmToDegLng;
      
      return {
        lat: baseLat + randomOffsetLat,
        lng: baseLng + randomOffsetLng
      };
    });
  };

  // Create enhanced driveways with proper coordinates based on search location
  const nearbyPositions = coordinates ? generateNearbyPositions(coordinates.lat, coordinates.lng, driveways?.length || 0) : [];
  const enhancedDriveways = driveways?.map((driveway, index) => ({
    ...driveway,
    latitude: nearbyPositions[index]?.lat || driveway.latitude,
    longitude: nearbyPositions[index]?.lng || driveway.longitude
  }));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">
              Parking near {searchParams.location || "your location"}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Search details summary */}
          <div className="flex flex-wrap text-sm text-gray-500 mt-1">
            {searchParams.location && <span className="mr-3">Location: {searchParams.location}</span>}
            {searchParams.date && <span className="mr-3">Date: {formatDate(new Date(searchParams.date))}</span>}
            {searchParams.startTime && <span className="mr-3">From: {formatTimeString(searchParams.startTime)}</span>}
            {searchParams.endTime && <span>To: {formatTimeString(searchParams.endTime)}</span>}
          </div>
          
          <Tabs defaultValue="map" className="mt-2" onValueChange={(value) => setView(value as "map" | "list")}>
            <TabsList className="w-full max-w-[200px]">
              <TabsTrigger value="map" className="flex-1">Map View</TabsTrigger>
              <TabsTrigger value="list" className="flex-1">List View</TabsTrigger>
            </TabsList>
          </Tabs>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          {isLoading || isLoadingCoordinates ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : view === "map" ? (
            <div className="h-[600px] w-full">
              <MapView
                latitude={coordinates.lat}
                longitude={coordinates.lng}
                zoom={14}
                height="100%"
                width="100%"
                markers={enhancedDriveways?.map(driveway => ({
                  lat: driveway.latitude,
                  lng: driveway.longitude,
                  title: `$${driveway.priceHourly.toFixed(2)}/hr - ${driveway.address}`,
                  onClick: () => window.location.href = `/driveways/${driveway.id}`
                })) || []}
              />
            </div>
          ) : (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {enhancedDriveways && enhancedDriveways.length > 0 ? (
                enhancedDriveways.map((driveway) => (
                  <DrivewayCard key={driveway.id} driveway={driveway} />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No parking spaces found for this location and time.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default MapSearchModal;