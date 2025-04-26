import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plane, Calendar, DollarSign, Clock, Car, Bus, Shield } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";

interface AirportParkingRecommendation {
  location: string;
  description: string;
  price: string;
  features: string[];
  distance?: string;
  availability?: string;
  shuttleAvailable?: boolean;
}

interface AirportParkingFinderProps {
  className?: string;
}

export function AirportParkingFinder({ className }: AirportParkingFinderProps) {
  const [airport, setAirport] = useState("");
  const [dropoffDate, setDropoffDate] = useState<Date | undefined>(undefined);
  const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined);
  const [parkingType, setParkingType] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<AirportParkingRecommendation[]>([]);
  const [activeTab, setActiveTab] = useState("search");
  const [hasSearched, setHasSearched] = useState(false);

  const handleAmenityToggle = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter(a => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const calculateDuration = () => {
    if (!dropoffDate || !pickupDate) return "";
    
    const diffTime = Math.abs(pickupDate.getTime() - dropoffDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays === 1 ? "1 day" : `${diffDays} days`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!airport) return;

    setIsLoading(true);
    setHasSearched(true);
    setActiveTab("results");

    try {
      // Calculate duration for the query
      const duration = calculateDuration();

      const response = await apiRequest("/api/ai/recommendations", {
        method: "POST",
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

      setRecommendations(response.recommendations || []);
    } catch (error) {
      console.error("Error getting airport parking recommendations:", error);
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`shadow-lg border-primary/10 ${className}`}>
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="flex items-center text-xl">
          <Plane className="h-5 w-5 mr-2 text-primary" />
          Airport Parking Finder
        </CardTitle>
        <CardDescription>
          Find convenient and affordable airport parking options
        </CardDescription>

        <Tabs defaultValue="search" value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="results" disabled={!hasSearched}>Results</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <TabsContent value="search" className="mt-0 p-0">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="airport">Airport</Label>
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
                <Label>Drop-off Date</Label>
                <DatePicker 
                  date={dropoffDate}
                  setDate={setDropoffDate}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label>Pick-up Date</Label>
                <DatePicker 
                  date={pickupDate}
                  setDate={setPickupDate}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parking-type">Parking Type</Label>
              <Select value={parkingType} onValueChange={setParkingType}>
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
                  />
                  <Label htmlFor="shuttle" className="text-sm">Shuttle service</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="covered" 
                    checked={amenities.includes("covered")}
                    onCheckedChange={() => handleAmenityToggle("covered")}
                  />
                  <Label htmlFor="covered" className="text-sm">Covered parking</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="security" 
                    checked={amenities.includes("24/7 security")}
                    onCheckedChange={() => handleAmenityToggle("24/7 security")}
                  />
                  <Label htmlFor="security" className="text-sm">24/7 Security</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="valet" 
                    checked={amenities.includes("valet")}
                    onCheckedChange={() => handleAmenityToggle("valet")}
                  />
                  <Label htmlFor="valet" className="text-sm">Valet service</Label>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || !airport}>
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
                {dropoffDate && pickupDate && (
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
                              {feature.includes("shuttle") && <Bus className="h-3 w-3 mr-1" />}
                              {feature.includes("security") && <Shield className="h-3 w-3 mr-1" />}
                              {feature}
                            </Badge>
                          ))}
                        </div>
                        
                        {rec.availability && (
                          <div className="mt-2 text-xs text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" /> {rec.availability}
                          </div>
                        )}
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
          <Button size="sm">
            View on Map
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default AirportParkingFinder;