import OpenAI from "openai";
import { z } from "zod";
import { handleParkingQuery } from "./parkingPredictor";

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Define AI feature types
export enum AIFeatureType {
  GENERAL_ASSISTANCE = "general_assistance",
  EVENT_PARKING = "event_parking",
  AIRPORT_TRAVEL = "airport_travel",
  COMMUTER_PARKING = "commuter_parking",
  PERSONALIZED_RECOMMENDATIONS = "personalized_recommendations",
  PARKING_AVAILABILITY = "parking_availability"
}

// Response schemas for different AI feature types
const generalAssistanceSchema = z.object({
  response: z.string(),
  suggestions: z.array(z.string()).optional()
});

const eventParkingSchema = z.object({
  response: z.string(),
  eventName: z.string().optional(),
  recommendations: z.array(z.object({
    location: z.string(),
    price: z.string().optional(),
    distance: z.string().optional(),
    benefits: z.array(z.string()).optional()
  })).optional(),
  tips: z.array(z.string()).optional()
});

const airportTravelSchema = z.object({
  response: z.string(),
  airport: z.string().optional(),
  recommendations: z.array(z.object({
    location: z.string(),
    price: z.string().optional(),
    distance: z.string().optional(),
    shuttleAvailable: z.boolean().optional(),
    benefits: z.array(z.string()).optional()
  })).optional(),
  tips: z.array(z.string()).optional()
});

const commuterParkingSchema = z.object({
  response: z.string(),
  recommendations: z.array(z.object({
    location: z.string(),
    price: z.string().optional(),
    monthlyRate: z.string().optional(),
    nearbyTransit: z.array(z.string()).optional(),
    benefits: z.array(z.string()).optional()
  })).optional(),
  tips: z.array(z.string()).optional()
});

const personalizedRecommendationsSchema = z.object({
  response: z.string(),
  userPreferences: z.object({
    preferredLocations: z.array(z.string()).optional(),
    priceRange: z.string().optional(),
    amenities: z.array(z.string()).optional()
  }).optional(),
  recommendations: z.array(z.object({
    location: z.string(),
    price: z.string().optional(),
    matchScore: z.number().optional(),
    benefits: z.array(z.string()).optional()
  })).optional()
});

// Type definitions based on zod schemas
export type GeneralAssistanceResponse = z.infer<typeof generalAssistanceSchema>;
export type EventParkingResponse = z.infer<typeof eventParkingSchema>;
export type AirportTravelResponse = z.infer<typeof airportTravelSchema>;
export type CommuterParkingResponse = z.infer<typeof commuterParkingSchema>;
export type PersonalizedRecommendationsResponse = z.infer<typeof personalizedRecommendationsSchema>;

// Helper function for creating system prompts based on feature type
function getSystemPrompt(featureType: AIFeatureType): string {
  const basePrompt = "You are an AI assistant for EasyPark, a platform that connects parking space owners with drivers seeking convenient, affordable parking solutions. ";
  
  switch (featureType) {
    case AIFeatureType.GENERAL_ASSISTANCE:
      return basePrompt + "Provide helpful and friendly responses to user queries about how to use EasyPark, parking tips, or any other parking-related questions. Keep responses concise but informative.";
    
    case AIFeatureType.EVENT_PARKING:
      return basePrompt + "You specialize in helping users find parking solutions for events like concerts, sports games, conventions, and festivals. Provide specific recommendations based on event details, offering tips to improve their parking experience. Include information about pricing, distance to venue, and benefits of each option when appropriate. Always prioritize options from EasyPark's network.";
    
    case AIFeatureType.AIRPORT_TRAVEL:
      return basePrompt + "You specialize in helping users find optimal parking solutions for airport travel. Provide recommendations for different airports, including information about shuttle services, pricing for different durations (short vs. long-term), and security features. Offer practical tips for the specific airport when possible.";
    
    case AIFeatureType.COMMUTER_PARKING:
      return basePrompt + "You specialize in helping commuters find regular parking solutions for daily or weekly use. Focus on reliability, consistency, and value for money. Suggest options near public transit connections when appropriate, and highlight monthly pass options or loyalty benefits.";
    
    case AIFeatureType.PERSONALIZED_RECOMMENDATIONS:
      return basePrompt + "Based on the user's preferences, history, and contextual information, provide highly personalized parking recommendations. Consider factors like previous bookings, stated preferences, time of day, weather conditions, and current events in the area. Make your suggestions feel tailored specifically to this user.";
    
    default:
      return basePrompt + "Provide helpful and concise information about parking solutions.";
  }
}

