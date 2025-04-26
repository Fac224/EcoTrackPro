import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar, MapPin, DollarSign, Clock, Car } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";

interface EventParkingRecommendation {
  location: string;
  description: string;
  price: string;
  features: string[];
  distance?: string;
  availability?: string;
}

interface EventParkingRecommendationsProps {
  className?: string;
}

export function EventParkingRecommendations({ className }: EventParkingRecommendationsProps) {
  const [location, setLocation] = useState("");
  const [eventType, setEventType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [timeNeeded, setTimeNeeded] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<EventParkingRecommendation[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleAmenityToggle = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter(a => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) return;

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await apiRequest("/api/ai/recommendations", {
        method: "POST",
        body: JSON.stringify({
          location,
          preferences: {
            eventType: eventType || undefined,
            priceRange: priceRange || undefined,
            amenities: amenities.length > 0 ? amenities : undefined,
            timeNeeded: timeNeeded || undefined
          }
        })
      });

      setRecommendations(response.recommendations || []);
    } catch (error) {
      console.error("Error getting parking recommendations:", error);
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`shadow-lg border-primary/10 ${className}`}>
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardTitle className="flex items-center text-xl">
          <Calendar className="h-5 w-5 mr-2 text-primary" />
          Event Parking Finder
        </CardTitle>
        <CardDescription>
          Find the perfect parking spot for your next event
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">Event Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="location"
                placeholder="Enter event location or venue"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event-type">Event Type</Label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger id="event-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concert">Concert</SelectItem>
                  <SelectItem value="sports">Sports Game</SelectItem>
                  <SelectItem value="theater">Theater</SelectItem>
                  <SelectItem value="conference">Conference</SelectItem>
                  <SelectItem value="festival">Festival</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price-range">Price Range</Label>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger id="price-range">
                  <SelectValue placeholder="Any price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Budget (Under $10)</SelectItem>
                  <SelectItem value="moderate">Moderate ($10-$20)</SelectItem>
                  <SelectItem value="premium">Premium ($20+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time-needed">Time Needed</Label>
            <Select value={timeNeeded} onValueChange={setTimeNeeded}>
              <SelectTrigger id="time-needed">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2-3 hours">2-3 hours</SelectItem>
                <SelectItem value="3-5 hours">3-5 hours</SelectItem>
                <SelectItem value="5+ hours">5+ hours</SelectItem>
                <SelectItem value="all day">All day</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Amenities</Label>
            <div className="grid grid-cols-2 gap-2">
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
                  checked={amenities.includes("security")}
                  onCheckedChange={() => handleAmenityToggle("security")}
                />
                <Label htmlFor="security" className="text-sm">Security</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="ev-charging" 
                  checked={amenities.includes("ev charging")}
                  onCheckedChange={() => handleAmenityToggle("ev charging")}
                />
                <Label htmlFor="ev-charging" className="text-sm">EV charging</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="shuttle" 
                  checked={amenities.includes("shuttle")}
                  onCheckedChange={() => handleAmenityToggle("shuttle")}
                />
                <Label htmlFor="shuttle" className="text-sm">Shuttle service</Label>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !location}>
            {isLoading ? "Finding parking..." : "Find Event Parking"}
          </Button>
        </form>
      </CardContent>

      {hasSearched && (
        <CardFooter className="flex flex-col border-t pt-6">
          <h3 className="text-lg font-semibold mb-4 w-full">
            {recommendations.length > 0 
              ? `Found ${recommendations.length} parking options` 
              : "No parking options found"}
          </h3>
          
          <div className="space-y-4 w-full">
            {recommendations.map((rec, index) => (
              <Card key={index} className="w-full overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-primary/5 p-3 border-b">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold">{rec.location}</h4>
                      <Badge variant="outline" className="bg-primary/10">{rec.price}</Badge>
                    </div>
                    {rec.distance && (
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" /> {rec.distance}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3">
                    <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {rec.features.map((feature, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{feature}</Badge>
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
            
            {recommendations.length === 0 && !isLoading && (
              <div className="text-center py-6 text-gray-500">
                <Car className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No parking options found matching your criteria. Try different search parameters.</p>
              </div>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

export default EventParkingRecommendations;