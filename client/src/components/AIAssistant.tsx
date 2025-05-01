import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Calendar, Plane, Car, MapPin, X, Send, Sparkles, ExternalLink } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

// Define message types and interfaces
interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  type?: "general" | "event" | "airport" | "commuter" | "personalized";
  timestamp: Date;
  suggestions?: string[];
  recommendations?: any[];
  links?: { text: string; url: string }[];
}

type AIAssistantProps = {
  initialOpen?: boolean;
};

// Cities with parking locations
const SUPPORTED_CITIES = [
  { name: "san francisco", displayName: "San Francisco" },
  { name: "new york", displayName: "New York" },
  { name: "chicago", displayName: "Chicago" },
  { name: "los angeles", displayName: "Los Angeles" },
  { name: "boston", displayName: "Boston" },
  { name: "seattle", displayName: "Seattle" },
  { name: "miami", displayName: "Miami" },
  { name: "austin", displayName: "Austin" }
];

export function AIAssistant({ initialOpen = false }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Add initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          content: "Hi there! I'm your AI parking assistant. How can I help you today?",
          sender: "assistant",
          type: "general",
          timestamp: new Date(),
          suggestions: [
            "I need parking in San Francisco",
            "Find parking in New York",
            "I need parking in Chicago",
            "What parking spots do you recommend?"
          ]
        }
      ]);
    }
  }, []);

  // Check if the user's message contains a city name
  const checkForCityInQuery = (query: string): { found: boolean; city?: { name: string; displayName: string } } => {
    const lowerQuery = query.toLowerCase();
    for (const city of SUPPORTED_CITIES) {
      if (lowerQuery.includes(city.name)) {
        return { found: true, city };
      }
    }
    return { found: false };
  };

  // Create a city-specific parking search response
  const createCityParkingResponse = (city: { name: string; displayName: string }): Message => {
    const searchUrl = `/search?location=${encodeURIComponent(city.displayName)}`;
    
    return {
      id: Date.now().toString(),
      content: `I found several available parking spots in ${city.displayName}! You can view them on the map or in a list format.`,
      sender: "assistant",
      type: "general",
      timestamp: new Date(),
      links: [
        { 
          text: `View parking in ${city.displayName}`, 
          url: searchUrl 
        }
      ],
      recommendations: [
        {
          location: `${city.displayName} Downtown`,
          price: "$5.75/hr",
          distance: "0.5 miles from center",
          benefits: ["Covered", "24/7 Access", "Security"]
        },
        {
          location: `${city.displayName} Uptown`,
          price: "$4.50/hr",
          distance: "1.2 miles from center",
          benefits: ["EV Charging", "Well-lit"]
        }
      ],
      suggestions: [
        `Show me more parking in ${city.displayName}`,
        "I need cheaper options",
        "Do you have monthly parking?"
      ]
    };
  };

  // Create generic search response
  const createGenericResponse = (query: string): Message => {
    return {
      id: Date.now().toString(),
      content: "I can help you find parking! Here are some popular cities where we have available spaces:",
      sender: "assistant",
      type: "general",
      timestamp: new Date(),
      suggestions: SUPPORTED_CITIES.map(city => `I need parking in ${city.displayName}`),
      links: SUPPORTED_CITIES.slice(0, 3).map(city => ({
        text: `View parking in ${city.displayName}`,
        url: `/search?location=${encodeURIComponent(city.displayName)}`
      }))
    };
  };

  // Local message handling (without API calls)
  const handleLocalMessage = (userQuery: string): Message => {
    const cityCheck = checkForCityInQuery(userQuery);
    
    if (cityCheck.found && cityCheck.city) {
      return createCityParkingResponse(cityCheck.city);
    }
    
    return createGenericResponse(userQuery);
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Using local handling instead of API due to quota issues
      const assistantMessage = handleLocalMessage(userMessage.content);
      
      // Simulate network delay for more natural conversation
      setTimeout(() => {
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 800);

    } catch (error) {
      console.error("Error processing message:", error);
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Sorry, I encountered an error processing your request. Please try again later.",
        sender: "assistant",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  // Handle key press (Enter to send)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          onClick={() => setIsOpen(true)} 
          className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90"
        >
          <Sparkles className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-80 md:w-96 shadow-xl border-2 border-primary/20 overflow-hidden">
        <CardHeader className="p-4 pb-2 bg-primary/5">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary" />
              AI Parking Assistant
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full" 
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 h-9 mt-2">
              <TabsTrigger value="general" className="py-1 px-2">
                <MessageCircle className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="event" className="py-1 px-2">
                <Calendar className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="airport" className="py-1 px-2">
                <Plane className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="commuter" className="py-1 px-2">
                <Car className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="personalized" className="py-1 px-2">
                <MapPin className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent className="p-0">
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    message.sender === "user" 
                      ? "bg-primary text-white" 
                      : "bg-white border border-gray-200 shadow-sm"
                  }`}
                >
                  {message.type && message.sender === "assistant" && (
                    <Badge 
                      variant="outline" 
                      className="mb-1 text-xs px-1.5 py-0 h-5"
                    >
                      {message.type === "general" && "Assistant"}
                      {message.type === "event" && "Event Parking"}
                      {message.type === "airport" && "Airport Travel"}
                      {message.type === "commuter" && "Commuter"}
                      {message.type === "personalized" && "Personalized"}
                    </Badge>
                  )}
                  <div className="text-sm whitespace-pre-line">{message.content}</div>
                  
                  {/* Show links if available */}
                  {message.links && message.links.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.links.map((link, i) => (
                        <Link key={i} href={link.url}>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full justify-start text-xs h-auto py-1.5"
                          >
                            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                            {link.text}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                  
                  {/* Show suggestions if available */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {message.suggestions.map((suggestion, i) => (
                        <Badge 
                          key={i} 
                          variant="secondary"
                          className="cursor-pointer hover:bg-secondary/80 transition-colors"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {/* Show recommendations if available */}
                  {message.recommendations && message.recommendations.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.recommendations.map((rec, i) => (
                        <div key={i} className="text-xs p-2 bg-gray-50 rounded border">
                          <div className="font-medium">{rec.location}</div>
                          {rec.price && <div>Price: {rec.price}</div>}
                          {rec.distance && <div>Distance: {rec.distance}</div>}
                          {rec.benefits && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {rec.benefits.map((benefit: string, j: number) => (
                                <Badge key={j} variant="outline" className="text-[10px] px-1 py-0">
                                  {benefit}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>

        <CardFooter className="p-2 flex gap-2 border-t bg-white">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || !inputValue.trim()} 
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default AIAssistant;