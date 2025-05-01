import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star, 
  Sparkles, 
  Navigation, 
  Calendar, 
  Clock, 
  ArrowRight, 
  MapPin, 
  Bookmark, 
  Search 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

interface PersonalizedSuggestion {
  type: string;
  title: string;
  description: string;
  reason: string;
}

export function PersonalizedRecommendations() {
  const [activeTab, setActiveTab] = useState("suggestions");

  // Define the response type
  interface PersonalizedResponse {
    suggestions: PersonalizedSuggestion[];
  }

  // Fetch personalized suggestions from AI
  const { data, isLoading, error, refetch } = useQuery<PersonalizedResponse>({
    queryKey: ['/api/ai/personalized'],
    // Only run this query if the user is logged in (will return 401 otherwise)
    retry: false,
    refetchOnWindowFocus: false
  });

  // Predefined recommendations for users not logged in
  const defaultSuggestions: PersonalizedSuggestion[] = [
    {
      type: "event",
      title: "Weekend Event Parking",
      description: "Find convenient parking for upcoming weekend events in your area.",
      reason: "Popular in your region"
    },
    {
      type: "commuter",
      title: "Weekday Commuter Deals",
      description: "Save money with weekly and monthly parking passes for your daily commute.",
      reason: "Best value for regular commuters"
    },
    {
      type: "neighborhood",
      title: "Downtown Parking Spots",
      description: "Discover high-rated parking options in prime downtown locations.",
      reason: "Highly rated by other users"
    }
  ];

  // Get suggestions, either from API or defaults
  const suggestions = data?.suggestions || defaultSuggestions;

  // Get icon based on suggestion type
  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "event":
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case "airport":
        return <Navigation className="h-5 w-5 text-indigo-500" />;
      case "commuter":
        return <Clock className="h-5 w-5 text-green-500" />;
      default:
        return <Star className="h-5 w-5 text-amber-500" />;
    }
  };

  // Handle refresh of recommendations
  const handleRefresh = () => {
    refetch();
  };

  return (
    <Card className="shadow-md overflow-hidden border-primary/10">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            Smart Recommendations
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
        <CardDescription>
          AI-powered parking suggestions based on your preferences
        </CardDescription>
      </CardHeader>

      <div>
        <Tabs defaultValue="suggestions" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 m-4 mb-0">
            <TabsTrigger value="suggestions">For You</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
          </TabsList>
          
          <TabsContent value="suggestions" className="m-0">
            <CardContent className="pt-4">
              {error ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">
                    {error instanceof Error && error.message.includes("401")
                      ? "Please log in to see personalized recommendations"
                      : "Could not load recommendations. Please try again later."}
                  </p>
                  {error instanceof Error && error.message.includes("401") && (
                    <Button variant="link" asChild className="mt-2">
                      <Link href="/login">Log in</Link>
                    </Button>
                  )}
                </div>
              ) : isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start space-x-3 animate-pulse">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {suggestions.map((suggestion: PersonalizedSuggestion, index: number) => (
                    <div key={index} className="flex flex-col border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start">
                        <div className="mt-1 mr-3 flex-shrink-0">
                          {getSuggestionIcon(suggestion.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 leading-tight flex items-center">
                            {suggestion.title}
                            <Badge variant="outline" className="ml-2 text-xs">
                              {suggestion.type}
                            </Badge>
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                          <p className="text-xs text-gray-500 mt-1 italic">
                            {suggestion.reason}
                          </p>
                          
                          <div className="flex mt-3 space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              asChild
                            >
                              <Link href={`/search?q=${encodeURIComponent(suggestion.title)}`}>
                                <Search className="h-3.5 w-3.5 mr-1" />
                                Find spots
                              </Link>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-primary"
                            >
                              <Bookmark className="h-3.5 w-3.5 mr-1" />
                              Save
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </TabsContent>
          
          <TabsContent value="trending" className="m-0">
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex flex-col border-b pb-4 space-y-1">
                  <div className="flex items-start">
                    <div className="mt-1 mr-3 flex-shrink-0">
                      <Star className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 leading-tight">
                        Downtown Concert Venues
                        <Badge variant="outline" className="ml-2 text-xs">trending</Badge>
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        High demand for parking near downtown music venues this weekend.
                      </p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        Downtown Arts District
                      </div>
                      
                      <div className="flex mt-3 space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          asChild
                        >
                          <Link href={`/search?location=Downtown+Arts+District`}>
                            <Search className="h-3.5 w-3.5 mr-1" />
                            View spots
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-primary"
                        >
                          <Bookmark className="h-3.5 w-3.5 mr-1" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col border-b pb-4 space-y-1">
                  <div className="flex items-start">
                    <div className="mt-1 mr-3 flex-shrink-0">
                      <Calendar className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 leading-tight">
                        Championship Game Parking
                        <Badge variant="outline" className="ml-2 text-xs">popular</Badge>
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Reserve now for the upcoming championship game - spots filling quickly!
                      </p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        Stadium District
                      </div>
                      
                      <div className="flex mt-3 space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          asChild
                        >
                          <Link href={`/search?location=Stadium+District`}>
                            <Search className="h-3.5 w-3.5 mr-1" />
                            View spots
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-primary"
                        >
                          <Bookmark className="h-3.5 w-3.5 mr-1" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <div className="flex items-start">
                    <div className="mt-1 mr-3 flex-shrink-0">
                      <Star className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 leading-tight">
                        Downtown Garage Parking
                        <Badge variant="outline" className="ml-2 text-xs">best rated</Badge>
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Highly-rated secure parking facilities in the downtown area.
                      </p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        Financial District
                      </div>
                      
                      <div className="flex mt-3 space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          asChild
                        >
                          <Link href={`/search?location=Financial+District`}>
                            <Search className="h-3.5 w-3.5 mr-1" />
                            View spots
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-primary"
                        >
                          <Bookmark className="h-3.5 w-3.5 mr-1" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
      </div>

      <CardFooter className="bg-gray-50 border-t px-4 py-3">
        <Button variant="outline" className="w-full flex items-center justify-center" asChild>
          <Link href="/search">
            View All Recommendations
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default PersonalizedRecommendations;