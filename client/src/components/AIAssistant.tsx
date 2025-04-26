import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Calendar, Plane, Car, MapPin, X, Send, Sparkles } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// Define message types and interfaces
interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  type?: "general" | "event" | "airport" | "commuter" | "personalized";
  timestamp: Date;
  suggestions?: string[];
  recommendations?: any[];
}

type AIAssistantProps = {
  initialOpen?: boolean;
};

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
            "I need parking for a concert",
            "Help me find airport parking",
            "I need daily commuter parking",
            "What parking spots do you recommend?"
          ]
        }
      ]);
    }
  }, []);

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
      // Determine endpoint based on active tab
      let endpoint = "/api/ai/assistant";
      let type = "general";
      
      switch (activeTab) {
        case "event":
          endpoint = "/api/ai/event-parking";
          type = "event";
          break;
        case "airport":
          endpoint = "/api/ai/airport-travel";
          type = "airport";
          break;
        case "commuter":
          endpoint = "/api/ai/commuter-parking";
          type = "commuter";
          break;
        case "personalized":
          endpoint = "/api/ai/assistant"; // Using general endpoint with personalized context
          type = "personalized";
          break;
      }
      
      // Call API
      const response = await apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify({ query: inputValue })
      });
      
      // Add AI response to chat
      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: response.response || "I'm sorry, I couldn't process your request.",
        sender: "assistant",
        type: type as "general" | "event" | "airport" | "commuter" | "personalized",
        timestamp: new Date(),
        suggestions: response.suggestions,
        recommendations: response.recommendations
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message to AI assistant:", error);
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Sorry, I encountered an error processing your request. Please try again later.",
        sender: "assistant",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
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