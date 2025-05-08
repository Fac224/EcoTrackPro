import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plane, Clock, Car, Bus, Shield, MapPin, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format, isBefore, addDays, differenceInDays } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AirportParkingRecommendation {
  location: string;
  description: string;
  price: string;
  features: string[];
  distance?: string;
  availability?: string;
  shuttleAvailable?: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface AirportParkingFinderProps {
  className?: string;
}

export function AirportParkingFinder({ className }: AirportParkingFinderProps) {
  const { toast } = useToast();
  const [airport, setAirport] = useState("");
  const [dropoffDate, setDropoffDate] = useState<Date | undefined>(undefined);
  const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined);
  const [parkingType, setParkingType] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<AirportParkingRecommendation[]>([]);
  const [activeTab, setActiveTab] = useState("search");
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMapDialog, setShowMapDialog] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<AirportParkingRecommendation | null>(null);

  // Use effect to validate dates when they change
  useEffect(() => {
    if (dropoffDate && pickupDate) {
      if (isBefore(pickupDate, dropoffDate)) {
        setError("Pick-up date cannot be before drop-off date");
      } else {
        setError(null);
      }
    }
  }, [dropoffDate, pickupDate]);

  // Set today and tomorrow as default dates if none selected
  useEffect(() => {
    if (!dropoffDate && !pickupDate) {
      const today = new Date();
      setDropoffDate(today);
      setPickupDate(addDays(today, 1));
    }
  }, []);

  const handleAmenityToggle = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter(a => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const calculateDuration = () => {
    if (!dropoffDate || !pickupDate) return "";
    
    if (isBefore(pickupDate, dropoffDate)) {
      return "Invalid dates";
    }
    
    const diffDays = differenceInDays(pickupDate, dropoffDate);
    return diffDays === 0 ? "1 day" : `${diffDays + 1} days`;
  };

  const handleViewOnMap = (rec: AirportParkingRecommendation) => {
    setSelectedLocation(rec);
    setShowMapDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!airport) {
      toast({
        title: "Missing information",
        description: "Please select an airport",
        variant: "destructive",
      });
      return;
    }

    // Validate dates
    if (!dropoffDate || !pickupDate) {
      toast({
        title: "Missing information",
        description: "Please select drop-off and pick-up dates",
        variant: "destructive",
      });
      return;
    }

    // Check if pickup date is before dropoff date
    if (isBefore(pickupDate, dropoffDate)) {
      toast({
        title: "Invalid dates",
        description: "Pick-up date cannot be before drop-off date",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    setActiveTab("results");
    setError(null);

    try {
      // Calculate duration for the query
      const duration = calculateDuration();

      // Make API request to get recommendations
      const response = await fetch("/api/ai/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: airport,
          preferences: {
            eventType: "airport travel",
            priceRange: parkingType === "premium" ? "premium" : 
                      parkingType === "standard" ? "moderate" : 
                      parkingType === "economy" ? "budget" : undefined,
            amenities: amenities.length > 0 ? amenities : undefined,
            timeNeeded: duration || undefined
          }
        })
      });

      const data = await response.json();
      
      // Add mock coordinates to each recommendation for the map view
      const recommendationsWithCoordinates = (data.recommendations || []).map((rec: AirportParkingRecommendation, index: number) => {
        // Generate some random coordinates near the actual airport
        // In a real application, these would come from your backend/database
        const baseCoordinates = getAirportCoordinates(airport);
        return {
          ...rec,
          coordinates: {
            lat: baseCoordinates.lat + (Math.random() - 0.5) * 0.05,
            lng: baseCoordinates.lng + (Math.random() - 0.5) * 0.05
          }
        };
      });

      setRecommendations(recommendationsWithCoordinates);

      if (recommendationsWithCoordinates.length === 0) {
        toast({
          title: "No results found",
          description: "Try changing your search criteria",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error getting airport parking recommendations:", error);
      setRecommendations([]);
      toast({
        title: "Error",
        description: "Failed to retrieve parking recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get approximate coordinates for major airports
  const getAirportCoordinates = (airportName: string) => {
    const airportCoordinates: Record<string, {lat: number, lng: number}> = {
      "JFK International Airport": {lat: 40.6413, lng: -73.7781},
      "LAX": {lat: 33.9416, lng: -118.4085},
      "O'Hare International Airport": {lat: 41.9742, lng: -87.9073},
      "San Francisco International Airport": {lat: 37.6213, lng: -122.3790},
      "Miami International Airport": {lat: 25.7932, lng: -80.2906},
      "Seattle-Tacoma International Airport": {lat: 47.4502, lng: -122.3088},
    };
    
    return airportCoordinates[airportName] || {lat: 40.7128, lng: -74.0060}; // Default to NYC
  };

  return (
    <>
      <Card className={`shadow-lg border-primary/10 ${className}`}>
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center text-xl">
            <Plane className="h-5 w-5 mr-2 text-primary" />
            Airport Parking Finder
          </CardTitle>
          <CardDescription>
            Find convenient and affordable airport parking options
          </CardDescription>
        </CardHeader>

        <Tabs defaultValue="search" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mx-4 mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="results" disabled={!hasSearched}>Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="mt-0 p-0">
          <CardContent className="pt-6">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="airport">Airport <span className="text-red-500">*</span></Label>
                <Select value={airport} onValueChange={setAirport} required>
                  <SelectTrigger id="airport">
                    <SelectValue placeholder="Select an airport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JFK International Airport">JFK International Airport</SelectItem>
                    <SelectItem value="LAX">LAX - Los Angeles International</SelectItem>
                    <SelectItem value="O'Hare International Airport">O'Hare International Airport</SelectItem>
                    <SelectItem value="San Francisco International Airport">San Francisco International</SelectItem>
                    <SelectItem value="Miami International Airport">Miami International</SelectItem>
                    <SelectItem value="Seattle-Tacoma International Airport">Seattle-Tacoma International</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Drop-off Date <span className="text-red-500">*</span></Label>
                  <DatePicker 
                    date={dropoffDate}
                    setDate={setDropoffDate}
                    className="w-full"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pick-up Date <span className="text-red-500">*</span></Label>
                  <DatePicker 
                    date={pickupDate}
                    setDate={setPickupDate}
                    className="w-full"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parking-type">Parking Type</Label>
                <Select value={parkingType} onValueChange={setParkingType} disabled={isLoading}>
                  <SelectTrigger id="parking-type">
                    <SelectValue placeholder="Any type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">Economy</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Amenities</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="shuttle" 
                      checked={amenities.includes("shuttle")}
                      onCheckedChange={() => handleAmenityToggle("shuttle")}
                      disabled={isLoading}
                    />
                    <Label htmlFor="shuttle" className="text-sm">Shuttle service</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="covered" 
                      checked={amenities.includes("covered")}
                      onCheckedChange={() => handleAmenityToggle("covered")}
                      disabled={isLoading}
                    />
                    <Label htmlFor="covered" className="text-sm">Covered parking</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="security" 
                      checked={amenities.includes("24/7 security")}
                      onCheckedChange={() => handleAmenityToggle("24/7 security")}
                      disabled={isLoading}
                    />
                    <Label htmlFor="security" className="text-sm">24/7 Security</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="valet" 
                      checked={amenities.includes("valet")}
                      onCheckedChange={() => handleAmenityToggle("valet")}
                      disabled={isLoading}
                    />
                    <Label htmlFor="valet" className="text-sm">Valet service</Label>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !airport || !dropoffDate || !pickupDate || error !== null}
              >
                {isLoading ? "Finding parking..." : "Find Airport Parking"}
              </Button>
            </form>
          </CardContent>
        </TabsContent>

        <TabsContent value="results" className="mt-0 p-0">
          <CardContent className="pt-6">
            {recommendations.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">
                    {airport}
                  </h3>
                  {dropoffDate && pickupDate && !isBefore(pickupDate, dropoffDate) && (
                    <Badge variant="outline" className="text-xs font-normal">
                      {format(dropoffDate, "MMM d")} - {format(pickupDate, "MMM d")}
                      {calculateDuration() ? ` (${calculateDuration()})` : ""}
                    </Badge>
                  )}
                </div>

                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="bg-primary/5 p-3 border-b">
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold">{rec.location}</h4>
                            <Badge variant="outline" className="bg-primary/10">{rec.price}</Badge>
                          </div>
                          {rec.distance && (
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <Car className="h-3 w-3 mr-1" /> {rec.distance}
                            </div>
                          )}
                        </div>
                        
                        <div className="p-3">
                          <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                          
                          <div className="flex flex-wrap gap-1 mt-3">
                            {rec.features.map((feature, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {feature.toLowerCase().includes("shuttle") && <Bus className="h-3 w-3 mr-1" />}
                                {feature.toLowerCase().includes("security") && <Shield className="h-3 w-3 mr-1" />}
                                {feature}
                              </Badge>
                            ))}
                          </div>
                          
                          {rec.availability && (
                            <div className="mt-2 text-xs text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" /> {rec.availability}
                            </div>
                          )}
                          
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="mt-2 p-0 h-auto text-primary" 
                            onClick={() => handleViewOnMap(rec)}
                          >
                            <MapPin className="h-3 w-3 mr-1" /> View on map
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="w-full overflow-hidden">
                        <CardContent className="p-3 animate-pulse">
                          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                          <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-5/6 mb-3"></div>
                          <div className="flex gap-1">
                            <div className="h-5 bg-gray-200 rounded w-16"></div>
                            <div className="h-5 bg-gray-200 rounded w-20"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <>
                    <Plane className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p className="text-gray-500">
                      {hasSearched 
                        ? "No parking options found matching your criteria. Try different search parameters."
                        : "Search for airport parking to see recommendations."}
                    </p>
                    {hasSearched && (
                      <Button 
                        variant="outline" 
                        className="mt-4" 
                        onClick={() => setActiveTab("search")}
                      >
                        Modify Search
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}
          </CardContent>
        </TabsContent>
        </Tabs>

        <CardFooter className="border-t flex justify-between bg-gray-50 p-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setActiveTab("search")} 
            disabled={!hasSearched || activeTab === "search"}
          >
            Modify Search
          </Button>
          
          {recommendations.length > 0 && (
            <Button 
              size="sm" 
              onClick={() => {
                if (recommendations[0]) {
                  handleViewOnMap(recommendations[0]);
                }
              }}
            >
              <MapPin className="h-4 w-4 mr-1" /> View All on Map
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Map Dialog */}
      <Dialog open={showMapDialog} onOpenChange={setShowMapDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Parking Near {airport}</DialogTitle>
          </DialogHeader>
          <div className="h-[500px] w-full bg-gray-100 relative overflow-hidden">
            {selectedLocation ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <iframe 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  style={{ border: 0 }} 
                  src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyAanMM_SHlW67y28F-0wAeGWDJ40ocn16A'}&q=${encodeURIComponent(selectedLocation.location)}&zoom=14`} 
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="text-center p-8">
                <Plane className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>Select a parking location to view on the map</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AirportParkingFinder;