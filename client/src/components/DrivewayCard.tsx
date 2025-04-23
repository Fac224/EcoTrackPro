import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Star, StarHalf } from "lucide-react";
import { Driveway } from "@shared/schema";

interface DrivewayCardProps {
  driveway: Driveway;
  showBookButton?: boolean;
}

export function DrivewayCard({ driveway, showBookButton = true }: DrivewayCardProps) {
  // Format the price to show only 2 decimal places if needed
  const formattedPrice = driveway.priceHourly.toFixed(2).replace(/\.00$/, '');
  
  // Format availability text
  let availabilityText = "";
  if (driveway.availableWeekdays === "0,1,2,3,4,5,6") {
    availabilityText = "Available daily";
  } else if (driveway.availableWeekdays === "1,2,3,4,5") {
    availabilityText = "Weekdays only";
  } else if (driveway.availableWeekdays === "0,6") {
    availabilityText = "Weekends only";
  } else {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const availableDays = driveway.availableWeekdays.split(',').map(d => days[parseInt(d)]);
    availabilityText = `Available on ${availableDays.join(', ')}`;
  }
  
  // Format time range
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${formattedHour}${minutes === 0 ? '' : `:${minutes}`}${period}`;
  };
  
  const timeRange = `${formatTime(driveway.availabilityStartTime)} - ${formatTime(driveway.availabilityEndTime)}`;

  return (
    <Card className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 h-full flex flex-col">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        <div className="text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
      </div>
      
      <CardContent className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{driveway.address}</h3>
          <Badge className="bg-emerald-500 hover:bg-emerald-600">${formattedPrice}/hr</Badge>
        </div>
        
        <p className="text-gray-500 mb-3 flex items-center">
          <MapPin className="mr-2 h-4 w-4 text-gray-400" />
          {driveway.city}, {driveway.state} {driveway.zipCode}
        </p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Calendar className="mr-2 h-4 w-4" />
          <span>{availabilityText}, {timeRange}</span>
        </div>
        
        <div className="mt-auto flex justify-between items-center">
          <div className="flex items-center text-amber-500">
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
            <StarHalf className="h-4 w-4 fill-current" />
            <span className="ml-1 text-sm text-gray-500">(4.5)</span>
          </div>
          
          {showBookButton && (
            <Link href={`/driveways/${driveway.id}`}>
              <Button variant="link" className="text-primary hover:text-blue-600 font-medium p-0">
                View details
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default DrivewayCard;
