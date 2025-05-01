import { storage } from './storage';
import { Driveway } from '@shared/schema';

// Enhanced mock data for providing more detailed parking information
// This can be used alongside actual database data
const MOCK_PARKING_DATA = {
  parkingSpaces: [
    {
      address: "123 Main St, Anytown, USA",
      price: 10.00,
      availableFrom: "2024-07-29 08:00",
      availableTo: "2024-07-29 22:00",
      description: "Private driveway near downtown.",
      latitude: 34.0522,
      longitude: -118.2437,
    },
    {
      address: "456 Oak Ave, Anytown, USA",
      price: 15.00,
      availableFrom: "2024-07-29 10:00",
      availableTo: "2024-07-29 18:00",
      description: "Spacious spot, close to the stadium.",
      latitude: 34.0589,
      longitude: -118.2515,
    },
    {
      address: "789 Pine Ln, Anytown, USA",
      price: 12.50,
      availableFrom: "2024-07-29 09:00",
      availableTo: "2024-07-29 20:00",
      description: "Covered parking in quiet neighborhood.",
      latitude: 34.0631,
      longitude: -118.2375,
    },
    {
      address: "321 Elm St, Anytown, USA",
      price: 8.00,
      availableFrom: "2024-07-30 07:00",
      availableTo: "2024-07-30 19:00",
      description: "Economy parking with easy access.",
      latitude: 34.0550,
      longitude: -118.2500,
    }
  ],
  bookings: {} as Record<string, {
    userId: number | string;
    spaceId: string;
    startTime: string;
    endTime: string;
    price: number;
  }>,
  supportContact: "support@easypark.com",
};

interface ParkingSpace {
  address: string;
  price: number;
  availableFrom: Date;
  availableTo: Date;
  ownerId: number;
  drivewayId: number;
}

/**
 * Extract location information from a user query
 * @param userQuery The user's natural language query
 * @returns The extracted location
 */
export function extractLocation(userQuery: string): string {
  const lowercaseQuery = userQuery.toLowerCase();
  
  // Location extraction similar to the Python code
  const locationKeywords = ["near", "around", "at", "in"];
  for (const keyword of locationKeywords) {
    if (lowercaseQuery.includes(keyword)) {
      const parts = lowercaseQuery.split(keyword);
      if (parts.length > 1) {
        return parts[1].trim().split(" ")[0]; // Get the word after the keyword
      }
    }
  }
  
  if (lowercaseQuery.includes("address")) {
    const parts = lowercaseQuery.split("address");
    if (parts.length > 1) {
      return parts[1].trim().split(" ")[0];
    }
  }
  
  // Default location if none found
  return "downtown";
}

/**
 * Extract date information from a user query
 * @param userQuery The user's natural language query
 * @returns A Date object for the extracted date
 */
export function extractDate(userQuery: string): Date {
  const lowercaseQuery = userQuery.toLowerCase();
  
  // Check for "tomorrow" or "today"
  if (lowercaseQuery.includes("tomorrow")) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  } else if (lowercaseQuery.includes("today")) {
    return new Date();
  }
  
  // Check for date pattern (DD/MM/YYYY)
  const datePattern = /(\d{1,2}\/\d{1,2}\/\d{4})/;
  const match = lowercaseQuery.match(datePattern);
  if (match) {
    try {
      const [month, day, year] = match[1].split('/').map(num => parseInt(num, 10));
      return new Date(year, month - 1, day);
    } catch (error) {
      console.error("Error parsing date:", error);
      return new Date(); // Default to today if parsing fails
    }
  }
  
  // Default to today if no date found
  return new Date();
}

/**
 * Extract time information from a user query
 * @param userQuery The user's natural language query
 * @returns A tuple containing start and end times as Date objects, or null if none found
 */
