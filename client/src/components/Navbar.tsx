import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ParkingMeter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const { data: user } = useQuery({
    queryKey: ['/api/me'],
    retry: false,
    refetchOnWindowFocus: false,
  });

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await apiRequest('POST', '/api/logout', {});
      
      // Invalidate user cache and redirect to home
      queryClient.invalidateQueries({ queryKey: ['/api/me'] });
      navigate('/');
      
      toast({
        title: "Logged out successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Failed to log out",
        description: "Please try again later",
        variant: "destructive",
      });
    }
    
    // Also close mobile menu if open
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <ParkingMeter className="text-primary h-8 w-8 mr-2" />
              <span className="text-2xl font-bold text-primary">ParkShare</span>
            </Link>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            <Link href="/search" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
              Find ParkingMeter
            </Link>
            <Link href={user ? "/list-driveway" : "/login"} className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
              List Your Space
            </Link>
            <Link href="#how-it-works" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
              How It Works
            </Link>
            
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline" className="mr-2">Dashboard</Button>
                </Link>
                <Button onClick={handleLogout}>Log Out</Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button>Log In</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="outline">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
          
          <div className="flex items-center sm:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`sm:hidden ${mobileMenuOpen ? '' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link href="/search" className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50">
            Find ParkingMeter
          </Link>
          <Link href={user ? "/list-driveway" : "/login"} className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50">
            List Your Space
          </Link>
          <Link href="#how-it-works" className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50">
            How It Works
          </Link>
          
          <div className="mt-4 flex flex-col space-y-2 px-3">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full mb-2">Dashboard</Button>
                </Link>
                <Button onClick={handleLogout} className="w-full">Log Out</Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button className="w-full mb-2">Log In</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="outline" className="w-full">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
