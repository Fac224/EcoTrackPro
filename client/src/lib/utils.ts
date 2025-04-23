import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, addHours } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency to USD
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

// Format date to readable format
export function formatDate(date: Date | string): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return format(dateObj, 'PPP'); // e.g. April 1, 2023
}

// Format time to readable format
export function formatTime(date: Date | string): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return format(dateObj, 'h:mm a'); // e.g. 2:30 PM
}

// Format weekday hours
export function formatWeekdayHours(weekdays: string, startTime: string, endTime: string): string {
  const days = weekdays.split(',');
  const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const availableDays = days.map(day => weekdayNames[parseInt(day)]);
  
  let displayText = '';
  if (weekdays === '1,2,3,4,5') {
    displayText = 'Weekdays only';
  } else if (weekdays === '0,6') {
    displayText = 'Weekends only';
  } else if (weekdays === '0,1,2,3,4,5,6') {
    displayText = 'Available daily';
  } else {
    displayText = `Available on ${availableDays.join(', ')}`;
  }
  
  const formattedStartTime = formatTimeString(startTime);
  const formattedEndTime = formatTimeString(endTime);
  
  return `${displayText}, ${formattedStartTime} - ${formattedEndTime}`;
}

// Convert 24h time string to 12h time
export function formatTimeString(timeString: string): string {
  const [hours, minutes] = timeString.split(':');
  const h = parseInt(hours);
  const m = parseInt(minutes);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour}${m > 0 ? `:${minutes.padStart(2, '0')}` : ''} ${period}`;
}

// Calculate total price for booking
export function calculateTotalPrice(priceHourly: number, startTime: Date, endTime: Date): number {
  const durationMs = endTime.getTime() - startTime.getTime();
  const durationHours = durationMs / (1000 * 60 * 60);
  return parseFloat((priceHourly * durationHours).toFixed(2));
}

// Convert date and time strings to a Date object
export function combineDateAndTime(dateString: string, timeString: string): Date {
  const date = new Date(dateString);
  const [hours, minutes] = timeString.split(':');
  
  date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  return date;
}

// Generate time slots for booking
export function generateTimeSlots(startTime: string, endTime: string, intervalMinutes: number = 30): string[] {
  const slots: string[] = [];
  
  // Convert string times to Date objects on the same day for comparison
  const today = new Date();
  const start = new Date(today);
  const end = new Date(today);
  
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  start.setHours(startHours, startMinutes, 0, 0);
  end.setHours(endHours, endMinutes, 0, 0);
  
  // Adjust if end time is earlier than start time (crosses midnight)
  if (end < start) {
    end.setDate(end.getDate() + 1);
  }
  
  let current = new Date(start);
  
  while (current <= end) {
    slots.push(format(current, 'HH:mm'));
    current = new Date(current.getTime() + intervalMinutes * 60000);
  }
  
  return slots;
}

// Get day of week from date
export function getDayOfWeek(date: Date | string): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.getDay().toString();
}

// Check if a day is available based on weekdays string
export function isDayAvailable(date: Date, availableWeekdays: string): boolean {
  const dayOfWeek = getDayOfWeek(date);
  return availableWeekdays.split(',').includes(dayOfWeek);
}

// Calculate duration between two times in hours and minutes
export function calculateDuration(startTime: Date, endTime: Date): string {
  const durationMs = endTime.getTime() - startTime.getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours === 0) {
    return `${minutes} minutes`;
  } else if (minutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  } else {
    return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
}