export function extractTime(userQuery: string): [Date | null, Date | null] {
  const lowercaseQuery = userQuery.toLowerCase();
  
  // Find time-related segments
  const timeKeywords = ["at", "between", "from", "to"];
  let foundTimeStr = null;
  
  for (const keyword of timeKeywords) {
    if (lowercaseQuery.includes(keyword)) {
      const parts = lowercaseQuery.split(keyword);
      if (parts.length > 1) {
        foundTimeStr = parts[1];
        break;
      }
    }
  }
  
  if (!foundTimeStr) {
    return [null, null];
  }
  
  // Extract times from the time string (support both 12-hour and 24-hour formats)
  const timePattern = /(\d{1,2}(?::\d{2})?(?:[ap]m)?)/gi;
  const times = foundTimeStr.match(timePattern);
  
  if (!times || times.length === 0) {
    return [null, null];
  }
  
  try {
    if (times.length === 1) {
      const timeObj = parseTimeString(times[0]);
      
      // Assume today's date
      const today = new Date();
      const startTime = new Date(today);
      startTime.setHours(timeObj.hours);
      startTime.setMinutes(timeObj.minutes);
      startTime.setSeconds(0);
      
      // Default end time is 2 hours later
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 2);
      
      return [startTime, endTime];
    } else if (times.length >= 2) {
      const startTimeObj = parseTimeString(times[0]);
      const endTimeObj = parseTimeString(times[1]);
      
      const today = new Date();
      
      const startTime = new Date(today);
      startTime.setHours(startTimeObj.hours);
      startTime.setMinutes(startTimeObj.minutes);
      startTime.setSeconds(0);
      
      const endTime = new Date(today);
      endTime.setHours(endTimeObj.hours);
      endTime.setMinutes(endTimeObj.minutes);
      endTime.setSeconds(0);
      
      return [startTime, endTime];
    }
  } catch (error) {
    console.error("Error parsing time:", error);
  }
  
  return [null, null];
}

/**
 * Helper function to parse time strings in various formats
 * @param timeStr Time string to parse
 * @returns Object with hours and minutes
 */
function parseTimeString(timeStr: string): { hours: number; minutes: number } {
  // Initialize default values
  let hours = 0;
  let minutes = 0;
  
  // Normalize the time string
  const normalizedTimeStr = timeStr.toLowerCase().trim();
  
  // Handle 12-hour format with AM/PM
  if (normalizedTimeStr.includes('am') || normalizedTimeStr.includes('pm')) {
    const isPM = normalizedTimeStr.includes('pm');
    const timeDigits = normalizedTimeStr.replace(/[^0-9:]/g, '');
    
    if (timeDigits.includes(':')) {
      // Format: 1:30pm or 11:45am
      const [hourStr, minuteStr] = timeDigits.split(':');
      hours = parseInt(hourStr, 10);
      minutes = parseInt(minuteStr, 10);
    } else {
      // Format: 3pm or 10am
      hours = parseInt(timeDigits, 10);
      minutes = 0;
    }
    
    // Adjust for PM
    if (isPM && hours < 12) {
      hours += 12;
    }
    // Adjust for 12 AM which should be 0 hours
    if (!isPM && hours === 12) {
      hours = 0;
    }
  } else {
    // Handle 24-hour format
    if (normalizedTimeStr.includes(':')) {
      // Format: 13:30 or 08:45
      const [hourStr, minuteStr] = normalizedTimeStr.split(':');
      hours = parseInt(hourStr, 10);
      minutes = parseInt(minuteStr, 10);
    } else {
      // Format: 14 or 8 (just the hour)
      hours = parseInt(normalizedTimeStr, 10);
      minutes = 0;
    }
  }
  
  // Validate the values
  if (isNaN(hours) || hours < 0 || hours > 23) {
    hours = 0;
  }
  if (isNaN(minutes) || minutes < 0 || minutes > 59) {
    minutes = 0;
  }
  
  return { hours, minutes };
}

/**
 * Get available parking spaces from storage based on location and time
 * @param location Location string
 * @param startTime Start time as Date object
 * @param endTime End time as Date object
 * @returns Array of available parking spaces
 */
