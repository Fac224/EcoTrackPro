# EasyPark - Parking Marketplace Platform

## Overview

EasyPark is a peer-to-peer parking marketplace that connects drivers seeking parking spaces with property owners who have available driveways or parking spots. The platform enables users to search for, book, and pay for parking spaces by the hour, while property owners can list their spaces and earn passive income. The application features AI-powered assistance for finding parking near events, airports, and for daily commutes, along with personalized recommendations based on user behavior.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Technology Stack

**Frontend:**
- React with TypeScript for type-safe UI development
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and caching
- Shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- React Hook Form with Zod validation for form handling

**Backend:**
- Express.js server with TypeScript
- Passport.js with Local Strategy for session-based authentication
- Express sessions with configurable store (in-memory or PostgreSQL via connect-pg-simple)
- Scrypt for password hashing with salt

**Database:**
- PostgreSQL as the primary database
- Drizzle ORM for type-safe database queries and migrations
- Neon Database serverless driver for PostgreSQL connections
- Schema includes: users, driveways, bookings, and reviews tables

**AI Integration:**
- OpenAI GPT-4o for conversational assistance and recommendations
- Anthropic Claude SDK integrated but OpenAI is primary
- Multiple AI feature types: general assistance, event parking, airport travel, commuter parking, personalized recommendations

### Application Architecture

**Monorepo Structure:**
- `/client` - React frontend application
- `/server` - Express backend API
- `/shared` - Shared TypeScript types and schemas (Zod/Drizzle)
- `/migrations` - Database migration files

**Authentication & Session Management:**
- Session-based authentication using Passport Local Strategy
- Sessions stored in configurable store (memory store for development, PostgreSQL for production)
- Password security via scrypt hashing with random salts
- Session cookies with secure flag in production
- Protected routes using isAuthenticated middleware

**Data Storage Patterns:**
- Dual storage implementation: In-memory storage (MemStorage) for development/testing and database storage for production
- Storage interface (IStorage) defines contracts for all data operations
- Supports CRUD operations for users, driveways, bookings, and reviews
- Search functionality with location-based filtering (latitude/longitude)

**Frontend State Management:**
- TanStack Query for server state with automatic caching and revalidation
- Custom query client with credential inclusion for authenticated requests
- Optimistic updates and invalidation patterns for mutations
- Error handling with 401 unauthorized behavior configuration

**AI Features Architecture:**
- Modular AI feature system with enum-based feature types
- Separate response schemas for different AI contexts (events, airports, commuters)
- Integration with parking predictor for availability checks
- Mock data fallbacks for AI recommendations

### API Design

**Authentication Endpoints:**
- POST `/api/register` - User registration
- POST `/api/login` - User login
- POST `/api/logout` - User logout
- GET `/api/me` - Get current user

**Driveway Endpoints:**
- GET `/api/driveways` - List all driveways
- GET `/api/driveways/:id` - Get specific driveway
- POST `/api/driveways` - Create new driveway (authenticated)
- PUT `/api/driveways/:id` - Update driveway (authenticated, owner only)
- DELETE `/api/driveways/:id` - Delete driveway (authenticated, owner only)
- GET `/api/my-driveways` - Get user's driveways (authenticated)
- GET `/api/driveways/search` - Search driveways with filters

**Booking Endpoints:**
- POST `/api/bookings` - Create booking (authenticated)
- GET `/api/my-bookings` - Get user's bookings (authenticated)
- POST `/api/bookings/:id/cancel` - Cancel booking (authenticated)

**AI Endpoints:**
- POST `/api/ai/query` - General AI assistance
- POST `/api/ai/event-parking` - Event-specific recommendations
- POST `/api/ai/airport-parking` - Airport parking recommendations
- POST `/api/ai/commuter-parking` - Commuter parking suggestions
- GET `/api/ai/personalized` - Personalized recommendations (authenticated)

### Data Models

**User Model:**
- Basic authentication fields (username, email, password)
- Profile information (name, phone number)
- Relationships to driveways (as owner) and bookings

**Driveway Model:**
- Location data (address, city, state, zip, lat/lng coordinates)
- Pricing (hourly rate)
- Availability (weekdays, start/end times)
- Metadata (description, amenities, image URL)
- Rating system (average rating, rating count)
- Active/inactive status

**Booking Model:**
- User and driveway references
- Time range (start/end timestamps)
- Pricing (total price)
- Status tracking (confirmed, completed, cancelled)

**Review Model:**
- Driveway and user references
- Rating (1-5 stars)
- Comment text
- Timestamp

### UI/UX Patterns

**Component Architecture:**
- Reusable UI components from Shadcn/ui library
- Custom components for domain-specific features (DrivewayCard, SearchForm, AIAssistant)
- Map integration for visual location selection and display
- Modal patterns for search results and detailed views

**Form Handling:**
- React Hook Form for performance and developer experience
- Zod schema validation matching backend schemas
- Inline error display and validation feedback
- Custom date/time pickers with availability constraints

**Responsive Design:**
- Mobile-first approach with Tailwind breakpoints
- Custom mobile detection hook for adaptive UI
- Collapsible navigation for mobile devices
- Touch-friendly interactive elements

## External Dependencies

### Third-Party Services

**Google Maps API:**
- Geocoding for address to coordinates conversion
- Map display for location visualization
- Hard-coded API key in MapSearchModal component for reliability
- Fallback location data for common cities

**OpenAI API:**
- GPT-4o model for AI assistance features
- Structured outputs with Zod schema validation
- API key configured via environment variable

**Neon Database:**
- Serverless PostgreSQL hosting
- Connection via @neondatabase/serverless driver
- Database URL configured via environment variable

### Key NPM Packages

**Core Framework:**
- `express` - Web server framework
- `react` & `react-dom` - UI library
- `vite` - Build tool and dev server

**Authentication:**
- `passport` - Authentication middleware
- `passport-local` - Local authentication strategy
- `express-session` - Session management
- `connect-pg-simple` - PostgreSQL session store

**Database:**
- `drizzle-orm` - TypeScript ORM
- `drizzle-kit` - Migration tooling
- `@neondatabase/serverless` - Neon PostgreSQL driver

**AI/ML:**
- `openai` - OpenAI API client
- `@anthropic-ai/sdk` - Anthropic Claude SDK

**Validation:**
- `zod` - Schema validation
- `@hookform/resolvers` - Form validation integration

**UI Components:**
- `@radix-ui/*` - Headless UI primitives (30+ packages)
- `tailwindcss` - Utility-first CSS framework
- `class-variance-authority` - Component variant management

**State Management:**
- `@tanstack/react-query` - Server state management

**Routing:**
- `wouter` - Lightweight React router

**Utilities:**
- `date-fns` - Date manipulation
- `nanoid` - ID generation
- `clsx` & `tailwind-merge` - Class name utilities