import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  phoneNumber: text("phone_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Driveway table
export const driveways = pgTable("driveways", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id").references(() => users.id).notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  priceHourly: doublePrecision("price_hourly").notNull(),
  description: text("description"),
  availabilityStartTime: text("availability_start_time").notNull(), // In 24hr format: "08:00"
  availabilityEndTime: text("availability_end_time").notNull(),     // In 24hr format: "18:00"
  availableWeekdays: text("available_weekdays").notNull(),          // CSV of weekdays: "1,2,3,4,5"
  imageUrl: text("image_url"),                                      // URL to driveway image
  amenities: text("amenities"),                                     // CSV of amenities: "Covered,Security,EV charging"
  rating: doublePrecision("rating").default(0),                     // Average rating (0-5)
  ratingCount: integer("rating_count").default(0),                  // Number of ratings
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

// Booking table
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  drivewayId: integer("driveway_id").references(() => driveways.id).notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  totalPrice: doublePrecision("total_price").notNull(),
  status: text("status").notNull().default("confirmed"), // confirmed, completed, cancelled
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  drivewayId: integer("driveway_id").references(() => driveways.id).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Zod schemas for validation

// User schemas
export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, createdAt: true })
  .extend({
    password: z.string().min(6, "Password must be at least 6 characters"),
    email: z.string().email("Please enter a valid email"),
    phoneNumber: z.string().optional(),
  });

// Driveway schemas
export const insertDrivewaySchema = createInsertSchema(driveways)
  .omit({ id: true, createdAt: true })
  .extend({
    priceHourly: z.number().positive("Price must be greater than 0"),
    latitude: z.number(),
    longitude: z.number(),
    availabilityStartTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Must be in 24hr format (HH:MM)"),
    availabilityEndTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Must be in 24hr format (HH:MM)"),
    availableWeekdays: z.string().regex(/^[0-6](,[0-6])*$/, "Must be comma-separated weekday numbers (0-6)"),
    imageUrl: z.string().optional(),
    amenities: z.string().optional(),
    rating: z.number().min(0).max(5).optional(),
    ratingCount: z.number().min(0).optional(),
  });

// Booking schemas
export const insertBookingSchema = createInsertSchema(bookings)
  .omit({ id: true, createdAt: true, status: true })
  .extend({
    startTime: z.string().or(z.date()),
    endTime: z.string().or(z.date()),
    totalPrice: z.number().positive("Total price must be greater than 0"),
  });

// Review schemas
export const insertReviewSchema = createInsertSchema(reviews)
  .omit({ id: true, createdAt: true })
  .extend({
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
  });

// Search schema
export const searchSchema = z.object({
  location: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  date: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

// Login schema
export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Driveway = typeof driveways.$inferSelect;
export type InsertDriveway = z.infer<typeof insertDrivewaySchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Search = z.infer<typeof searchSchema>;
export type Login = z.infer<typeof loginSchema>;