export async function getAvailableParkingSpaces(
  location: string,
  startTime: Date,
  endTime: Date
): Promise<ParkingSpace[]> {
  // Get all driveways from storage
  const allDriveways = await storage.getAllDriveways();
  
  // Filter driveways based on location first
  const locationFilteredDriveways = allDriveways.filter(driveway => {
    return (
      driveway.address.toLowerCase().includes(location.toLowerCase()) ||
      driveway.city.toLowerCase().includes(location.toLowerCase()) ||
      driveway.state.toLowerCase().includes(location.toLowerCase()) ||
      driveway.zipCode.includes(location)
    );
  });
  
  // Convert to ParkingSpace format
  const availableSpaces: ParkingSpace[] = [];
  
  for (const driveway of locationFilteredDriveways) {
    // Check if the driveway is available on this day of the week
    const dayOfWeek = startTime.getDay().toString();
    const availableDays = driveway.availableWeekdays.split(',');
    
    if (!availableDays.includes(dayOfWeek)) {
      continue; // Skip if not available on this day
    }
    
    // Parse availability time ranges
    const [startHour, startMinute] = driveway.availabilityStartTime.split(':').map(Number);
    const [endHour, endMinute] = driveway.availabilityEndTime.split(':').map(Number);
    
    // Create Date objects for availability
    const availableFrom = new Date(startTime);
    availableFrom.setHours(startHour, startMinute, 0, 0);
    
    const availableTo = new Date(endTime);
    availableTo.setHours(endHour, endMinute, 0, 0);
    
    // Check if requested time range falls within availability
    if (
      availableFrom.getTime() <= startTime.getTime() && 
      availableTo.getTime() >= endTime.getTime()
    ) {
      availableSpaces.push({
        address: `${driveway.address}, ${driveway.city}, ${driveway.state} ${driveway.zipCode}`,
        price: driveway.priceHourly,
        availableFrom,
        availableTo,
        ownerId: driveway.ownerId,
        drivewayId: driveway.id
      });
    }
  }
  
  // Also check the mock data for additional parking options
  const lowercaseLocation = location.toLowerCase();
  for (const mockSpace of MOCK_PARKING_DATA.parkingSpaces) {
    const mockAddress = mockSpace.address.toLowerCase();
    
    // Check if location is mentioned in the address
    if (mockAddress.includes(lowercaseLocation) || 
        (lowercaseLocation === "downtown" && mockAddress.includes("main"))) {
      
      // Parse mock data time strings
      const mockFrom = new Date(mockSpace.availableFrom);
      const mockTo = new Date(mockSpace.availableTo);
      
      // Check date - compare year, month, and day
      const isSameDay = 
        mockFrom.getFullYear() === startTime.getFullYear() &&
        mockFrom.getMonth() === startTime.getMonth() &&
        mockFrom.getDate() === startTime.getDate();
      
      // Only include if dates match and time range works
      if (isSameDay && 
          mockFrom.getTime() <= startTime.getTime() && 
          mockTo.getTime() >= endTime.getTime()) {
        
        availableSpaces.push({
          address: mockSpace.address,
          price: mockSpace.price,
          availableFrom: mockFrom,
          availableTo: mockTo,
          ownerId: 999, // Special ID for mock data
          drivewayId: 999 // Special ID for mock data
        });
      }
    }
  }
  
  return availableSpaces;
}

/**
 * Format parking response based on available spaces
 * @param availableSpaces Array of available parking spaces
 * @returns Formatted response string
 */
export function formatParkingResponse(availableSpaces: ParkingSpace[]): string {
  if (!availableSpaces || availableSpaces.length === 0) {
    return "No, there is no parking available at that time and location.";
  } else if (availableSpaces.length === 1) {
    const space = availableSpaces[0];
    // Find description for mock parking spaces
    let description = "";
    if (space.ownerId === 999) {
      // This is from mock data, find the description
      const mockSpace = MOCK_PARKING_DATA.parkingSpaces.find(ms => 
        ms.address === space.address && 
        ms.price === space.price
      );
      if (mockSpace && mockSpace.description) {
        description = ` (${mockSpace.description})`;
      }
    }
    
    const formattedPrice = space.price.toFixed(2);
    const hours = Math.round((space.availableTo.getTime() - space.availableFrom.getTime()) / (1000 * 60 * 60));
    const availability = `Available for ${hours} hours`;
    
    return `Yes, there is parking available at ${space.address} for $${formattedPrice} per hour${description}. ${availability}.`;
  } else {
    let response = "Yes, there are several parking spaces available:\n";
    availableSpaces.forEach((space, index) => {
      // Check if this is from mock data and get description
      let details = "";
      if (space.ownerId === 999) {
        const mockSpace = MOCK_PARKING_DATA.parkingSpaces.find(ms => 
          ms.address === space.address && 
          ms.price === space.price
        );
        if (mockSpace && mockSpace.description) {
          details = ` - ${mockSpace.description}`;
        }
      }
      
      const formattedPrice = space.price.toFixed(2);
      response += `${index + 1}. ${space.address} for $${formattedPrice} per hour${details}\n`;
    });
    
    response += "\nFor more details or to book a space, please use the search functionality on our website.";
    return response;
  }
}

/**
 * Extract an address from a booking query
 * @param userQuery The user's query
 * @returns The extracted address or null if none found
 */
