import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import ListDriveway from "@/pages/ListDriveway";
import Search from "@/pages/Search";
import DrivewayDetails from "@/pages/DrivewayDetails";
import BookingPage from "@/pages/BookingPage";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is logged in
  const { data: user, error } = useQuery({
    queryKey: ['/api/me'],
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setIsLoading(false);
    
    if (error) {
      // User is not logged in, but we don't need to show an error
      // as we already handle authentication in the routes
    }
  }, [error]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <TooltipProvider>
      <Toaster />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/list-driveway" component={ListDriveway} />
        <Route path="/search" component={Search} />
        <Route path="/driveways/:id" component={DrivewayDetails} />
        <Route path="/book/:id" component={BookingPage} />
        <Route component={NotFound} />
      </Switch>
    </TooltipProvider>
  );
}

export default App;
