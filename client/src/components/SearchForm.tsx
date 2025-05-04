import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { searchSchema } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Clock, Search } from "lucide-react";
import MapSearchModal from "./MapSearchModal";

const searchFormSchema = searchSchema.extend({
  date: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

interface SearchFormProps {
  useModal?: boolean;
}

export function SearchForm({ useModal = true }: SearchFormProps) {
  const [, navigate] = useLocation();
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useState<{
    location: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    latitude?: number;
    longitude?: number;
  }>({
    location: "your location",
    date: "",
    startTime: "",
    endTime: ""
  });
  
  // Create form
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      location: "",
      date: "",
      startTime: "",
      endTime: "",
    },
  });

  // Time options for dropdowns
  const timeOptions = Array.from({ length: 24 * 4 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    const period = hour < 12 ? "AM" : "PM";
    const formattedHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const formattedMinute = minute.toString().padStart(2, "0");
    return {
      value: `${hour.toString().padStart(2, "0")}:${formattedMinute}`,
      label: `${formattedHour}:${formattedMinute} ${period}`,
    };
  });

  function onSubmit(values: SearchFormValues) {
    if (useModal) {
      // Open map modal with search parameters
      // Ensure location is a non-empty string for the map modal
      const modalParams = {
        location: values.location || "your location",
        date: values.date,
        startTime: values.startTime,
        endTime: values.endTime
      };
      
      setSearchParams(modalParams);
      setIsMapModalOpen(true);
    } else {
      // Traditional navigation to search page with query params
      const params = new URLSearchParams();
      
      if (values.location) params.append("location", values.location);
      if (values.date) params.append("date", values.date);
      if (values.startTime) params.append("startTime", values.startTime);
      if (values.endTime) params.append("endTime", values.endTime);
      
      navigate(`/search?${params.toString()}`);
    }
  }

  return (
    <>
      <Card className="bg-white rounded-xl shadow-md border border-gray-200">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-4">
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
              
              <div className="grid grid-cols-2 gap-2">
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
                          <SelectItem value="any_time">Any time</SelectItem>
                          {timeOptions.map((time) => (
                            <SelectItem key={time.value} value={time.value}>
                              {time.label}
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
                          <SelectItem value="any_time">Any time</SelectItem>
                          {timeOptions.map((time) => (
                            <SelectItem key={time.value} value={time.value}>
                              {time.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Button type="submit" className="w-full bg-primary text-white h-12 text-base">
                <Search className="mr-2 h-5 w-5" />
                Find Parking
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Map Modal */}
      <MapSearchModal 
        isOpen={isMapModalOpen} 
        onClose={() => setIsMapModalOpen(false)} 
        searchParams={searchParams} 
      />
    </>
  );
}

export default SearchForm;