export function extractAddressFromBookingQuery(userQuery: string): string | null {
  const lowercaseQuery = userQuery.toLowerCase();
  const addressKeywords = ["at", "space at", "parking at"];
  
  for (const keyword of addressKeywords) {
    if (lowercaseQuery.includes(keyword)) {
      const parts = lowercaseQuery.split(keyword);
      if (parts.length > 1) {
        // Try to get the address part before "for" if it exists
        const addressPart = parts[1].split("for")[0].trim();
        if (addressPart) {
          return addressPart;
        }
      }
    }
  }
  
  return null;
}

/**
 * Extract a booking ID from a query
 * @param userQuery The user's query
 * @returns The extracted booking ID or null if none found
 */
export function extractBookingId(userQuery: string): string | null {
  const lowercaseQuery = userQuery.toLowerCase();
  const bookingIdKeywords = ["booking id", "booking number", "cancel booking"];
  
  for (const keyword of bookingIdKeywords) {
    if (lowercaseQuery.includes(keyword)) {
      const parts = lowercaseQuery.split(keyword);
      if (parts.length > 1) {
        // Try to get the first word after the keyword
        const words = parts[1].trim().split(/\s+/);
        if (words.length > 0 && words[0]) {
          return words[0];
        }
      }
    }
  }
  
  return null;
}

/**
 * Generate a unique booking ID
 * @returns A UUID string
 */
