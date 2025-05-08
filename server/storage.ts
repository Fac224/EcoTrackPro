import { driveways, users, bookings, reviews, type User, type InsertUser, type Driveway, type InsertDriveway, type Booking, type InsertBooking, type Review, type InsertReview } from "@shared/schema";
import { z } from "zod";
import session from "express-session";
import createMemoryStore from "memorystore";

// Storage interface
export interface IStorage {
  // Session store for authentication
  sessionStore: session.Store;
  
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Driveway methods
  getDriveway(id: number): Promise<Driveway | undefined>;
  getDrivewaysByOwner(ownerId: number): Promise<Driveway[]>;
  getAllDriveways(): Promise<Driveway[]>;
  searchDriveways(params: {
    location?: string;
    latitude?: number;
    longitude?: number;
    date?: string;
    startTime?: string;
    endTime?: string;
  }): Promise<Driveway[]>;
  createDriveway(driveway: InsertDriveway): Promise<Driveway>;
  updateDriveway(id: number, driveway: Partial<InsertDriveway>): Promise<Driveway | undefined>;
  deleteDriveway(id: number): Promise<boolean>;
  
  // Booking methods
  getBooking(id: number): Promise<Booking | undefined>;
  getUserBookings(userId: number): Promise<Booking[]>;
  getDrivewayBookings(drivewayId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;
  cancelBooking(id: number): Promise<boolean>;
  
  // Review methods
  getDrivewayReviews(drivewayId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private driveways: Map<number, Driveway>;
  private bookings: Map<number, Booking>;
  private reviews: Map<number, Review>;
  private currentUserId: number;
  private currentDrivewayId: number;
  private currentBookingId: number;
  private currentReviewId: number;
  readonly sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.driveways = new Map();
    this.bookings = new Map();
    this.reviews = new Map();
    this.currentUserId = 1;
    this.currentDrivewayId = 1;
    this.currentBookingId = 1;
    this.currentReviewId = 1;
    
    // Create session store
    const SessionStore = createMemoryStore(session);
    this.sessionStore = new SessionStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Add some sample data
    this.initializeSampleData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const createdAt = new Date();
    
    // Ensure that phoneNumber is a string or null, not undefined
    const phoneNumber = insertUser.phoneNumber || null;
    
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt, 
      phoneNumber 
    };
    
    this.users.set(id, user);
    return user;
  }

  // Driveway methods
  async getDriveway(id: number): Promise<Driveway | undefined> {
    return this.driveways.get(id);
  }

  async getDrivewaysByOwner(ownerId: number): Promise<Driveway[]> {
    return Array.from(this.driveways.values()).filter(
      (driveway) => driveway.ownerId === ownerId,
    );
  }

  async getAllDriveways(): Promise<Driveway[]> {
    return Array.from(this.driveways.values()).filter(
      (driveway) => driveway.isActive,
    );
  }

  async searchDriveways(params: {
    location?: string;
    latitude?: number;
    longitude?: number;
    date?: string;
    startTime?: string;
    endTime?: string;
  }): Promise<Driveway[]> {
    let results = Array.from(this.driveways.values()).filter(
      (driveway) => driveway.isActive,
    );

    // Filter by location if provided
    if (params.location) {
      results = results.filter((driveway) => 
        driveway.address.toLowerCase().includes(params.location!.toLowerCase()) ||
        driveway.city.toLowerCase().includes(params.location!.toLowerCase()) ||
        driveway.state.toLowerCase().includes(params.location!.toLowerCase()) ||
        driveway.zipCode.includes(params.location!)
      );
    }

    // Filter by coordinates if provided (simple radius search)
    if (params.latitude && params.longitude) {
      const MAX_DISTANCE = 10; // miles
      results = results.filter((driveway) => {
        const distance = this.calculateDistance(
          params.latitude!,
          params.longitude!,
          driveway.latitude,
          driveway.longitude
        );
        return distance <= MAX_DISTANCE;
      });
    }

    // Filter by time if provided
    if (params.startTime && params.endTime) {
      results = results.filter((driveway) => {
        const drivewayStart = this.timeToMinutes(driveway.availabilityStartTime);
        const drivewayEnd = this.timeToMinutes(driveway.availabilityEndTime);
        const requestStart = this.timeToMinutes(params.startTime!);
        const requestEnd = this.timeToMinutes(params.endTime!);
        
        return drivewayStart <= requestStart && drivewayEnd >= requestEnd;
      });
    }

    // Filter by date/day if provided
    if (params.date) {
      const requestDate = new Date(params.date);
      const dayOfWeek = requestDate.getDay().toString();
      
      results = results.filter((driveway) => {
        const availableDays = driveway.availableWeekdays.split(',');
        return availableDays.includes(dayOfWeek);
      });
    }

    return results;
  }

