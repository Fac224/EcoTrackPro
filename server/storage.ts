import { driveways, users, bookings, reviews, type User, type InsertUser, type Driveway, type InsertDriveway, type Booking, type InsertBooking, type Review, type InsertReview } from "@shared/schema";
import { z } from "zod";

// Storage interface
export interface IStorage {
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

  constructor() {
    this.users = new Map();
    this.driveways = new Map();
    this.bookings = new Map();
    this.reviews = new Map();
    this.currentUserId = 1;
    this.currentDrivewayId = 1;
    this.currentBookingId = 1;
    this.currentReviewId = 1;
    
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
    const user: User = { ...insertUser, id, createdAt };
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
    const newDriveway: Driveway = { ...driveway, id, createdAt };
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
    const newReview: Review = { ...review, id, createdAt };
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
    
    this.createUser(user1).then(user => {
      // Create sample driveways for user1
      const driveway1: InsertDriveway = {
        ownerId: user.id,
        address: "123 Main St",
        city: "San Francisco",
        state: "CA",
        zipCode: "94105",
        latitude: 37.7749,
        longitude: -122.4194,
        priceHourly: 4.50,
        description: "Downtown driveway close to shopping and restaurants",
        availabilityStartTime: "08:00",
        availabilityEndTime: "19:00",
        availableWeekdays: "0,1,2,3,4,5,6",
        isActive: true,
      };
      
      this.createDriveway(driveway1);
    });
    
    this.createUser(user2).then(user => {
      // Create sample driveways for user2
      const driveway2: InsertDriveway = {
        ownerId: user.id,
        address: "456 Oak Ave",
        city: "San Francisco",
        state: "CA",
        zipCode: "94110",
        latitude: 37.7599,
        longitude: -122.4148,
        priceHourly: 3.00,
        description: "Suburban space in quiet neighborhood",
        availabilityStartTime: "09:00",
        availabilityEndTime: "17:00",
        availableWeekdays: "1,2,3,4,5",
        isActive: true,
      };
      
      const driveway3: InsertDriveway = {
        ownerId: user.id,
        address: "789 Market St",
        city: "San Francisco",
        state: "CA",
        zipCode: "94103",
        latitude: 37.7857,
        longitude: -122.4057,
        priceHourly: 5.00,
        description: "Shopping district parking spot",
        availabilityStartTime: "10:00",
        availabilityEndTime: "20:00",
        availableWeekdays: "0,6",
        isActive: true,
      };
      
      this.createDriveway(driveway2);
      this.createDriveway(driveway3);
    });
  }
}

export const storage = new MemStorage();
