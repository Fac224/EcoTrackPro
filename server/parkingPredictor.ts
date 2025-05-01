import { storage } from './storage';
import { Driveway } from '@shared/schema';

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
    return `Yes, there is parking available at ${space.address} for $${space.price.toFixed(2)} per hour.`;
  } else {
    let response = "Yes, there are several parking spaces available:\n";
    availableSpaces.forEach((space, index) => {
      response += `${index + 1}. ${space.address} for $${space.price.toFixed(2)} per hour\n`;
    });
    return response;
  }
}

/**
 * Handle a user's parking availability query
 * @param userQuery Natural language query about parking
 * @returns Response string
 */
export async function handleParkingQuery(userQuery: string): Promise<string> {
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