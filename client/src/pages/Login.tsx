import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema } from "@shared/schema";
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

export default function Login() {
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
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  // Form submission handler
  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await apiRequest("POST", "/api/login", values);
      const data = await response.json();
      
      // If successful login
      queryClient.invalidateQueries({ queryKey: ['/api/me'] });
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
        variant: "default",
      });
      
      // Redirect after successful login
      navigate(redirectPath);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Invalid username or password");
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
          <span className="text-2xl font-bold text-primary">ParkShare</span>
        </Link>
      </div>
      
      <div className="flex flex-col justify-center items-center flex-grow px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Log in to your account</CardTitle>
            <CardDescription className="text-center">
              Enter your username and password to access your account
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
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your username" 
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Enter your password" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Log in"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="text-center text-sm text-gray-500 mt-2">
              Don't have an account?{" "}
              <Link 
                href={`/signup${redirectPath !== "/dashboard" ? `?redirect=${redirectPath}` : ""}`}
                className="text-primary hover:underline"
              >
                Sign up
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
