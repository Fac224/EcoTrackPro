import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Driveway } from "@shared/schema";
import { Loader2, MapPin, Calendar, Clock, Search as SearchIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { searchSchema } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MapView from "@/components/ui/map-view";
import DrivewayCard from "@/components/DrivewayCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { generateTimeSlots, formatDate, formatTimeString } from "@/lib/utils";

const searchFormSchema = searchSchema.extend({
  date: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

export default function Search() {
  const [, navigate] = useLocation();
  const [location] = useLocation();
  const [showMap, setShowMap] = useState(false);
  
  // Parse URL query params
  const params = new URLSearchParams(location.search);
  const locationParam = params.get("location") || "";
  const dateParam = params.get("date") || "";
  const startTimeParam = params.get("startTime") || "";
  const endTimeParam = params.get("endTime") || "";
  
  // Time options for dropdowns
  const timeSlots = generateTimeSlots("00:00", "23:30");
  
  // Create form with values from URL
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      location: locationParam,
      date: dateParam,
      startTime: startTimeParam,
      endTime: endTimeParam,
    },
  });
  
  // Watch form values for query
  const location_query = form.watch("location");
  const date_query = form.watch("date");
  const startTime_query = form.watch("startTime");
  const endTime_query = form.watch("endTime");
  
  // Build query params for API
  const queryParams: Record<string, string> = {};
  if (location_query) queryParams.location = location_query;
  if (date_query) queryParams.date = date_query;
  if (startTime_query) queryParams.startTime = startTime_query;
  if (endTime_query) queryParams.endTime = endTime_query;
  
  // Construct query string
  const queryString = new URLSearchParams(queryParams).toString();
  
  // Fetch driveways based on search criteria
  const { data: driveways, isLoading, error } = useQuery<Driveway[]>({
    queryKey: [`/api/driveways/search?${queryString}`],
    enabled: !!queryString,
  });
  
  // Fetch all driveways if no search criteria
  const { data: allDriveways, isLoading: isLoadingAll } = useQuery<Driveway[]>({
    queryKey: ['/api/driveways'],
    enabled: !queryString,
  });
  
  // Use either filtered or all driveways
  const displayDriveways = queryString ? driveways : allDriveways;

  function onSubmit(values: SearchFormValues) {
    // Build query string from form values
    const params = new URLSearchParams();
    
    if (values.location) params.append("location", values.location);
    if (values.date) params.append("date", values.date);
    if (values.startTime) params.append("startTime", values.startTime);
    if (values.endTime) params.append("endTime", values.endTime);
    
    // Navigate to search results page with query params
    navigate(`/search?${params.toString()}`);
  }
  
  // Reset search form
  const handleReset = () => {
    form.reset({
      location: "",
      date: "",
      startTime: "",
      endTime: "",
    });
    navigate("/search");
  };
  
  // Date formatting for display
  const formatSearchDate = (dateString: string) => {
    if (!dateString) return "";
    return formatDate(new Date(dateString));
  };
  
  // Toggle map view
  const toggleMapView = () => {
    setShowMap(!showMap);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow">
        {/* Search Form */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-0 md:grid md:grid-cols-5 md:gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <FormControl>
                        <Input
                          placeholder="Where do you need parking?"
                          className="pl-10"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <FormControl>
                        <Input
                          type="date"
                          className="pl-10"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger className="pl-10">
                            <SelectValue placeholder="From" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Any time</SelectItem>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
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
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="To" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Any time</SelectItem>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {formatTimeString(time)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex space-x-2">
                  <Button type="submit" className="w-full">
                    <SearchIcon className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                  {(location_query || date_query || startTime_query || endTime_query) && (
                    <Button type="button" variant="outline" onClick={handleReset}>
                      Reset
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </div>
        
        {/* Results Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {queryString ? 'Search Results' : 'Available Parking Spaces'}
              </h1>
              {queryString && (
                <div className="mt-1 text-sm text-gray-500">
                  {location_query && <span className="mr-3">Location: {location_query}</span>}
                  {date_query && <span className="mr-3">Date: {formatSearchDate(date_query)}</span>}
                  {startTime_query && <span className="mr-3">From: {formatTimeString(startTime_query)}</span>}
                  {endTime_query && <span>To: {formatTimeString(endTime_query)}</span>}
                </div>
              )}
            </div>
            <Button 
              variant="outline" 
              onClick={toggleMapView}
              className="hidden md:flex"
            >
              {showMap ? 'List View' : 'Map View'}
            </Button>
          </div>
          
          {/* Map View Toggle (Mobile) */}
          <div className="md:hidden mb-4">
            <Button 
              variant="outline" 
              onClick={toggleMapView}
              className="w-full"
            >
              {showMap ? 'Switch to List View' : 'Switch to Map View'}
            </Button>
          </div>
          
          {isLoading || isLoadingAll ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-500">Error loading driveways. Please try again later.</p>
            </div>
          ) : displayDriveways && displayDriveways.length > 0 ? (
            showMap ? (
              <div className="rounded-lg overflow-hidden shadow-md border border-gray-200">
                <MapView
                  latitude={37.7749}
                  longitude={-122.4194}
                  zoom={12}
                  height="600px"
                  markers={displayDriveways.map(driveway => ({
                    lat: driveway.latitude,
                    lng: driveway.longitude,
                    title: `$${driveway.priceHourly.toFixed(2)}/hr`,
                    onClick: () => navigate(`/driveways/${driveway.id}`)
                  }))}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayDriveways.map((driveway) => (
                  <DrivewayCard key={driveway.id} driveway={driveway} />
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
              <SearchIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No parking spaces found</h3>
              <p className="text-gray-500 mb-6">
                {queryString 
                  ? "Try adjusting your search criteria or selecting different dates/times." 
                  : "There are no parking spaces available at the moment."}
              </p>
              {queryString && (
                <Button onClick={handleReset}>
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
