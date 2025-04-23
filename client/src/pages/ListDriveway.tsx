import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertDrivewaySchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MapView from "@/components/ui/map-view";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

// Omit ownerId as it will be set by the server based on the logged-in user
const drivewayFormSchema = insertDrivewaySchema.omit({ ownerId: true });

type DrivewayFormValues = z.infer<typeof drivewayFormSchema>;

export default function ListDriveway() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [coordinates, setCoordinates] = useState({ lat: 37.7749, lng: -122.4194 });
  
  // Check if user is logged in
  const { data: user, isLoading: isLoadingUser, error: userError } = useQuery({
    queryKey: ['/api/me'],
  });
  
  // Create mutation
  const createDrivewayMutation = useMutation({
    mutationFn: async (data: DrivewayFormValues) => {
      const response = await apiRequest('POST', '/api/driveways', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Driveway listed successfully",
        description: "Your driveway has been added to our listings",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/my-driveways'] });
      navigate('/dashboard');
    },
    onError: (error) => {
      toast({
        title: "Failed to list driveway",
        description: "Please check your information and try again",
        variant: "destructive",
      });
      console.error("Error listing driveway:", error);
    }
  });
  
  // Create form with default values
  const form = useForm<DrivewayFormValues>({
    resolver: zodResolver(drivewayFormSchema),
    defaultValues: {
      address: "",
      city: "",
      state: "",
      zipCode: "",
      latitude: coordinates.lat,
      longitude: coordinates.lng,
      priceHourly: 3.00,
      description: "",
      availabilityStartTime: "08:00",
      availabilityEndTime: "18:00",
      availableWeekdays: "1,2,3,4,5",
      isActive: true,
    },
  });
  
  function onSubmit(values: DrivewayFormValues) {
    // Ensure lat/lng from the map are included
    const dataToSubmit = {
      ...values,
      latitude: coordinates.lat,
      longitude: coordinates.lng,
    };
    createDrivewayMutation.mutate(dataToSubmit);
  }
  
  // Update coordinates when the map is clicked
  const handleMapClick = (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
    form.setValue('latitude', lat);
    form.setValue('longitude', lng);
  };
  
  // Days of the week checkboxes
  const daysOfWeek = [
    { value: "1", label: "Monday" },
    { value: "2", label: "Tuesday" },
    { value: "3", label: "Wednesday" },
    { value: "4", label: "Thursday" },
    { value: "5", label: "Friday" },
    { value: "6", label: "Saturday" },
    { value: "0", label: "Sunday" },
  ];
  
  // Redirect to login if not authenticated
  if (userError) {
    navigate('/login?redirect=/list-driveway');
    return null;
  }
  
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">List Your Driveway</h1>
              <p className="text-gray-500 mt-1">Rent out your unused parking space and earn extra income</p>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Driveway Details</CardTitle>
              <CardDescription>
                Provide information about your parking space to help drivers find it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Location Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Location</h3>
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="San Francisco" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="CA" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP Code</FormLabel>
                            <FormControl>
                              <Input placeholder="94105" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="mt-4">
                      <FormLabel>Pin Location on Map</FormLabel>
                      <FormDescription>
                        Click on the map to set the exact location of your driveway.
                      </FormDescription>
                      <div className="mt-2">
                        <MapView
                          latitude={coordinates.lat}
                          longitude={coordinates.lng}
                          zoom={14}
                          height="300px"
                          onMapClick={handleMapClick}
                          showMarker={true}
                        />
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        Latitude: {coordinates.lat.toFixed(6)}, Longitude: {coordinates.lng.toFixed(6)}
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Details Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Pricing & Details</h3>
                    
                    <FormField
                      control={form.control}
                      name="priceHourly"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hourly Rate ($)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              step="0.50" 
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            The amount you'll charge per hour. Most driveways in your area charge $2-$5 per hour.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your parking space. Example: Easy access driveway in quiet neighborhood, fits sedan or compact SUV." 
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator />
                  
                  {/* Availability Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Availability</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="availabilityStartTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Available From</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="availabilityEndTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Available Until</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="availableWeekdays"
                      render={({ field }) => {
                        const selectedDays = field.value ? field.value.split(',') : [];
                        
                        return (
                          <FormItem className="mt-4">
                            <FormLabel>Available Days</FormLabel>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                              {daysOfWeek.map((day) => (
                                <FormItem
                                  key={day.value}
                                  className="flex items-center space-x-2 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={selectedDays.includes(day.value)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          const newDays = [...selectedDays, day.value].sort();
                                          field.onChange(newDays.join(','));
                                        } else {
                                          const newDays = selectedDays.filter(d => d !== day.value);
                                          field.onChange(newDays.join(','));
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {day.label}
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                  
                  <div className="pt-6 flex items-center justify-end space-x-4">
                    <Button 
                      variant="outline" 
                      type="button" 
                      onClick={() => navigate('/dashboard')}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createDrivewayMutation.isPending}
                      className="px-8"
                    >
                      {createDrivewayMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Listing...
                        </>
                      ) : (
                        "List Driveway"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
