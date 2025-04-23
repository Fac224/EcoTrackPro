import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Booking, Driveway, User } from "@shared/schema";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DrivewayCard from "@/components/DrivewayCard";
import { useToast } from "@/hooks/use-toast";
import { 
  ChevronRight, 
  Home, 
  Car, 
  CalendarRange, 
  Plus, 
  Loader2, 
  X, 
  BadgeCheck 
} from "lucide-react";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("driveways");

  // Fetch the current user
  const { data: user, isLoading: isLoadingUser, error: userError } = useQuery<User>({
    queryKey: ['/api/me'],
  });

  // Fetch user's driveways
  const { data: driveways, isLoading: isLoadingDriveways } = useQuery<Driveway[]>({
    queryKey: ['/api/my-driveways'],
    enabled: !!user,
  });

  // Fetch user's bookings
  const { data: bookings, isLoading: isLoadingBookings } = useQuery<Booking[]>({
    queryKey: ['/api/my-bookings'],
    enabled: !!user,
  });

  // Cancel booking mutation
  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId: number) => {
      await apiRequest('POST', `/api/bookings/${bookingId}/cancel`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/my-bookings'] });
      toast({
        title: "Booking cancelled",
        description: "Your booking has been successfully cancelled",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error cancelling booking",
        description: "Please try again later",
        variant: "destructive",
      });
      console.error("Error cancelling booking:", error);
    },
  });

  // Check if user is authenticated
  if (userError) {
    navigate('/login?redirect=/dashboard');
    return null;
  }

  // Format date for display
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Format time for display
  const formatTime = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Calculate total earnings/spending
  const calculateTotals = () => {
    if (!bookings) return { earnings: 0, spending: 0 };
    
    let earnings = 0;
    let spending = 0;
    
    bookings.forEach(booking => {
      // If the user has driveways and this booking is for one of their driveways
      if (driveways && driveways.some(d => d.id === booking.drivewayId)) {
        if (booking.status !== 'cancelled') {
          earnings += booking.totalPrice;
        }
      } else {
        // This is a booking the user made
        if (booking.status !== 'cancelled') {
          spending += booking.totalPrice;
        }
      }
    });
    
    return { earnings, spending };
  };

  const { earnings, spending } = calculateTotals();

  // Handle cancel booking
  const handleCancelBooking = (bookingId: number) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      cancelBookingMutation.mutate(bookingId);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          </div>
          
          {/* User Info Card */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
                    {user?.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                    <p className="text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-500">Total Earnings</p>
                    <p className="text-xl font-bold text-primary">${earnings.toFixed(2)}</p>
                  </div>
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-500">Total Spending</p>
                    <p className="text-xl font-bold text-gray-900">${spending.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="driveways" className="flex items-center justify-center">
                <Home className="mr-2 h-4 w-4" />
                My Driveways
              </TabsTrigger>
              <TabsTrigger value="bookings" className="flex items-center justify-center">
                <Car className="mr-2 h-4 w-4" />
                My Bookings
              </TabsTrigger>
            </TabsList>
            
            {/* My Driveways Tab */}
            <TabsContent value="driveways" className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Your Listed Driveways</h2>
                <Button onClick={() => navigate('/list-driveway')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Driveway
                </Button>
              </div>
              
              {isLoadingDriveways ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : driveways && driveways.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {driveways.map((driveway) => (
                    <DrivewayCard key={driveway.id} driveway={driveway} showBookButton={false} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center text-center">
                    <Home className="h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No driveways listed yet</h3>
                    <p className="text-gray-500 mb-4">Start making money by listing your driveway for others to park in.</p>
                    <Button onClick={() => navigate('/list-driveway')}>
                      List Your Driveway
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            {/* My Bookings Tab */}
            <TabsContent value="bookings" className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Your Bookings</h2>
                <Button onClick={() => navigate('/search')} variant="outline">
                  <CalendarRange className="mr-2 h-4 w-4" />
                  Find Parking
                </Button>
              </div>
              
              {isLoadingBookings ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : bookings && bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <Card key={booking.id} className={`overflow-hidden ${booking.status === 'cancelled' ? 'opacity-70' : ''}`}>
                      <CardContent className="p-0">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          {/* Date and Time */}
                          <div className="p-6 bg-gray-50 flex flex-col justify-center items-center md:items-start">
                            <div className="text-xl font-bold text-gray-900">{formatDate(booking.startTime)}</div>
                            <div className="text-gray-500">
                              {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                            </div>
                          </div>
                          
                          {/* Booking Details */}
                          <div className="p-6 md:col-span-2">
                            <div className="flex items-center mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 mr-3">Booking #{booking.id}</h3>
                              {booking.status === 'confirmed' && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                  Confirmed
                                </span>
                              )}
                              {booking.status === 'completed' && (
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                                  Completed
                                </span>
                              )}
                              {booking.status === 'cancelled' && (
                                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                                  Cancelled
                                </span>
                              )}
                            </div>
                            <div className="text-gray-500 mb-2">
                              Driveway ID: #{booking.drivewayId}
                            </div>
                            <div className="text-primary font-semibold text-lg">
                              ${booking.totalPrice.toFixed(2)}
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="p-6 bg-gray-50 flex items-center justify-center md:justify-end">
                            {booking.status === 'confirmed' && (
                              <Button 
                                variant="outline" 
                                className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                                disabled={cancelBookingMutation.isPending}
                                onClick={() => handleCancelBooking(booking.id)}
                              >
                                {cancelBookingMutation.isPending ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <X className="mr-2 h-4 w-4" />
                                )}
                                Cancel
                              </Button>
                            )}
                            {booking.status === 'completed' && (
                              <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600">
                                <BadgeCheck className="mr-2 h-4 w-4" />
                                Completed
                              </Button>
                            )}
                            {booking.status === 'cancelled' && (
                              <Button variant="outline" disabled className="opacity-50">
                                Cancelled
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center text-center">
                    <Car className="h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
                    <p className="text-gray-500 mb-4">You haven't booked any parking spaces yet.</p>
                    <Button onClick={() => navigate('/search')}>
                      Find Parking
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