  async createDriveway(driveway: InsertDriveway): Promise<Driveway> {
    const id = this.currentDrivewayId++;
    const createdAt = new Date();
    
    // Ensure optional fields have appropriate default values
    const description = driveway.description || null;
    const isActive = driveway.isActive ?? true;
    const imageUrl = driveway.imageUrl || null;
    const amenities = driveway.amenities || null;
    const rating = driveway.rating ?? 0;
    const ratingCount = driveway.ratingCount ?? 0;
    
    const newDriveway: Driveway = { 
      ...driveway, 
      id, 
      createdAt, 
      description,
      isActive,
      imageUrl,
      amenities,
      rating,
      ratingCount
    };
    
    this.driveways.set(id, newDriveway);
    return newDriveway;
  }

  async updateDriveway(id: number, drivewayUpdates: Partial<InsertDriveway>): Promise<Driveway | undefined> {
    const driveway = this.driveways.get(id);
    if (!driveway) return undefined;
    
    const updatedDriveway = { ...driveway, ...drivewayUpdates };
    this.driveways.set(id, updatedDriveway);
    return updatedDriveway;
  }

  async deleteDriveway(id: number): Promise<boolean> {
    const driveway = this.driveways.get(id);
    if (!driveway) return false;
    
    // Soft delete by marking as inactive
    driveway.isActive = false;
    this.driveways.set(id, driveway);
    return true;
  }

