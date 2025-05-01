import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ZodError, z } from "zod";
import { 
  insertUserSchema,
  insertDrivewaySchema,
  insertBookingSchema,
  insertReviewSchema,
  searchSchema,
  loginSchema
} from "@shared/schema";
import {
  processUserQuery,
  generateParkingRecommendations,
  generatePersonalizedSuggestions,
  AIFeatureType
} from "./ai";
import { handleParkingQuery } from "./parkingPredictor";
import session from "express-session";
import MemoryStore from "memorystore";

// Set up session middleware
const createSessionMiddleware = (app: Express) => {
  const SessionStore = MemoryStore(session);
  app.use(session({
    secret: 'parkshare-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
    store: new SessionStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    })
  }));
};

// Authentication middleware
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ message: "Not authenticated" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session
  createSessionMiddleware(app);
  
  // Create HTTP server
  const httpServer = createServer(app);

  // Error handling for Zod validation
  const handleZodError = (error: ZodError, res: Response) => {
    return res.status(400).json({
      message: "Validation error",
      errors: error.errors,
    });
  };

  // User routes
  app.post("/api/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUserByUsername = await storage.getUserByUsername(userData.username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      const existingUserByEmail = await storage.getUserByEmail(userData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      // Create new user
      const user = await storage.createUser(userData);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      // Log the user in
      req.session.userId = user.id;
      
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      return res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const loginData = loginSchema.parse(req.body);
      
      // Find user by username
      const user = await storage.getUserByUsername(loginData.username);
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Check password
      if (user.password !== loginData.password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Set user in session
      req.session.userId = user.id;
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      return res.status(500).json({ message: "Failed to login" });
    }
  });

  app.get("/api/me", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId as number);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get user data" });
    }
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.clearCookie('connect.sid');
      return res.status(200).json({ message: "Logged out successfully" });
    });
  });

  // Driveway routes
  app.get("/api/driveways", async (req, res) => {
    try {
      const driveways = await storage.getAllDriveways();
      return res.status(200).json(driveways);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get driveways" });
    }
  });

  app.get("/api/driveways/search", async (req, res) => {
    try {
      const queryParams = {
        location: req.query.location as string | undefined,
        latitude: req.query.latitude ? parseFloat(req.query.latitude as string) : undefined,
        longitude: req.query.longitude ? parseFloat(req.query.longitude as string) : undefined,
        date: req.query.date as string | undefined,
        startTime: req.query.startTime as string | undefined,
        endTime: req.query.endTime as string | undefined,
      };
      
      const searchParams = searchSchema.parse(queryParams);
      const driveways = await storage.searchDriveways(searchParams);
      return res.status(200).json(driveways);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      return res.status(500).json({ message: "Failed to search driveways" });
    }
  });

  app.get("/api/driveways/:id", async (req, res) => {
    try {
      const drivewayId = parseInt(req.params.id);
      const driveway = await storage.getDriveway(drivewayId);
      
      if (!driveway) {
        return res.status(404).json({ message: "Driveway not found" });
      }
      
      return res.status(200).json(driveway);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get driveway" });
    }
  });

  app.post("/api/driveways", isAuthenticated, async (req, res) => {
    try {
      const drivewayData = insertDrivewaySchema.parse(req.body);
      
      // Assign current user as owner
      drivewayData.ownerId = req.session.userId as number;
      
      const driveway = await storage.createDriveway(drivewayData);
      return res.status(201).json(driveway);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      return res.status(500).json({ message: "Failed to create driveway" });
    }
  });

  app.put("/api/driveways/:id", isAuthenticated, async (req, res) => {
    try {
      const drivewayId = parseInt(req.params.id);
      const driveway = await storage.getDriveway(drivewayId);
      
      if (!driveway) {
        return res.status(404).json({ message: "Driveway not found" });
      }
      
      // Verify ownership
      if (driveway.ownerId !== req.session.userId) {
        return res.status(403).json({ message: "Not authorized to update this driveway" });
      }
      
      const drivewayData = insertDrivewaySchema.partial().parse(req.body);
      const updatedDriveway = await storage.updateDriveway(drivewayId, drivewayData);
      
      return res.status(200).json(updatedDriveway);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      return res.status(500).json({ message: "Failed to update driveway" });
    }
  });

  app.delete("/api/driveways/:id", isAuthenticated, async (req, res) => {
    try {
      const drivewayId = parseInt(req.params.id);
      const driveway = await storage.getDriveway(drivewayId);
      
      if (!driveway) {
        return res.status(404).json({ message: "Driveway not found" });
      }
      
      // Verify ownership
      if (driveway.ownerId !== req.session.userId) {
        return res.status(403).json({ message: "Not authorized to delete this driveway" });
      }
      
      await storage.deleteDriveway(drivewayId);
      return res.status(200).json({ message: "Driveway deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete driveway" });
    }
  });

  app.get("/api/users/:id/driveways", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const driveways = await storage.getDrivewaysByOwner(userId);
      return res.status(200).json(driveways);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get user driveways" });
    }
  });

  app.get("/api/my-driveways", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId as number;
      const driveways = await storage.getDrivewaysByOwner(userId);
      return res.status(200).json(driveways);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get your driveways" });
    }
  });

  // Booking routes
  app.post("/api/bookings", isAuthenticated, async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      
      // Assign current user
      bookingData.userId = req.session.userId as number;
      
      // Check if driveway exists
      const driveway = await storage.getDriveway(bookingData.drivewayId);
      if (!driveway) {
        return res.status(404).json({ message: "Driveway not found" });
      }
      
      // Check if driveway is available for the requested time
      // More complex availability checking would be implemented here
      
      const booking = await storage.createBooking(bookingData);
      return res.status(201).json(booking);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      return res.status(500).json({ message: "Failed to create booking" });
    }
  });

  app.get("/api/bookings/:id", isAuthenticated, async (req, res) => {
    try {
      const bookingId = parseInt(req.params.id);
      const booking = await storage.getBooking(bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Verify it's the user's booking or the driveway owner
      const driveway = await storage.getDriveway(booking.drivewayId);
      if (booking.userId !== req.session.userId && driveway?.ownerId !== req.session.userId) {
        return res.status(403).json({ message: "Not authorized to view this booking" });
      }
      
      return res.status(200).json(booking);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get booking" });
    }
  });

  app.get("/api/my-bookings", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId as number;
      const bookings = await storage.getUserBookings(userId);
      return res.status(200).json(bookings);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get your bookings" });
    }
  });

  app.get("/api/driveways/:id/bookings", isAuthenticated, async (req, res) => {
    try {
      const drivewayId = parseInt(req.params.id);
      const driveway = await storage.getDriveway(drivewayId);
      
      if (!driveway) {
        return res.status(404).json({ message: "Driveway not found" });
      }
      
      // Verify ownership
      if (driveway.ownerId !== req.session.userId) {
        return res.status(403).json({ message: "Not authorized to view bookings for this driveway" });
      }
      
      const bookings = await storage.getDrivewayBookings(drivewayId);
      return res.status(200).json(bookings);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get driveway bookings" });
    }
  });

  app.put("/api/bookings/:id", isAuthenticated, async (req, res) => {
    try {
      const bookingId = parseInt(req.params.id);
      const booking = await storage.getBooking(bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Only the driveway owner can update booking status
      const driveway = await storage.getDriveway(booking.drivewayId);
      if (driveway?.ownerId !== req.session.userId) {
        return res.status(403).json({ message: "Not authorized to update this booking" });
      }
      
      const { status } = z.object({ status: z.string() }).parse(req.body);
      const updatedBooking = await storage.updateBookingStatus(bookingId, status);
      
      return res.status(200).json(updatedBooking);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      return res.status(500).json({ message: "Failed to update booking" });
    }
  });

  app.delete("/api/bookings/:id", isAuthenticated, async (req, res) => {
    try {
      const bookingId = parseInt(req.params.id);
      const booking = await storage.getBooking(bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Only the user who made the booking can cancel it
      if (booking.userId !== req.session.userId) {
        return res.status(403).json({ message: "Not authorized to cancel this booking" });
      }
      
      await storage.cancelBooking(bookingId);
      return res.status(200).json({ message: "Booking cancelled successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to cancel booking" });
    }
  });

  // Review routes
  app.get("/api/driveways/:id/reviews", async (req, res) => {
    try {
      const drivewayId = parseInt(req.params.id);
      const reviews = await storage.getDrivewayReviews(drivewayId);
      return res.status(200).json(reviews);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get driveway reviews" });
    }
  });

  app.post("/api/reviews", isAuthenticated, async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      
      // Assign current user
      reviewData.userId = req.session.userId as number;
      
      // Check if driveway exists
      const driveway = await storage.getDriveway(reviewData.drivewayId);
      if (!driveway) {
        return res.status(404).json({ message: "Driveway not found" });
      }
      
      // Check if the user has booked this driveway
      const userBookings = await storage.getUserBookings(req.session.userId as number);
      const hasBookedDriveway = userBookings.some((booking) => booking.drivewayId === reviewData.drivewayId);
      
      if (!hasBookedDriveway) {
        return res.status(403).json({ message: "You can only review driveways you have booked" });
      }
      
      const review = await storage.createReview(reviewData);
      return res.status(201).json(review);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      return res.status(500).json({ message: "Failed to create review" });
    }
  });

  // AI Assistant Routes
  app.post("/api/ai/assistant", async (req, res) => {
    try {
      const { query } = z.object({ query: z.string() }).parse(req.body);
      
      // Get user context if authenticated
      let userContext;
      let userId = undefined;
      if (req.session && req.session.userId) {
        userId = req.session.userId as number;
        try {
          const user = await storage.getUser(userId);
          const userBookings = await storage.getUserBookings(userId);
          
          if (user) {
            userContext = {
              username: user.username,
              userId: user.id,
              pastBookings: userBookings.length,
            };
          }
        } catch (error) {
          console.error("Error getting user context:", error);
        }
      }
      
      // Check if the query is parking-related (availability, booking, etc.)
      const isParkingQuery = 
        query.toLowerCase().includes("parking") || 
        query.toLowerCase().includes("book") || 
        query.toLowerCase().includes("reservation") || 
        query.toLowerCase().includes("cancel") ||
        query.toLowerCase().includes("space at") ||
        query.toLowerCase().includes("where can i park");
      
      if (isParkingQuery) {
        try {
          // Use the enhanced parking query handler with the user's ID
          const parkingResponse = await handleParkingQuery(query, userId);
          return res.json({ response: parkingResponse });
        } catch (parkingError) {
          console.error("Error processing parking query:", parkingError);
          // If the parking handler fails, fall back to the general AI
        }
      }
      
      // If not a parking query or if parking handler failed, use the normal AI processing
      const response = await processUserQuery(query, userContext);
      res.json(response);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      return res.status(500).json({ message: "Failed to process AI query" });
    }
  });

  app.post("/api/ai/event-parking", async (req, res) => {
    try {
      const { query } = z.object({ query: z.string() }).parse(req.body);
      
      // Force the query type to be event parking
      const response = await processUserQuery(query, undefined, AIFeatureType.EVENT_PARKING);
      res.json(response);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      return res.status(500).json({ message: "Failed to process event parking query" });
    }
  });

  app.post("/api/ai/airport-travel", async (req, res) => {
    try {
      const { query } = z.object({ query: z.string() }).parse(req.body);
      
      // Force the query type to be airport travel
      const response = await processUserQuery(query, undefined, AIFeatureType.AIRPORT_TRAVEL);
      res.json(response);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      return res.status(500).json({ message: "Failed to process airport travel query" });
    }
  });

  app.post("/api/ai/commuter-parking", async (req, res) => {
    try {
      const { query } = z.object({ query: z.string() }).parse(req.body);
      
      // Force the query type to be commuter parking
      const response = await processUserQuery(query, undefined, AIFeatureType.COMMUTER_PARKING);
      res.json(response);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      return res.status(500).json({ message: "Failed to process commuter parking query" });
    }
  });

  app.post("/api/ai/recommendations", async (req, res) => {
    try {
      const { location, preferences } = z.object({
        location: z.string(),
        preferences: z.object({
          eventType: z.string().optional(),
          priceRange: z.string().optional(),
          amenities: z.array(z.string()).optional(),
          timeNeeded: z.string().optional()
        }).optional()
      }).parse(req.body);
      
      const recommendations = await generateParkingRecommendations(location, preferences);
      res.json(recommendations);
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      return res.status(500).json({ message: "Failed to generate recommendations" });
    }
  });
  
  // Parking availability predictor endpoint
  app.post("/api/ai/parking-availability", async (req, res) => {
    try {
      const { query } = z.object({ query: z.string() }).parse(req.body);
      
      // Get user ID if authenticated
      let userId = undefined;
      if (req.session && req.session.userId) {
        userId = req.session.userId as number;
      }
      
      const response = await handleParkingQuery(query, userId);
      res.json({ 
        response,
        suggestions: [
          "Would you like to book one of these spaces?",
          "Do you need directions to any of these locations?",
          "Would you like to see more parking options in this area?"
        ]
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      console.error("Error processing parking availability query:", error);
      res.status(500).json({ 
        message: "Failed to process parking availability query",
        error: error.message 
      });
    }
  });

  app.get("/api/ai/personalized", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId as number;
      
      // Gather user history for personalization
      const userBookings = await storage.getUserBookings(userId);
      
      // Format booking data for the AI
      const pastBookings = userBookings.map(booking => ({
        location: booking.location || "Unknown location",
        date: booking.date || new Date().toISOString().slice(0, 10),
        duration: booking.duration || "Unknown duration"
      }));
      
      // In a real app, you would have user's search history
      const searchHistory = ["Downtown parking", "Airport long-term"];
      
      const suggestions = await generatePersonalizedSuggestions(userId, {
        pastBookings,
        searchHistory
      });
      
      res.json(suggestions);
    } catch (error) {
      return res.status(500).json({ message: "Failed to generate personalized suggestions" });
    }
  });

  // Return HTTP server
  return httpServer;
}