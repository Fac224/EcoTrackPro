import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";

interface ParkingRecommendation {
  location: string;
  description: string;
  price: string;
  features: string[];
  distance?: string;
  availability?: string;
}

export default function TestVenueParking() {
  const [venue, setVenue] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<ParkingRecommendation[]>([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!venue.trim()) {
      setError("Please enter a venue name");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await apiRequest(
        "POST", 
        "/api/ai/recommendations", 
        { location: venue, preferences: { eventType: "concert" } }
      );
      const data = await response.json();
      setRecommendations(data.recommendations || []);
      if (data.recommendations?.length === 0) {
        setError("No recommendations found for this venue");
      }
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("Failed to fetch parking recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const venueOptions = [
    "UBS Arena", 
    "Madison Square Garden", 
    "Barclays Center",
    "Citi Field",
    "Yankee Stadium"
  ];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Event Venue Parking Finder</h1>
      
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="mb-4">
          <Label htmlFor="venue">Venue Name</Label>
          <div className="flex gap-2">
            <Input 
              id="venue"
              placeholder="Enter venue name (e.g., UBS Arena, Madison Square Garden)"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? "Searching..." : "Find Parking"}
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {venueOptions.map((option) => (
            <Button 
              key={option} 
              variant="outline" 
              size="sm"
              onClick={() => setVenue(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{rec.location}</CardTitle>
              <CardDescription>{rec.distance}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-2">{rec.description}</p>
              <p className="font-medium mb-2">{rec.price}</p>
              <div className="mt-3">
                <h4 className="text-sm font-semibold mb-1">Features:</h4>
                <ul className="list-disc list-inside text-sm">
                  {rec.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </div>
              {rec.availability && (
                <p className="mt-2 text-sm text-gray-600">
                  Availability: {rec.availability}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {recommendations.length > 0 && (
        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => setRecommendations([])}>
            Clear Results
          </Button>
        </div>
      )}
    </div>
  );
}