  // Booking methods
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.userId === userId,
    );
  }

  async getDrivewayBookings(drivewayId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.drivewayId === drivewayId,
    );
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = this.currentBookingId++;
    const createdAt = new Date();
    const newBooking: Booking = { 
      ...booking, 
      id, 
      createdAt, 
      status: "confirmed",
      startTime: new Date(booking.startTime),
      endTime: new Date(booking.endTime),
    };
    this.bookings.set(id, newBooking);
    return newBooking;
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    booking.status = status;
    this.bookings.set(id, booking);
    return booking;
  }

  async cancelBooking(id: number): Promise<boolean> {
    const booking = this.bookings.get(id);
    if (!booking) return false;
    
    booking.status = "cancelled";
    this.bookings.set(id, booking);
    return true;
  }

  // Review methods
  async getDrivewayReviews(drivewayId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.drivewayId === drivewayId,
    );
  }

  async createReview(review: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const createdAt = new Date();
    
    // Ensure comment is a string or null, not undefined
    const comment = review.comment || null;
    
    const newReview: Review = { 
      ...review, 
      id, 
      createdAt,
      comment
    };
    
    this.reviews.set(id, newReview);
    return newReview;
  }

  // Helper methods
  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    // Haversine formula to calculate distance between two coordinates
    const R = 3958.8; // Earth's radius in miles
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  }

  private toRadians(degrees: number): number {
    return degrees * Math.PI / 180;
  }

  // Initialize sample data
  private initializeSampleData() {
    // Create sample users
    const user1: InsertUser = {
      username: "johndoe",
      email: "john@example.com",
      password: "password123", // In a real app, this would be hashed
      name: "John Doe",
      phoneNumber: "555-123-4567",
    };
    const user2: InsertUser = {
      username: "janedoe",
      email: "jane@example.com",
      password: "password123",
      name: "Jane Doe",
      phoneNumber: "555-987-6543",
    };
    const user3: InsertUser = {
      username: "mike.chen",
      email: "mike.chen@example.com",
      password: "password456",
      name: "Mike Chen",
      phoneNumber: "555-222-3333",
    };
    const user4: InsertUser = {
      username: "sarah.johnson",
      email: "sarah.johnson@example.com",
      password: "password789",
      name: "Sarah Johnson",
      phoneNumber: "555-444-5555",
    };
    
    // Create users and their associated driveways
    this.createUser(user1).then(user => {
      // San Francisco featured driveway 1
      const sfDriveway1: InsertDriveway = {
        ownerId: user.id,
        address: "1720 Market Street",
        city: "San Francisco",
        state: "CA",
        zipCode: "94102",
        latitude: 37.7732,
        longitude: -122.4225,
        priceHourly: 9.50,
        description: "Premium Market Street driveway with easy access to downtown. Spacious spot with 24/7 security camera.",
        availabilityStartTime: "07:00",
        availabilityEndTime: "22:00",
        availableWeekdays: "0,1,2,3,4,5,6",
        isActive: true,
        imageUrl: "https://media-hosting.imagekit.io/06d6059931544c07/Screenshot%202025-05-07%20at%208.11.55%E2%80%AFPM.png?Expires=1841271123&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=tbv6HlyqJhe63Kgj13EHo8BqqM4hFagDXhcN2w4xAruMYGMAl3leSAJpIHvr52zPiC4kncJ-BnHdorefi~l3NmMfQ96sQdvpNL3~tTN3dNiS9LgY7d4SzxUBpHbyZGHzOJ9GKBlGlKF4eA2yOfmINMXWx3UoQUJWIqEN-QrJxvb-L1jY59cfaQzHZsZDkL5SX5tjXwX5VzplHDe5Kdb3UF-jTwW62iKzRNO0ivxuZEUDaMCO5RilmQGFq7vHtgiXkUKL2Hghhz-3LsPlxYgLXzwdm~pFEY-u6M83-SuIjjp0PHpRgOnTiyRDq75Hqc6zIqkr6drHFtUvCw2Igvqm2w__",
        amenities: "Security cameras,Well lit,Covered,Wide space",
        rating: 4.9,
        ratingCount: 27
      };
      
      this.createDriveway(sfDriveway1);
    });
    
    this.createUser(user2).then(user => {
      // San Francisco featured driveway 2
      const sfDriveway2: InsertDriveway = {
        ownerId: user.id,
        address: "432 Maple Street",
        city: "San Francisco",
        state: "CA",
        zipCode: "94103",
        latitude: 37.7740,
        longitude: -122.4200,
        priceHourly: 8.50,
        description: "Maple Street parking spot, perfect for shoppers. Located near popular shopping districts with easy access to public transportation.",
        availabilityStartTime: "06:00",
        availabilityEndTime: "20:00",
        availableWeekdays: "1,2,3,4,5",
        isActive: true,
        imageUrl: "https://media-hosting.imagekit.io/7cb01f7004824a8b/Screenshot%202025-05-07%20at%208.06.02%E2%80%AFPM.png?Expires=1841270772&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=IrqPJl03aLpQOFstRVFz2QFeyz-QRRzkgOZbxFV00MQ112tdDPCkJZADnhH8qgyG-LataWrN-Dc~pnP169-ODNOxNJ7wMZSi6AgpJywNNDzJ99eGjkNJxyHThVABTbzAIBEuk1k1aaOXFJMv6KAf5EVPbJKIkckEnVuIS5k7tL6320ZvrZD8vY7bGLApf-q2yO7daMd-qRlhPiiO8ZCjTrpQ6YTqSmH6CfaeWtqJX2alRoFGhBBg39rHArctRgBtISsRdHJW6TuEY7C8muxjLRu06S6DSGmN3Jh~7mS5SKTHQiYKRtLjikzUyOWNudyxbCr12X91dqCHwNXw~4JZpQ__",
        amenities: "Well lit,Near public transport,EV charging",
        rating: 4.7,
        ratingCount: 43
      };
      
      // San Francisco featured driveway 3
      const sfDriveway3: InsertDriveway = {
        ownerId: user.id,
        address: "847 Pine Avenue",
        city: "San Francisco",
        state: "CA",
        zipCode: "94108",
        latitude: 37.7920,
        longitude: -122.4083,
        priceHourly: 7.50,
        description: "Prime Pine Avenue parking spot in downtown. Excellent location for visitors to Union Square, Financial District, and Chinatown.",
        availabilityStartTime: "08:00",
        availabilityEndTime: "23:00",
        availableWeekdays: "0,1,2,3,4,5,6",
        isActive: true,
        imageUrl: "https://media-hosting.imagekit.io/aebff09f96474fa7/Screenshot%202025-05-07%20at%208.13.08%E2%80%AFPM.png?Expires=1841271197&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=G-9IPw9nZLvVivDdAokPrF8J1Fg81cqk8kYtpcvbFWNFZ3qJysUjqljjIDnrmA5iyMcCwlRFLr62RqYVGGvOBxiRxfoePuyXzzl6i5ImkpU7J8d~GivZ7dNDtFpuUC4SaXeXqTXgDGamQqd~UXvaddXnU-ba6Zmi5kRWIw3y1QZ5BlvroFz0mJFHewu8nEhevlVnbubbIW2SfZpauAYNUADRW76Jg3mOFu1PnVqgSGkB7IdHH-G1M01WJ7PRJRSDp2FsksjI2durhzPlC9ho~yQ6hQiam941zKJY71OlxofaBBwOFFqRU1A~zKBP75F1b9hzjPZB5GUQOkci3tv5~A__",
        amenities: "Residential area,Wide space,Pet-friendly",
        rating: 4.5,
        ratingCount: 19
      };
      
      this.createDriveway(sfDriveway2);
      this.createDriveway(sfDriveway3);
    });
    
    this.createUser(user3).then(user => {
      // Urban Garage Entry driveway
      const urbanGarageDriveway: InsertDriveway = {
        ownerId: user.id,
        address: "1722 Market Street, Unit G",
        city: "San Francisco",
        state: "CA",
        zipCode: "94102",
        latitude: 37.7734,
        longitude: -122.4220,
        priceHourly: 12.00,
        description: "Urban garage entry in Market Street area. Perfect for downtown visitors with 24/7 security and camera monitoring.",
        availabilityStartTime: "08:00",
        availabilityEndTime: "23:59",
        availableWeekdays: "0,1,2,3,4,5,6",
        isActive: true,
        imageUrl: "https://media-hosting.imagekit.io/6800d73188a54589/Screenshot%202025-05-07%20at%208.10.02%E2%80%AFPM.png?Expires=1841271014&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=XMHGkpTLnLV15l0kUJrsZkLwreTCRnyrNNuTsljNkyZGIfKcWDHRqok0X2xhCJZCP3VrTPKTWQ1UtjB4xELclFpYJyODD3e2Uz~dMjX7808vPbxXy3BOO0kdh79IqKcdTFKcQYSDuv3bzu9LmWI~4pvbPbRTDM2faUqeSMKHK0BaBRqwRuglh-IaLlVba9L6Sy~WjIxHNfmQ4aajsuVpU0~Oo64wQW1hxW1nu7-74JCJgwsQDycnVLwikUY7fNwAmUQxkvUO5maT6iqZWnHolyCASZXVhpZJyQIBeHxl6bDrD2HEO~Ef8vHVxAA6NPctN9ynr0yvIyLSJCflwXNiuw__",
        amenities: "Security cameras,Well lit,24/7 access,Covered",
        rating: 4.8,
        ratingCount: 52
      };
      
      this.createDriveway(urbanGarageDriveway);
    });
    
    this.createUser(user4).then(user => {
      // New York featured driveway 2
      const nyDriveway2: InsertDriveway = {
        ownerId: user.id,
        address: "456 Park Ave",
        city: "New York",
        state: "NY",
        zipCode: "10022",
        latitude: 40.7616,
        longitude: -73.9685,
        priceHourly: 10.50,
        description: "Upper East Side private driveway. Secure location near Central Park and high-end shopping.",
        availabilityStartTime: "07:00",
        availabilityEndTime: "21:00",
        availableWeekdays: "0,1,2,3,4,5,6",
        isActive: true,
        imageUrl: "https://media-hosting.imagekit.io/409297b5d2854acf/Screenshot%202025-05-07%20at%208.26.20%E2%80%AFPM.png?Expires=1841271987&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=wyHkVAwX5GgeyFLOYBWS6irxLhhe-i6Rqo~q0KAeLzs3ZHr5meZxi~zhwHifvbDqTXNfrs5aDBoZx~k5yjTdj6oAf0DQq3sAMytd397YO9GuQv8OiOotB~3lJDShCkcBhLG-Elxb1dFV6LzuCHvoyrRBmcNxyhzv94nWsjpJkaMT8boKITQvzKlxap-BltIgPDjN2nJA9uhTgqNkric9NqmAGD8epWxxwtiq3vRUkna2gkIiKV0CDI80Lp2EeQqUg5LSHFZxLv4rq6XvXtxenJEbKK~gCnKtML0y-GFCZUO7Afr2sY22uJQ5W0Gd5wOfs8gXbFLeLF3nwpVEMn6JtQ__",
        amenities: "Gated,Security cameras,Wide space,Well lit",
        rating: 4.9,
        ratingCount: 38
      };
      
      // New York featured driveway 3
      const nyDriveway3: InsertDriveway = {
        ownerId: user.id,
        address: "789 Bedford Ave",
        city: "New York",
        state: "NY",
        zipCode: "11211",
        latitude: 40.7200,
        longitude: -73.9573,
        priceHourly: 8.00,
        description: "Williamsburg Brooklyn parking space. Hip neighborhood with great access to restaurants, bars, and shops.",
        availabilityStartTime: "09:00",
        availabilityEndTime: "23:00",
        availableWeekdays: "0,1,2,3,4,5,6",
        isActive: true,
        imageUrl: "https://media-hosting.imagekit.io/1021f5dcddb54ea0/Screenshot%202025-05-07%20at%208.28.09%E2%80%AFPM.png?Expires=1841272098&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=rxbUwWo~wqqJdahz1~Uqhdk3E2gmb-g9nEZM-rFlqxMqUE2GcWOxVCWX5LHNFoFYMVLw9cnCVBRTVFXGmRiCa-YxXUSwfjkl8TlX5AzbZhRmGL1P~PJpwKDd~C4ago1BgyyspWwT4siHUjYT~Zn6se7ioq5gB9w2ocJjiMabS1K5ZxUPHwmsqK5lOgkBXLdh4YREDD-9C0667Baago-S-64mobyRtofEmOoXuFJYhpEh2WXd9W6~LfGFFQ-upkugo6OY8oKPC8cE1EGQjxr2wJZRirNqLrKLjjEc6RAaTugr4bhZiVVMlRdBzSiageSaiVtHMl2uMHS3~tTPfWGs4g__",
        amenities: "Residential area,Near subway,Well lit",
        rating: 4.6,
        ratingCount: 29
      };
      
      this.createDriveway(nyDriveway2);
      this.createDriveway(nyDriveway3);
    });
  }
}

export const storage = new MemStorage();
