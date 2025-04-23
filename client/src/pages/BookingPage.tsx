import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertBookingSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Driveway } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  Car, 
  ArrowRight, 
  CheckCircle,
  Info
} from "lucide-react";
import { 
  formatCurrency, 
  formatDate, 
  combineDateAndTime,
  calculateTotalPrice, 
  generateTimeSlots, 
  formatTimeString,
  isDayAvailable
} from "@/lib/utils";

// Modified booking schema for form input
const bookingFormSchema = z.object({
  date: z.string({
    required_error: "Please select a date",
  }),
  startTime: z.string({
    required_error: "Please select a start time",
  }),
  endTime: z.string({
    required_error: "Please select an end time",
  }),
}).refine(
  (data) => data.startTime < data.endTime,
  {
    message: "End time must be after start time",
    path: ["endTime"],
  }
);

type BookingFormValues = z.infer<typeof bookingFormSchema>;

export default function BookingPage() {
  const params = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [bookingComplete, setBookingComplete] = useState(false);
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
  const { data: driveway, isLoading: isLoadingDriveway, error: drivewayError } = useQuery<Driveway>({
    queryKey: [`/api/driveways/${drivewayId}`],
    enabled: !isNaN(drivewayId),
  });
  
  // Check if user is logged in
  const { data: user, isLoading: isLoadingUser, error: userError } = useQuery({
    queryKey: ['/api/me'],
  });
  
  // Create form with default values
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      date: "",
      startTime: "",
      endTime: "",
    },
  });
  
  // Calculate time slots based on driveway availability
  const availableTimeSlots = driveway 
    ? generateTimeSlots(driveway.availabilityStartTime, driveway.availabilityEndTime, 30)
    : [];
  
  // Calculate price based on form values
  const startTime = form.watch("startTime");
  const endTime = form.watch("endTime");
  const date = form.watch("date");
  
  const calculatePrice = () => {
    if (!driveway || !startTime || !endTime || !date) return 0;
    
    const startDateTime = combineDateAndTime(date, startTime);
    const endDateTime = combineDateAndTime(date, endTime);
    
    return calculateTotalPrice(driveway.priceHourly, startDateTime, endDateTime);
  };
  
  const totalPrice = calculatePrice();
  
  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: async (data: {
      drivewayId: number;
      startTime: Date;
      endTime: Date;
      totalPrice: number;
    }) => {
      const response = await apiRequest('POST', '/api/bookings', data);
      return response.json();
    },
    onSuccess: () => {
      setBookingComplete(true);
      queryClient.invalidateQueries({ queryKey: ['/api/my-bookings'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to create booking",
        description: "Please try again later",
        variant: "destructive",
      });
      console.error("Error creating booking:", error);
    },
  });
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (userError) {
      navigate(`/login?redirect=/book/${drivewayId}`);
    }
  }, [userError, navigate, drivewayId]);
  
  function onSubmit(values: BookingFormValues) {
    if (!driveway) return;
    
    const startDateTime = combineDateAndTime(values.date, values.startTime);
    const endDateTime = combineDateAndTime(values.date, values.endTime);
    
    // Check if the selected date is available based on weekdays
    if (!isDayAvailable(startDateTime, driveway.availableWeekdays)) {
      toast({
        title: "Invalid date selected",
        description: "This driveway is not available on the selected day",
        variant: "destructive",
      });
      return;
    }
    
    const bookingData = {
      drivewayId: driveway.id,
      startTime: startDateTime,
      endTime: endDateTime,
      totalPrice: calculateTotalPrice(driveway.priceHourly, startDateTime, endDateTime),
    };
    
    createBookingMutation.mutate(bookingData);
  }
  
  if (isLoadingDriveway || isLoadingUser) {
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
  
  if (drivewayError || !driveway) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex justify-center items-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 pb-6 text-center">
              <Info className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Driveway Not Found</h2>
              <p className="text-gray-500 mb-6">The driveway you're trying to book doesn't exist or has been removed.</p>
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
  
  // Show booking confirmation
  if (bookingComplete) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex justify-center items-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 pb-6 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
              <p className="text-gray-500 mb-6">
                Your parking space has been reserved successfully. You can view your booking details in your dashboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => navigate('/dashboard')}>
                  View My Bookings
                </Button>
                <Button variant="outline" onClick={() => navigate('/')}>
                  Return to Home
                </Button>
              </div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Book Your Parking Space</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Select Date & Time</CardTitle>
                  <CardDescription>
                    Choose when you'll need this parking space
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                min={new Date().toISOString().split('T')[0]}
                              />
                            </FormControl>
                            <FormDescription>
                              Select the date you need parking
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="startTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Time</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select start time" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {availableTimeSlots.map((time) => (
                                    <SelectItem key={`start-${time}`} value={time}>
                                      {formatTimeString(time)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="endTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Time</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select end time" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {availableTimeSlots.map((time) => (
                                    <SelectItem 
                                      key={`end-${time}`} 
                                      value={time}
                                      disabled={startTime && time <= startTime}
                                    >
                                      {formatTimeString(time)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <div className="flex items-start">
                          <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                          <div>
                            <h3 className="font-medium text-blue-800">Booking Guidelines</h3>
                            <ul className="mt-2 text-sm text-blue-700 space-y-1">
                              <li>• Arrive on time for your booking</li>
                              <li>• Follow any parking instructions from the host</li>
                              <li>• Cancellations are free up to 24 hours before</li>
                              <li>• You'll only be charged after your booking is confirmed</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 flex justify-end">
                        <Button
                          type="submit"
                          className="px-8"
                          disabled={createBookingMutation.isPending || !startTime || !endTime || !date}
                        >
                          {createBookingMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              Complete Booking
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
            
            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Driveway Details</h3>
                    <div className="flex items-start mb-2">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">{driveway.address}</p>
                        <p className="text-gray-500">{driveway.city}, {driveway.state} {driveway.zipCode}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                      <p className="text-gray-900">
                        {formatCurrency(driveway.priceHourly)} per hour
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {(date && startTime && endTime) ? (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Selected Time</h3>
                      <div className="flex items-center mb-2">
                        <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                        <p className="text-gray-900">
                          {formatDate(date)}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-gray-400 mr-2" />
                        <p className="text-gray-900">
                          {formatTimeString(startTime)} <ArrowRight className="inline h-3 w-3 mx-1" /> {formatTimeString(endTime)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500">
                        Select a date and time to see your booking summary
                      </p>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Price Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <p className="text-gray-500">Parking fee</p>
                        <p className="text-gray-900">{totalPrice > 0 ? formatCurrency(totalPrice) : '-'}</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-gray-500">Service fee</p>
                        <p className="text-gray-900">{totalPrice > 0 ? formatCurrency(totalPrice * 0.1) : '-'}</p>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-medium">
                        <p className="text-gray-900">Total</p>
                        <p className="text-gray-900">{totalPrice > 0 ? formatCurrency(totalPrice * 1.1) : '-'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t border-gray-100 px-6 py-4 text-sm text-gray-500">
                  You won't be charged until your booking is confirmed
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
