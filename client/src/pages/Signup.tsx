import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ParkingMeter, Loader2, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

// Extended user schema with password confirmation
const signupSchema = insertUserSchema
  .extend({
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function Signup() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Get redirect param if exists
  const params = new URLSearchParams(location.search);
  const redirectPath = params.get("redirect") || "/dashboard";
  
  // Check if user is already logged in
  const { data: user, isLoading: isCheckingAuth } = useQuery({
    queryKey: ['/api/me'],
    retry: false,
    refetchOnWindowFocus: false,
  });
  
  // If already logged in, redirect
  useEffect(() => {
    if (user && !isCheckingAuth) {
      navigate(redirectPath);
    }
  }, [user, isCheckingAuth, navigate, redirectPath]);
  
  // Create form
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "12341234",
      confirmPassword: "12341234",
      name: "",
      phoneNumber: "",
    },
  });
  
  // Form submission handler
  async function onSubmit(values: SignupFormValues) {
    setIsLoading(true);
    setError("");
    
    try {
      // Omit confirmPassword from the values sent to API
      const { confirmPassword, ...signupData } = values;
      
      const response = await apiRequest("POST", "/api/register", signupData);
      const data = await response.json();
      
      // If successful registration
      queryClient.invalidateQueries({ queryKey: ['/api/me'] });
      
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully.",
        variant: "default",
      });
      
      // Redirect after successful registration
      navigate(redirectPath);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to create account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }
  
  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header with logo */}
      <div className="container flex justify-center pt-8">
        <Link href="/" className="flex items-center">
          <ParkingMeter className="text-primary h-8 w-8 mr-2" />
          <span className="text-2xl font-bold text-primary">EasyPark</span>
        </Link>
      </div>
      
      <div className="flex flex-col justify-center items-center flex-grow px-4 py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
            <CardDescription className="text-center">
              Enter your details to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your full name" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Choose a username" 
                            {...field} 
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="Enter your email" 
                            {...field} 
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your phone number" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Create a password" 
                            {...field} 
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Confirm your password" 
                            {...field} 
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Sign up"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="text-center text-sm text-gray-500 mt-2">
              Already have an account?{" "}
              <Link 
                href={`/login${redirectPath !== "/dashboard" ? `?redirect=${redirectPath}` : ""}`}
                className="text-primary hover:underline"
              >
                Log in
              </Link>
            </p>
            <div className="text-center mt-4">
              <Link href="/" className="text-sm text-gray-500 hover:underline">
                Back to home
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