function generateBookingId(): string {
  // Simple UUID generation - in production you might want to use a library like uuid
  return 'book_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

/**
 * Book a parking space
 * @param address The address of the parking space
 * @param userId The ID of the user making the booking
 * @returns An object with the booking details or null if booking failed
 */
export function bookParkingSpace(address: string, userId: number | string): { 
  bookingId: string; 
  address: string; 
  price: number; 
  startTime: string; 
  endTime: string; 
} | null {
  // Find the parking space in our mock data
  const spaceToBook = MOCK_PARKING_DATA.parkingSpaces.find(space => 
    space.address.toLowerCase().includes(address.toLowerCase())
  );
  
  if (!spaceToBook) {
    return null;
  }
  
  // Generate a booking ID
  const bookingId = generateBookingId();
  
  // Use the current time plus 1 hour for start time and add 2 hours for end time
  const startTime = new Date();
  startTime.setHours(startTime.getHours() + 1); // Start in 1 hour
  
  const endTime = new Date(startTime);
  endTime.setHours(endTime.getHours() + 2); // End 2 hours after start
  
  // Format times for storage
  const startTimeStr = startTime.toISOString();
  const endTimeStr = endTime.toISOString();
  
  // Store the booking
  MOCK_PARKING_DATA.bookings[bookingId] = {
    userId: userId,
    spaceId: spaceToBook.address,
    startTime: startTimeStr,
    endTime: endTimeStr,
    price: spaceToBook.price
  };
  
  return {
    bookingId,
    address: spaceToBook.address,
    price: spaceToBook.price,
    startTime: startTimeStr,
    endTime: endTimeStr
  };
}

/**
 * Cancel a booking
 * @param bookingId The ID of the booking to cancel
 * @returns True if successful, false otherwise
 */
export function cancelBooking(bookingId: string): boolean {
  if (bookingId in MOCK_PARKING_DATA.bookings) {
    delete MOCK_PARKING_DATA.bookings[bookingId];
    return true;
  }
  return false;
}

/**
 * Get a user's bookings
 * @param userId The ID of the user
 * @returns An array of booking details
 */
export function getUserBookings(userId: number | string): Array<{
  bookingId: string;
  address: string;
  startTime: string;
  endTime: string;
  price: number;
}> {
  const userBookings: Array<{
    bookingId: string;
    address: string;
    startTime: string;
    endTime: string;
    price: number;
  }> = [];
  
  for (const [bookingId, booking] of Object.entries(MOCK_PARKING_DATA.bookings)) {
    if (booking.userId === userId) {
      userBookings.push({
        bookingId,
        address: booking.spaceId,
        startTime: booking.startTime,
        endTime: booking.endTime,
        price: booking.price
      });
    }
  }
  
  return userBookings;
}

/**
 * Handle a user's parking availability query
 * @param userQuery Natural language query about parking
 * @param userId Optional user ID for booking functionality
 * @returns Response string
 */
export async function handleParkingQuery(userQuery: string, userId?: number | string): Promise<string> {
  const lowercaseQuery = userQuery.toLowerCase();
  
  // Check if this is a booking request
  if (lowercaseQuery.includes("book") || lowercaseQuery.includes("reserve")) {
    // Extract address from booking query
    const address = extractAddressFromBookingQuery(userQuery);
    if (!address) {
      return "I couldn't find an address in your booking request. Please specify where you want to park, like 'Book a space at 123 Main St'.";
    }
    
    // Check if user is logged in
    if (!userId) {
      return "To make a booking, please log in first or create an account.";
    }
    
    // Book the parking space
    const bookingResult = bookParkingSpace(address, userId);
    if (!bookingResult) {
      return `Sorry, I couldn't find a parking space at ${address}.`;
    }
    
    // Format the booking confirmation
    const startTime = new Date(bookingResult.startTime);
    const endTime = new Date(bookingResult.endTime);
    const formattedStart = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedEnd = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedDate = startTime.toLocaleDateString();
    
    return `Great! I've booked a parking space at ${bookingResult.address} for you on ${formattedDate} from ${formattedStart} to ${formattedEnd}. Your booking ID is ${bookingResult.bookingId} and the total cost is $${(bookingResult.price * 2).toFixed(2)}.`;
  }
  
  // Check if this is a cancellation request
  if (lowercaseQuery.includes("cancel")) {
    const bookingId = extractBookingId(userQuery);
    if (!bookingId) {
      return "To cancel a booking, please provide your booking ID. For example, 'Cancel my booking ABC123'.";
    }
    
    const cancelResult = cancelBooking(bookingId);
    if (cancelResult) {
      return `Your booking ${bookingId} has been successfully cancelled.`;
    } else {
      return `I couldn't find booking ${bookingId}. Please check your booking ID and try again.`;
    }
  }
  
  // Check if user is asking about their bookings
  if (lowercaseQuery.includes("my booking") || lowercaseQuery.includes("my reservation") ||
      lowercaseQuery.includes("booking id") || lowercaseQuery.includes("show my booking")) {
    if (!userId) {
      return "To view your bookings, please log in first.";
    }
    
    const userBookings = getUserBookings(userId);
    if (userBookings.length === 0) {
      return "You don't have any active bookings.";
    }
    
    let response = "Here are your current bookings:\n";
    userBookings.forEach((booking, index) => {
      const startTime = new Date(booking.startTime);
      const endTime = new Date(booking.endTime);
      response += `${index + 1}. Booking ID: ${booking.bookingId}\n   Location: ${booking.address}\n   Time: ${startTime.toLocaleString()} to ${endTime.toLocaleString()}\n   Price: $${booking.price.toFixed(2)}\n\n`;
    });
    
    return response;
  }
  
  // Handle parking availability search queries
  if (lowercaseQuery.includes("parking") || lowercaseQuery.includes("available") || 
      lowercaseQuery.includes("find") || lowercaseQuery.includes("where can i park")) {
    // Extract information from the query
    const location = extractLocation(userQuery);
    const date = extractDate(userQuery);
    const [startTime, endTime] = extractTime(userQuery);
    
    // Set up default times if none specified
    let queryStartTime: Date;
    let queryEndTime: Date;
    
    if (startTime && endTime) {
      // Use extracted times but keep the date from the date extraction
      queryStartTime = new Date(date);
      queryStartTime.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
      
      queryEndTime = new Date(date);
      queryEndTime.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);
    } else {
      // Default to whole day if no specific times
      queryStartTime = new Date(date);
      queryStartTime.setHours(0, 0, 0, 0);
      
      queryEndTime = new Date(date);
      queryEndTime.setHours(23, 59, 59, 999);
    }
    
    // Get available parking spaces
    const availableSpaces = await getAvailableParkingSpaces(location, queryStartTime, queryEndTime);
    
    // Format and return the response
    return formatParkingResponse(availableSpaces);
  }
  
  // Handle customer support queries
  if (lowercaseQuery.includes("support") || lowercaseQuery.includes("help") || 
      lowercaseQuery.includes("contact")) {
    return `For customer support, please contact us at ${MOCK_PARKING_DATA.supportContact} or use the "Contact Us" form on our website.`;
  }
  
  // Default response for unrecognized queries
  return "I can help you find available parking, make bookings, check your existing bookings, or cancel reservations. Try asking 'Is there parking near downtown?', 'Book a space at 123 Main St', or 'Show my bookings'.";
}