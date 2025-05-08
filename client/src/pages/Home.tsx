import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchForm from "@/components/SearchForm";
import FAQAccordion from "@/components/FAQAccordion";
import DrivewayCard from "@/components/DrivewayCard";
import AIAssistant from "@/components/AIAssistant";
import PersonalizedRecommendations from "@/components/PersonalizedRecommendations";
import EventParkingRecommendations from "@/components/EventParkingRecommendations";
import AirportParkingFinder from "@/components/AirportParkingFinder";
import { useQuery } from "@tanstack/react-query";
import { Driveway } from "@shared/schema";
import { 
  Search, 
  CalendarCheck, 
  Car, 
  Apple, 
  Play 
} from "lucide-react";

export default function Home() {
  // Fetch featured driveways
  const { data: driveways, isLoading, error } = useQuery<Driveway[]>({
    queryKey: ['/api/driveways'],
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col-reverse lg:flex-row">
            <div className="relative z-10 bg-white px-4 py-10 sm:px-6 lg:py-16 lg:w-1/2">
              <div className="text-center lg:text-left max-w-xl mx-auto lg:mx-0">
                <h1 className="text-4xl tracking-tight font-bold text-gray-900 sm:text-5xl">
                  <span className="block">Find convenient</span>
                  <span className="block text-primary">parking near you</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg">
                  Rent a driveway by the hour and save money on parking. Or make money by renting out your unused space.
                </p>
                
                {/* Search Form */}
                <div className="mt-8 sm:mt-12">
                  <SearchForm />
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <div className="h-56 w-full sm:h-72 md:h-96 lg:h-full overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1590674899484-d5640e854abe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                  alt="Driveway parking" 
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-12 bg-white" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Easy Process</h2>
            <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
              How EasyPark Works
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Save money on parking or earn money by renting out your driveway in just a few simple steps.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <Search className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">1. Find a space</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Search for available driveways near your destination. Compare prices and locations to find the perfect spot.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <CalendarCheck className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">2. Book instantly</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Select your parking dates and times, and book your space instantly. Receive immediate confirmation.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <Car className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">3. Park with ease</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Follow the directions to your booked driveway. Park stress-free, knowing your spot is reserved.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Featured Listings */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Parking Spaces</h2>
            <Link href="/search" className="text-primary hover:text-blue-600 font-medium flex items-center">
              View all
              <svg className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 h-80 animate-pulse">
                  <div className="h-40 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mt-4"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500">Error loading driveways. Please try again later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* First row - dynamic driveways */}
              {driveways && driveways.length > 0 && driveways.slice(0, 3).map((driveway) => (
                <DrivewayCard key={driveway.id} driveway={driveway} />
              ))}
              
              {/* Second row - static driveways with real images and addresses */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 w-full relative">
                  <img 
                    src="https://media-hosting.imagekit.io/ae6b392d25464cf7/Screenshot%202025-05-07%20at%208.39.05%E2%80%AFPM.png?Expires=1841272754&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=q8ogfqr2PNMfEVFkN15OR8V3EHaa4UVuMsjjZnyQs9Az8YanGUuPzpGQ0Ayu7uL79YminVMLybaoK-AtU3003vy-IH7jULY4Lhxk326QEY9KgEPuF4XTRk276Uxzt0zbCg4N3blOIlYCm6FVpnwPs0OmJNvyWNsgV2jAHgtYl0RRUFn2dTnuzRVJv0IVrcldRsEjfcUTnnvAgSE9q63o96zsxZv86KdXY~rbLYtlSB9rx10Qa0icKSvU3F10d-oXfpO3IX7NYHhe~fvebgA4Fzwq8stwTxNb94bJ0YKu6hGFZAd~-IOtFJPIXBIW4BY5w1l9VW4Kb69k60KJl~riPg__" 
                    alt="Residential driveway" 
                    className="w-full h-full object-cover"
                    loading="eager"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-semibold text-primary">
                    $4.50/hr
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">432 Maple Street</h3>
                  <p className="text-gray-600 text-sm mb-2">Brookfield, IL 60513</p>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span className="flex items-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      Easy access
                    </span>
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Secure
                    </span>
                  </div>
                  <Link href="/search">
                    <Button variant="outline" className="w-full">View Details</Button>
                  </Link>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 w-full relative">
                  <img 
                    src="https://media-hosting.imagekit.io/6800d73188a54589/Screenshot%202025-05-07%20at%208.10.02%E2%80%AFPM.png?Expires=1841271014&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=XMHGkpTLnLV15l0kUJrsZkLwreTCRnyrNNuTsljNkyZGIfKcWDHRqok0X2xhCJZCP3VrTPKTWQ1UtjB4xELclFpYJyODD3e2Uz~dMjX7808vPbxXy3BOO0kdh79IqKcdTFKcQYSDuv3bzu9LmWI~4pvbPbRTDM2faUqeSMKHK0BaBRqwRuglh-IaLlVba9L6Sy~WjIxHNfmQ4aajsuVpU0~Oo64wQW1hxW1nu7-74JCJgwsQDycnVLwikUY7fNwAmUQxkvUO5maT6iqZWnHolyCASZXVhpZJyQIBeHxl6bDrD2HEO~Ef8vHVxAA6NPctN9ynr0yvIyLSJCflwXNiuw__" 
                    alt="Urban garage entry" 
                    className="w-full h-full object-cover"
                    loading="eager"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-semibold text-primary">
                    $6.75/hr
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">1722 Market Street, Unit G</h3>
                  <p className="text-gray-600 text-sm mb-2">San Francisco, CA 94102</p>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span className="flex items-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      EV charging
                    </span>
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      24/7 support
                    </span>
                  </div>
                  <Link href="/search">
                    <Button variant="outline" className="w-full">View Details</Button>
                  </Link>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 w-full relative">
                  <img 
                    src="https://media-hosting.imagekit.io/aebff09f96474fa7/Screenshot%202025-05-07%20at%208.13.08%E2%80%AFPM.png?Expires=1841271197&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=G-9IPw9nZLvVivDdAokPrF8J1Fg81cqk8kYtpcvbFWNFZ3qJysUjqljjIDnrmA5iyMcCwlRFLr62RqYVGGvOBxiRxfoePuyXzzl6i5ImkpU7J8d~GivZ7dNDtFpuUC4SaXeXqTXgDGamQqd~UXvaddXnU-ba6Zmi5kRWIw3y1QZ5BlvroFz0mJFHewu8nEhevlVnbubbIW2SfZpauAYNUADRW76Jg3mOFu1PnVqgSGkB7IdHH-G1M01WJ7PRJRSDp2FsksjI2durhzPlC9ho~yQ6hQiam941zKJY71OlxofaBBwOFFqRU1A~zKBP75F1b9hzjPZB5GUQOkci3tv5~A__" 
                    alt="Covered parking garage" 
                    className="w-full h-full object-cover"
                    loading="eager"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-semibold text-primary">
                    $8.00/hr
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">847 Pine Avenue</h3>
                  <p className="text-gray-600 text-sm mb-2">San Francisco, CA 94108</p>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span className="flex items-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                      Weather protected
                    </span>
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      Premium spot
                    </span>
                  </div>
                  <Link href="/search">
                    <Button variant="outline" className="w-full">View Details</Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Listing CTA Section */}
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            <span className="block">Have an empty driveway?</span>
            <span className="block text-blue-200">Turn it into extra income today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link href="/list-driveway">
                <Button variant="secondary" size="lg" className="text-primary bg-white hover:bg-gray-50">
                  List your driveway
                </Button>
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-10">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Testimonials</h2>
            <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
              What Our Users Say
            </p>
          </div>
          
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <img 
                  src="https://randomuser.me/api/portraits/women/68.jpg" 
                  alt="User testimonial" 
                  className="h-12 w-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Sarah T.</h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-yellow-400">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <blockquote className="text-gray-600">
                "I never thought I could make so much extra money from my unused driveway! EasyPark made it simple to list my space and I've had consistent bookings for months."
              </blockquote>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <img 
                  src="https://randomuser.me/api/portraits/men/32.jpg" 
                  alt="User testimonial" 
                  className="h-12 w-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Michael R.</h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-yellow-400">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <blockquote className="text-gray-600">
                "Parking in downtown used to be a nightmare. With EasyPark, I find affordable parking within minutes no matter where I'm going. A total game-changer for my commute!"
              </blockquote>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <img 
                  src="https://randomuser.me/api/portraits/women/45.jpg" 
                  alt="User testimonial" 
                  className="h-12 w-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Jennifer L.</h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-yellow-400">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <blockquote className="text-gray-600">
                "When I travel for work, I used to worry about airport parking costs. Now I book a spot through EasyPark for less than half the price of the airport lots. Highly recommend!"
              </blockquote>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Questions & Answers</h2>
            <p className="mt-2 text-3xl font-bold text-gray-900">Frequently Asked Questions</p>
          </div>
          
          <FAQAccordion />
          
          <div className="mt-10 text-center">
            <p className="text-gray-600 mb-4">Have more questions?</p>
            <Button variant="outline" className="bg-white">Visit our help center</Button>
          </div>
        </div>
      </div>

      {/* AI Powered Features Section */}
      <div className="bg-gradient-to-b from-white to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">AI Powered Features</h2>
            <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
              Smarter Parking Solutions
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Our AI technology helps you find the perfect parking spot based on your specific needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <EventParkingRecommendations />
            </div>
            <div className="space-y-8">
              <PersonalizedRecommendations />
              <AirportParkingFinder />
            </div>
          </div>
        </div>
      </div>

      {/* App Download */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:max-w-xl">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Download the EasyPark app
              </h2>
              <p className="mt-3 text-xl text-gray-500">
                Book and manage your parking spaces on the go. Get real-time notifications and directions right from our mobile app.
              </p>
              <div className="mt-8 flex space-x-4">
                <Button className="flex items-center bg-black hover:bg-gray-800 text-white">
                  <Apple className="h-6 w-6 mr-2" />
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-base font-medium">App Store</div>
                  </div>
                </Button>
                <Button className="flex items-center bg-black hover:bg-gray-800 text-white">
                  <Play className="h-6 w-6 mr-2" />
                  <div className="text-left">
                    <div className="text-xs">Get it on</div>
                    <div className="text-base font-medium">Google Play</div>
                  </div>
                </Button>
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              <img 
                src="https://images.unsplash.com/photo-1616169201999-0fe189c680fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                alt="Mobile app" 
                className="rounded-lg shadow-xl max-w-xs mx-auto"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Add the AI Assistant component */}
      <AIAssistant initialOpen={false} />

      <Footer />
    </div>
  );
}