import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, CalendarCheck, Car, UserCheck, BankNote, LocateFixed } from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/10 to-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              How EasyPark Works
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Find out how our platform connects driveway owners with people looking for affordable and convenient parking options.
            </p>
          </div>
        </div>
      </div>
      
      {/* For Drivers Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">For Drivers</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Finding and booking a parking space has never been easier. Follow these simple steps:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">1. Search</h3>
              <p className="text-gray-600 text-center">
                Enter your destination address, date, and time to find available parking spaces nearby.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <CalendarCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">2. Book</h3>
              <p className="text-gray-600 text-center">
                Choose the perfect spot and book it instantly. Secure payment through our platform.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">3. Park</h3>
              <p className="text-gray-600 text-center">
                Follow the directions to your reserved spot. Park with confidence, knowing it's waiting for you.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/search">
              <Button size="lg" className="bg-primary text-white">
                Find Parking Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* For Driveway Owners Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">For Driveway Owners</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Turn your empty driveway into a steady source of income. Here's how:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <UserCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">1. Register</h3>
              <p className="text-gray-600 text-center">
                Create an account and list your driveway with photos, description, and availability.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <LocateFixed className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">2. Host</h3>
              <p className="text-gray-600 text-center">
                Receive booking requests and confirm them. Provide clear instructions for drivers.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <BankNote className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">3. Earn</h3>
              <p className="text-gray-600 text-center">
                Get paid automatically after each completed booking. Earnings are transferred to your account.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/list-driveway">
              <Button size="lg" className="bg-primary text-white">
                List Your Driveway
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* FAQs */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about using EasyPark.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">How do I know my parking spot is guaranteed?</h3>
              <p className="text-gray-600">
                Once your booking is confirmed, the space is reserved exclusively for you during the selected time period. The driveway owner has committed to keeping it available.
              </p>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">What if I need to cancel my booking?</h3>
              <p className="text-gray-600">
                You can cancel your booking up to 24 hours before the reserved time for a full refund. Cancellations within 24 hours may be eligible for a partial refund.
              </p>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Is my car protected while parked in someone's driveway?</h3>
              <p className="text-gray-600">
                While driveway owners agree to provide safe parking spaces, EasyPark recommends that you do not leave valuables in your vehicle. Check the space's security features before booking.
              </p>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">How do I get paid as a driveway owner?</h3>
              <p className="text-gray-600">
                Payments are processed automatically through our secure platform. After a booking is completed, funds are transferred to your account within 1-3 business days.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/help-center">
              <Button variant="outline" className="bg-white">
                Visit Our Help Center
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* CTA Banner */}
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left md:w-2/3">
            <h2 className="text-2xl font-bold text-white mb-2">Ready to get started?</h2>
            <p className="text-blue-100">Join thousands of users finding and sharing parking spaces every day.</p>
          </div>
          <div className="mt-6 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <Link href="/search">
              <Button className="bg-white text-primary hover:bg-gray-100">Find Parking</Button>
            </Link>
            <Link href="/list-driveway">
              <Button variant="outline" className="text-white border-white hover:bg-blue-600">List Your Space</Button>
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}