// Helper function to determine feature type from user query
export function determineFeatureType(query: string): AIFeatureType {
  const lowercaseQuery = query.toLowerCase();
  
  // Check for parking availability questions first
  if ((lowercaseQuery.includes("park") || lowercaseQuery.includes("spot") || lowercaseQuery.includes("space")) && 
      (lowercaseQuery.includes("available") || lowercaseQuery.includes("find") || 
       lowercaseQuery.includes("is there") || lowercaseQuery.includes("can i") ||
       lowercaseQuery.includes("at") || lowercaseQuery.includes("near") ||
       lowercaseQuery.includes("tomorrow") || lowercaseQuery.includes("today"))) {
    return AIFeatureType.PARKING_AVAILABILITY;
  }
  
  if (lowercaseQuery.includes("event") || 
      lowercaseQuery.includes("concert") || 
      lowercaseQuery.includes("game") || 
      lowercaseQuery.includes("show") || 
      lowercaseQuery.includes("festival")) {
    return AIFeatureType.EVENT_PARKING;
  }
  
  if (lowercaseQuery.includes("airport") || 
      lowercaseQuery.includes("travel") || 
      lowercaseQuery.includes("flight") || 
      lowercaseQuery.includes("terminal") || 
      lowercaseQuery.includes("vacation")) {
    return AIFeatureType.AIRPORT_TRAVEL;
  }
  
  if (lowercaseQuery.includes("commute") || 
      lowercaseQuery.includes("daily") || 
      lowercaseQuery.includes("work") || 
      lowercaseQuery.includes("monthly") || 
      lowercaseQuery.includes("weekly")) {
    return AIFeatureType.COMMUTER_PARKING;
  }
  
  if (lowercaseQuery.includes("recommend") || 
      lowercaseQuery.includes("suggestion") || 
      lowercaseQuery.includes("best for me") || 
      lowercaseQuery.includes("preference")) {
    return AIFeatureType.PERSONALIZED_RECOMMENDATIONS;
  }
  
  return AIFeatureType.GENERAL_ASSISTANCE;
}

// Main function to process user queries and generate AI responses
export async function processUserQuery(
  query: string, 
  userContext?: {
    username?: string;
    location?: string;
    pastBookings?: number;
    preferences?: string[];
    userId?: number;
  }
): Promise<
  | GeneralAssistanceResponse
  | EventParkingResponse
  | AirportTravelResponse
  | CommuterParkingResponse
  | PersonalizedRecommendationsResponse
