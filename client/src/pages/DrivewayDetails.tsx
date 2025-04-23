import { useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import MapView from "@/components/ui/map-view";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Driveway } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Clock, 
  Calendar, 
  Car, 
  MapPin, 
  DollarSign, 
  Star,
  StarHalf,
  Info,
  User
} from "lucide-react";
import { formatWeekdayHours, formatCurrency } from "@/lib/utils";

export default function DrivewayDetails() {
  const params = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const drivewayId = parseInt(params.id);
  
  // Check for valid ID
  useEffect(() => {
    if (isNaN(drivewayId)) {
      navigate('/search');
      toast({
        title: "Invalid driveway ID",
        description: "Please select a valid driveway",
        variant: "destructive",
      });
    }
  }, [drivewayId, navigate, toast]);
  
  // Fetch driveway details
  const { data: driveway, isLoading, error } = useQuery<Driveway>({
    queryKey: [`/api/driveways/${drivewayId}`],
    enabled: !isNaN(drivewayId),
  });
  
  // Fetch user info to check if logged in
  const { data: user } = useQuery({
    queryKey: ['/api/me'],
    retry: false,
    refetchOnWindowFocus: false,
  });
  
  const handleBookNow = () => {
    if (!user) {
      // If not logged in, redirect to login
      navigate(`/login?redirect=/book/${drivewayId}`);
      return;
    }
    
    // If logged in, navigate to booking page
    navigate(`/book/${drivewayId}`);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error || !driveway) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex justify-center items-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 pb-6 text-center">
              <Info className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Driveway Not Found</h2>
              <p className="text-gray-500 mb-6">The driveway you're looking for doesn't exist or has been removed.</p>
              <Button onClick={() => navigate('/search')}>
                Back to Search
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button 
            onClick={() => navigate('/search')}
            className="flex items-center text-primary hover:text-blue-600 mb-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to search results
          </button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                {/* Image Placeholder */}
                <div className="h-64 bg-gray-200 flex items-center justify-center">
                  <div className="text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">{driveway.address}</h1>
                      <p className="text-gray-600 flex items-center mb-4">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        {driveway.city}, {driveway.state} {driveway.zipCode}
                      </p>
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(driveway.priceHourly)}<span className="text-gray-500 text-base font-normal">/hr</span>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-gray-900">Availability</h3>
                        <p className="text-gray-600">
                          {formatWeekdayHours(
                            driveway.availableWeekdays,
                            driveway.availabilityStartTime,
                            driveway.availabilityEndTime
                          )}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <User className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-gray-900">Host</h3>
                        <p className="text-gray-600">Host ID: {driveway.ownerId}</p>
                      </div>
                    </div>
                  </div>
                  
                  {driveway.description && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                      <p className="text-gray-600">{driveway.description}</p>
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Location</h2>
                    <MapView
                      latitude={driveway.latitude}
                      longitude={driveway.longitude}
                      zoom={16}
                      height="300px"
                      showMarker={true}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Ratings & Reviews</h2>
                    <div className="flex items-center mb-2">
                      <div className="flex text-amber-500 mr-2">
                        <Star className="h-5 w-5 fill-current" />
                        <Star className="h-5 w-5 fill-current" />
                        <Star className="h-5 w-5 fill-current" />
                        <Star className="h-5 w-5 fill-current" />
                        <StarHalf className="h-5 w-5 fill-current" />
                      </div>
                      <span className="text-gray-600">4.5 (28 reviews)</span>
                    </div>
                    
                    {/* Sample Review */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <div className="flex text-amber-500 mr-2">
                          <Star className="h-4 w-4 fill-current" />
                          <Star className="h-4 w-4 fill-current" />
                          <Star className="h-4 w-4 fill-current" />
                          <Star className="h-4 w-4 fill-current" />
                          <Star className="h-4 w-4 fill-current" />
                        </div>
                        <span className="text-sm text-gray-500">2 weeks ago</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-1">
                        "Great parking spot! Easy to find and very convenient to downtown. Would definitely park here again."
                      </p>
                      <p className="text-sm font-medium text-gray-700">- Michael R.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Booking Widget */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Reserve this space</h2>
                  
                  <div className="grid grid-cols-1 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Clock className="h-5 w-5 mr-2 text-gray-400" />
                        <span className="text-gray-900 font-medium">Operating Hours</span>
                      </div>
                      <p className="text-gray-600 ml-7">
                        {formatWeekdayHours(
                          driveway.availableWeekdays,
                          driveway.availabilityStartTime,
                          driveway.availabilityEndTime
                        )}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Car className="h-5 w-5 mr-2 text-gray-400" />
                        <span className="text-gray-900 font-medium">Parking Details</span>
                      </div>
                      <p className="text-gray-600 ml-7">
                        Private driveway parking
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <DollarSign className="h-5 w-5 mr-2 text-gray-400" />
                        <span className="text-gray-900 font-medium">Price</span>
                      </div>
                      <p className="text-gray-600 ml-7">
                        {formatCurrency(driveway.priceHourly)} per hour
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full h-12 text-lg"
                    onClick={handleBookNow}
                  >
                    Book Now
                  </Button>
                  
                  <p className="text-xs text-center mt-4 text-gray-500">
                    You won't be charged yet
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
