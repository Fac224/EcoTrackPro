import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchForm from "@/components/SearchForm";
import FAQAccordion from "@/components/FAQAccordion";
import DrivewayCard from "@/components/DrivewayCard";
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
      <div className="relative bg-white overflow-hidden pb-16 lg:pb-0">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 bg-white lg:max-w-2xl lg:w-full lg:pb-28">
            <div className="lg:absolute lg:top-0 lg:bottom-0 lg:left-0 lg:w-1/2 bg-white"></div>
            <main className="mx-auto max-w-7xl px-4 pt-10 sm:pt-12 sm:px-6 lg:pt-16">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-bold text-gray-900 sm:text-5xl">
                  <span className="block">Find convenient</span>
                  <span className="block text-primary">parking near you</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto lg:mx-0">
                  Rent a driveway by the hour and save money on parking. Or make money by renting out your unused space.
                </p>
                
                {/* Search Form */}
                <div className="mt-8 sm:mt-12 lg:mt-8">
                  <SearchForm />
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full overflow-hidden bg-gradient-to-r from-blue-50 to-blue-100">
            <img 
              src="https://media-hosting.imagekit.io/2b8ac82dd3784305/Screenshot%202025-04-23%20at%208.50.17%E2%80%AFPM.png?Expires=1840063849&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=M6ihqYDYWXpb9nYluh1l44zyA~p205hCCrPnHBtP9PbPYMYd8d5DhKD338dY2GRKO9PVhhcJyP5WLJ380TLObnpeYaije1dHEiYeskYUGmAjFsxANmaRnzKJqwv5sK7VZbGxu67iCjtklQyJcwW7b3e37qh3deBTE6kKTdD-Gy7TpgDoAMwT-nuixUDaLyen1VOUurb32rYGMDUz6cCfh135-DJxvQK35hQ8v0Z1HAy8NmD1PVb46jfyX-XYl0XOVhIbi3-0yEevei3sTXTErLuBwGypA-~I18EGLOkgJhPQlCKIzVqBVpKaA0rTiwb8JMeMzN6gPjJVAh5f9dbrxQ__" 
              alt="Driveway parking" 
              className="w-full h-full object-cover object-center"
            />
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
              
              {/* Second row - static driveways with real images */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 w-full relative">
                  <img 
                    src="https://images.unsplash.com/photo-1603091791733-9b3b8daddaa0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                    alt="Suburban driveway" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-semibold text-primary">
                    $4.50/hr
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">Spacious Suburban Driveway</h3>
                  <p className="text-gray-600 text-sm mb-2">567 Oak Avenue, Portland</p>
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
                    src="https://images.unsplash.com/photo-1597844710426-aee197cf1854?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                    alt="Downtown driveway" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-semibold text-primary">
                    $6.75/hr
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">Downtown Private Spot</h3>
                  <p className="text-gray-600 text-sm mb-2">123 Market Street, San Francisco</p>
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
                    src="https://images.unsplash.com/photo-1567358812567-2828d36c3f1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                    alt="Private garage" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-semibold text-primary">
                    $8.00/hr
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">Covered Garage Parking</h3>
                  <p className="text-gray-600 text-sm mb-2">456 Pine Road, Seattle</p>
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
          
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-500 italic mb-6">"I saved over $200 last month using EasyPark instead of public garages. The app makes it super easy to find affordable parking near my office."</p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-semibold text-gray-900">Michael R.</h4>
                  <p className="text-xs text-gray-500">Daily Parker</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-500 italic mb-6">"My driveway was just sitting empty while I was at work. Now I make an extra $400 monthly by renting it out during the day. It's completely passive income!"</p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-semibold text-gray-900">Sarah L.</h4>
                  <p className="text-xs text-gray-500">Driveway Owner</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="flex text-amber-500">
                  {[...Array(4)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path fillRule="evenodd" d="M12 2l2.5 5.3 5.5 1-4 4.1 1 5.6-5-2.6-5 2.6 1-5.6-4-4.1 5.5-1z" />
                    <path fillRule="evenodd" d="M12 18.8V2L9.5 7.3 4 8.3l4 4.1-1 5.6 5-2.6z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-500 italic mb-6">"Finding parking for my daily commute was a nightmare until I found EasyPark. Now I have a guaranteed spot every day at half the price of the nearby garage."</p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-semibold text-gray-900">David T.</h4>
                  <p className="text-xs text-gray-500">Regular Commuter</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-10">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">FAQ</h2>
            <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </p>
          </div>
          
          <FAQAccordion />
          
          <div className="mt-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Have more questions?</h3>
            <p className="text-gray-500 max-w-2xl mx-auto mb-6">
              Our help center has answers to most questions. If you can't find what you're looking for,
              our support team is always ready to help.
            </p>
            <Button variant="outline" size="lg">
              Visit Help Center
            </Button>
          </div>
        </div>
      </div>

      {/* App Download */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Download Our Mobile App</h2>
              <p className="text-lg text-gray-500 mb-8">
                Get the EasyPark app for iOS and Android. Book parking spots on the go, receive notifications, and manage your listings from anywhere.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button variant="default" size="lg" className="flex items-center justify-center bg-gray-900 hover:bg-gray-800">
                  <Apple className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </Button>
                <Button variant="default" size="lg" className="flex items-center justify-center bg-gray-900 hover:bg-gray-800">
                  <Play className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <div className="text-xs">Get it on</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </Button>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 lg:w-1/2 flex justify-center">
              <div className="h-auto w-full max-w-sm rounded-lg shadow-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                  alt="EasyPark mobile app" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