> {
  // Determine feature type from query
  const featureType = determineFeatureType(query);
  
  // Handle parking availability queries with our specialized predictor
  if (featureType === AIFeatureType.PARKING_AVAILABILITY) {
    try {
      // Use the specialized parking predictor for availability queries
      const availabilityResponse = await handleParkingQuery(query);
      
      // Return as general assistance response
      return {
        response: availabilityResponse,
        suggestions: [
          "Would you like to book one of these spaces?",
          "Do you need directions to any of these locations?",
          "Would you like to see more parking options in this area?"
        ]
      };
    } catch (error) {
      console.error("Error processing parking availability query:", error);
      return {
        response: "I'm sorry, I couldn't check parking availability at the moment. Please try again with specific location and time details."
      };
    }
  }
  
  // Build system prompt based on feature type
  const systemPrompt = getSystemPrompt(featureType);
  
  // Add user context to the prompt if available
  let userContextPrompt = "";
  if (userContext) {
    userContextPrompt = "\n\nUser context: ";
    if (userContext.username) userContextPrompt += `Username: ${userContext.username}. `;
    if (userContext.location) userContextPrompt += `Current location: ${userContext.location}. `;
    if (userContext.pastBookings !== undefined) userContextPrompt += `Past bookings: ${userContext.pastBookings}. `;
    if (userContext.preferences && userContext.preferences.length > 0) {
      userContextPrompt += `Preferences: ${userContext.preferences.join(", ")}. `;
    }
  }

  // Prepare response format instructions based on feature type
  let responseFormatInstructions = "";
  switch (featureType) {
    case AIFeatureType.GENERAL_ASSISTANCE:
      responseFormatInstructions = "Return a JSON object with 'response' (your helpful answer) and optionally 'suggestions' (an array of follow-up questions or actions).";
      break;
    case AIFeatureType.EVENT_PARKING:
      responseFormatInstructions = "Return a JSON object with 'response' (your helpful answer), optionally 'eventName', 'recommendations' (array of objects with location, price, distance, and benefits), and 'tips' (array of helpful tips).";
      break;
    case AIFeatureType.AIRPORT_TRAVEL:
      responseFormatInstructions = "Return a JSON object with 'response' (your helpful answer), optionally 'airport', 'recommendations' (array of objects with location, price, distance, shuttleAvailable boolean, and benefits), and 'tips' (array of helpful tips).";
      break;
    case AIFeatureType.COMMUTER_PARKING:
      responseFormatInstructions = "Return a JSON object with 'response' (your helpful answer), optionally 'recommendations' (array of objects with location, price, monthlyRate, nearbyTransit, and benefits), and 'tips' (array of helpful tips).";
      break;
    case AIFeatureType.PERSONALIZED_RECOMMENDATIONS:
      responseFormatInstructions = "Return a JSON object with 'response' (your personalized answer), optionally 'userPreferences' (object with preferredLocations, priceRange, amenities), and 'recommendations' (array of objects with location, price, matchScore, and benefits).";
      break;
  }

  // Make the OpenAI API call
  try {
    const openaiResponse = await openai.chat.completions.create({
      model: "gpt-4o", // Using the latest model
      messages: [
        { role: "system", content: systemPrompt + userContextPrompt + "\n\n" + responseFormatInstructions },
        { role: "user", content: query }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    // Extract and parse the response content
    const responseContent = openaiResponse.choices[0].message.content;
    if (!responseContent) {
      throw new Error("Empty response from OpenAI");
    }

    const parsedResponse = JSON.parse(responseContent);

    // Validate the response with the appropriate schema
    switch (featureType) {
      case AIFeatureType.GENERAL_ASSISTANCE:
        return generalAssistanceSchema.parse(parsedResponse);
      case AIFeatureType.EVENT_PARKING:
        return eventParkingSchema.parse(parsedResponse);
      case AIFeatureType.AIRPORT_TRAVEL:
        return airportTravelSchema.parse(parsedResponse);
      case AIFeatureType.COMMUTER_PARKING:
        return commuterParkingSchema.parse(parsedResponse);
      case AIFeatureType.PERSONALIZED_RECOMMENDATIONS:
        return personalizedRecommendationsSchema.parse(parsedResponse);
      default:
        return generalAssistanceSchema.parse(parsedResponse);
    }
  } catch (error) {
    console.error("Error processing AI query:", error);
    // Return a simple error response that matches the schema
    return {
      response: "I'm sorry, I couldn't process your request at the moment. Please try again later."
    };
  }
}

// Function to generate parking recommendations based on location and preferences
export async function generateParkingRecommendations(
  location: string,
  preferences?: {
    eventType?: string;
    priceRange?: string;
    amenities?: string[];
    timeNeeded?: string;
  }
): Promise<{
  recommendations: Array<{
    location: string;
    description: string;
    price: string;
    features: string[];
    distance?: string;
    availability?: string;
  }>;
}> {
  // Check if OpenAI API key exists or try to use it
  try {
    // Craft a prompt for generating parking recommendations
    let prompt = `Generate realistic and helpful parking recommendations near ${location}.`;
    
    if (preferences) {
      if (preferences.eventType) prompt += ` The user is looking for parking for a ${preferences.eventType}.`;
      if (preferences.priceRange) prompt += ` Their price range is ${preferences.priceRange}.`;
      if (preferences.amenities && preferences.amenities.length > 0) {
        prompt += ` They prefer parking with the following amenities: ${preferences.amenities.join(", ")}.`;
      }
      if (preferences.timeNeeded) prompt += ` They need parking for ${preferences.timeNeeded}.`;
    }
    
    prompt += ` Please provide 3-5 specific, realistic recommendations with location names, descriptions, pricing, and features.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are an AI assistant for EasyPark, specializing in generating helpful and realistic parking recommendations. Return a JSON object with an array of 'recommendations', each containing 'location', 'description', 'price', 'features' (array of strings), and optionally 'distance' and 'availability'." 
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("Empty response from OpenAI");
    
    const parsedResponse = JSON.parse(content);
    return parsedResponse;
  } catch (error) {
    console.error("Error generating parking recommendations:", error);
    return getFallbackRecommendations(location, preferences);
  }
}

// Function to provide fallback recommendations when API fails
function getFallbackRecommendations(
  location: string,
  preferences?: {
    eventType?: string;
    priceRange?: string;
    amenities?: string[];
    timeNeeded?: string;
  }
): {
  recommendations: Array<{
    location: string;
    description: string;
    price: string;
    features: string[];
    distance?: string;
    availability?: string;
  }>;
} {
  // Create standard recommendations based on the location
  const isEvent = preferences?.eventType ? true : false;
  const isAirport = location.toLowerCase().includes("airport");
  const isArena = location.toLowerCase().includes("arena") || location.toLowerCase().includes("stadium");
  const isUBS = location.toLowerCase().includes("ubs");
  
  // Check for specific venue names
  if (isUBS || (isArena && location.toLowerCase().includes("ubs"))) {
    return {
      recommendations: [
        {
          location: "UBS Arena Official Parking",
          description: "Official on-site parking lots at UBS Arena with the closest access to entrance gates.",
          price: "$30-45/event",
          features: ["Reserved spaces", "Official venue parking", "Easy in/out access"],
          distance: "On-site"
        },
        {
          location: "UBS Arena North Lot",
          description: "Premium parking option with dedicated entrance and exit lanes.",
          price: "$40/event",
          features: ["Premium location", "Security staff", "Covered walkway to entrance"],
          distance: "0.1 miles from arena"
        },
        {
          location: "Belmont Park Commuter Lot",
          description: "More affordable option with shuttle service to the arena.",
          price: "$20/event",
          features: ["Shuttle service", "Security patrols", "Family-friendly"],
          distance: "0.8 miles from arena"
        },
        {
          location: "Elmont LIRR Station",
          description: "Park and ride option with train service to the arena.",
          price: "$10/day",
          features: ["Public transit access", "Well-lit", "24/7 availability"],
          distance: "0.5 miles from arena"
        }
      ]
    };
  } else if (isAirport) {
    return {
      recommendations: [
        {
          location: `${location} Short-Term Parking`,
          description: "Convenient short-term parking directly at the terminal. Perfect for quick drop-offs and pickups.",
          price: "$5-8/hour",
          features: ["Easy access to terminals", "24/7 security", "Well-lit"],
          distance: "0.1 miles from terminal"
        },
        {
          location: `${location} Economy Lot`,
          description: "Affordable long-term parking option with regular shuttle service to all terminals.",
          price: "$15-25/day",
          features: ["Free shuttle", "Covered options available", "Security patrols"],
          distance: "2.5 miles from terminal"
        },
        {
          location: `${location} Partner Parking`,
          description: "Off-site parking with the best rates and reliable shuttle service.",
          price: "$9-15/day",
          features: ["Shuttle every 15 minutes", "Valet options", "Car wash available"],
          distance: "3.2 miles from terminal"
        }
      ]
    };
  } else if (isEvent) {
    return {
      recommendations: [
        {
          location: `${location} Premium Event Parking`,
          description: "Closest access to the venue with guaranteed spaces.",
          price: "$25-40/event",
          features: ["Reserved spaces", "Express entry/exit", "Walking distance to venue"],
          distance: "0.2 miles from venue"
        },
        {
          location: `${location} Standard Parking`,
          description: "Official venue parking at a standard rate.",
          price: "$15-20/event",
          features: ["Official venue lot", "Security staff", "Multiple entry/exit points"],
          distance: "0.5 miles from venue"
        },
        {
          location: `${location} Overflow Parking`,
          description: "Additional parking options when main lots are full.",
          price: "$10-15/event",
          features: ["Shuttle service", "Family-friendly", "Well-lit pathways"],
          distance: "1.0 miles from venue"
        }
      ]
    };
  } else {
    return {
      recommendations: [
        {
          location: `Downtown ${location} Garage`,
          description: "Centrally located covered parking in the heart of downtown.",
          price: "$3-5/hour, $20-30/day",
          features: ["Covered parking", "Security cameras", "Elevator access"],
          distance: "Central location"
        },
        {
          location: `${location} Street Parking`,
          description: "Metered street parking available throughout the area.",
          price: "$1-3/hour during enforcement hours",
          features: ["Pay by app", "Some free after 6pm", "2-hour maximum in some zones"],
          availability: "Varies by time of day"
        },
        {
          location: `${location} Public Lot`,
          description: "Municipal parking lot with good rates and central access.",
          price: "$2-4/hour, $10-15/day",
          features: ["Open 24/7", "Well-lit", "Multiple payment options"],
          distance: "Various locations available"
        }
      ]
    };
  }
}

// Function to analyze user behavior and provide personalized suggestions
export async function generatePersonalizedSuggestions(
  userId: number | string,
  userHistory: {
    pastBookings: Array<{
      location: string;
      date: string;
      duration: string;
    }>;
    searchHistory: string[];
    preferences?: string[];
  }
): Promise<{
  suggestions: Array<{
    type: string;
    title: string;
    description: string;
    reason: string;
  }>;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are an AI assistant for EasyPark, specializing in analyzing user behavior and providing personalized parking suggestions. Based on the user's history and preferences, generate tailored recommendations. Return a JSON object with an array of 'suggestions', each containing 'type' (e.g., 'event', 'commuter', 'airport'), 'title', 'description', and 'reason' (why this is recommended)." 
        },
        { 
          role: "user", 
          content: `Generate personalized parking suggestions for user ${userId} based on the following history:\n` +
                  `Past bookings: ${JSON.stringify(userHistory.pastBookings)}\n` +
                  `Search history: ${JSON.stringify(userHistory.searchHistory)}\n` +
                  `Preferences: ${userHistory.preferences ? JSON.stringify(userHistory.preferences) : "None specified"}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("Empty response from OpenAI");
    
    const parsedResponse = JSON.parse(content);
    return parsedResponse;
  } catch (error) {
    console.error("Error generating personalized suggestions:", error);
    return {
      suggestions: [
        {
          type: "general",
          title: "Explore Nearby Parking Options",
          description: "Check out parking spaces available in your most frequently visited areas.",
          reason: "Based on your typical parking patterns"
        },
        {
          type: "event",
          title: "Event Parking Recommendations",
          description: "Find the best parking options for upcoming events in your area.",
          reason: "Tailored to your preferences"
        },
        {
          type: "airport",
          title: "Airport Parking Options",
          description: "Discover convenient and affordable airport parking solutions.",
          reason: "For your next trip"
        }
      ]
    };
  }
}