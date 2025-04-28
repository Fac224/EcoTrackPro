import { useState } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, Car, Key, CreditCard, MessageSquare, User, Calendar, Shield, HelpCircle } from "lucide-react";

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/10 to-gray-50 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Help Center
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions and learn everything you need to know about using EasyPark.
            </p>
            
            {/* Search Box */}
            <div className="mt-8 max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search for help articles..."
                  className="pl-10 py-6 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Links */}
      <div className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Popular Topics</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            <Link href="#booking">
              <Button variant="outline" className="w-full h-24 flex flex-col text-gray-700 hover:bg-primary/5 hover:border-primary">
                <Car className="h-6 w-6 mb-2 text-primary" />
                <span>Booking</span>
              </Button>
            </Link>
            
            <Link href="#account">
              <Button variant="outline" className="w-full h-24 flex flex-col text-gray-700 hover:bg-primary/5 hover:border-primary">
                <User className="h-6 w-6 mb-2 text-primary" />
                <span>Account</span>
              </Button>
            </Link>
            
            <Link href="#payment">
              <Button variant="outline" className="w-full h-24 flex flex-col text-gray-700 hover:bg-primary/5 hover:border-primary">
                <CreditCard className="h-6 w-6 mb-2 text-primary" />
                <span>Payments</span>
              </Button>
            </Link>
            
            <Link href="#hosting">
              <Button variant="outline" className="w-full h-24 flex flex-col text-gray-700 hover:bg-primary/5 hover:border-primary">
                <Key className="h-6 w-6 mb-2 text-primary" />
                <span>Hosting</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Help Content Tabs */}
      <div className="py-12 bg-gray-50" id="help-content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="drivers" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="drivers">For Drivers</TabsTrigger>
              <TabsTrigger value="hosts">For Hosts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="drivers">
              <Card>
                <CardHeader>
                  <CardTitle>Driver Help Center</CardTitle>
                  <CardDescription>
                    Find information about booking parking spaces and managing your account.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-10">
                  <div id="booking">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Car className="mr-2 h-5 w-5 text-primary" />
                      Booking & Reservations
                    </h3>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>How do I book a parking space?</AccordionTrigger>
                        <AccordionContent>
                          <p>To book a parking space on EasyPark:</p>
                          <ol className="list-decimal pl-5 space-y-2 mt-2">
                            <li>Enter your destination location, date, and time in the search bar</li>
                            <li>Browse available spaces and select one that meets your needs</li>
                            <li>Review the space details, including price, access instructions, and host information</li>
                            <li>Click "Book Now" and follow the payment process</li>
                            <li>You'll receive a confirmation email with all the details you need</li>
                          </ol>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-2">
                        <AccordionTrigger>Can I modify or cancel my booking?</AccordionTrigger>
                        <AccordionContent>
                          <p>Yes, you can modify or cancel your booking through your account dashboard:</p>
                          <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>Cancellations made more than 24 hours before the booking time receive a full refund</li>
                            <li>Cancellations within 24 hours of the booking start time receive a 50% refund</li>
                            <li>Modifications are subject to availability and may affect pricing</li>
                          </ul>
                          <p className="mt-2">To modify or cancel, go to "My Bookings" in your dashboard and select the booking you wish to change.</p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-3">
                        <AccordionTrigger>What if I arrive late or leave early?</AccordionTrigger>
                        <AccordionContent>
                          <p>If you arrive later than your booking start time, you can still use the space for the remainder of your booking period, but no refund is provided for the unused time.</p>
                          <p className="mt-2">If you leave earlier than planned, you can simply exit the space. No refund is provided for unused time, but it's courteous to notify the host if possible.</p>
                          <p className="mt-2">For significant delays, we recommend contacting the host directly through our messaging system.</p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-4">
                        <AccordionTrigger>What if the space is unavailable when I arrive?</AccordionTrigger>
                        <AccordionContent>
                          <p>If you arrive and find the space is occupied or unavailable:</p>
                          <ol className="list-decimal pl-5 space-y-2 mt-2">
                            <li>Contact the host immediately through the app</li>
                            <li>If the host doesn't resolve the issue within 15 minutes, contact our support team</li>
                            <li>We'll help find an alternative space or process a full refund</li>
                          </ol>
                          <p className="mt-2">We take these situations seriously and may provide additional credits for the inconvenience.</p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                  
                  <div id="account">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <User className="mr-2 h-5 w-5 text-primary" />
                      Account Management
                    </h3>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>How do I create or update my account?</AccordionTrigger>
                        <AccordionContent>
                          <p>To create an account:</p>
                          <ol className="list-decimal pl-5 space-y-2 mt-2">
                            <li>Click "Sign Up" in the top navigation bar</li>
                            <li>Enter your name, email, and create a password</li>
                            <li>Verify your email address by clicking the link sent to your inbox</li>
                          </ol>
                          <p className="mt-2">To update your account:</p>
                          <ol className="list-decimal pl-5 space-y-2 mt-2">
                            <li>Log in to your account</li>
                            <li>Click on your profile picture in the top right corner</li>
                            <li>Select "Account Settings"</li>
                            <li>Update your information and click "Save Changes"</li>
                          </ol>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-2">
                        <AccordionTrigger>How do I reset my password?</AccordionTrigger>
                        <AccordionContent>
                          <p>If you've forgotten your password:</p>
                          <ol className="list-decimal pl-5 space-y-2 mt-2">
                            <li>Click "Log In" in the top navigation bar</li>
                            <li>Select "Forgot Password"</li>
                            <li>Enter the email address associated with your account</li>
                            <li>Follow the password reset instructions sent to your email</li>
                          </ol>
                          <p className="mt-2">If you want to change your current password:</p>
                          <ol className="list-decimal pl-5 space-y-2 mt-2">
                            <li>Log in to your account</li>
                            <li>Go to "Account Settings"</li>
                            <li>Select "Security"</li>
                            <li>Enter your current password and your new password</li>
                          </ol>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                  
                  <div id="payment">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <CreditCard className="mr-2 h-5 w-5 text-primary" />
                      Payments & Billing
                    </h3>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>What payment methods are accepted?</AccordionTrigger>
                        <AccordionContent>
                          <p>EasyPark accepts various payment methods including:</p>
                          <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>Credit cards (Visa, Mastercard, American Express, Discover)</li>
                            <li>Debit cards</li>
                            <li>PayPal</li>
                            <li>Apple Pay (on iOS devices)</li>
                            <li>Google Pay (on Android devices)</li>
                          </ul>
                          <p className="mt-2">All payments are processed securely through our payment processing partners.</p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-2">
                        <AccordionTrigger>How do refunds work?</AccordionTrigger>
                        <AccordionContent>
                          <p>Our refund policy depends on when you cancel:</p>
                          <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>Cancellations made more than 24 hours before booking: 100% refund</li>
                            <li>Cancellations within 24 hours of booking: 50% refund</li>
                            <li>Cancellations after booking start time: No refund</li>
                          </ul>
                          <p className="mt-2">In case of host cancellations or unavailable spaces, you receive a full refund regardless of timing.</p>
                          <p className="mt-2">Refunds are processed back to your original payment method and typically take 3-5 business days to appear.</p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="hosts">
              <Card>
                <CardHeader>
                  <CardTitle>Host Help Center</CardTitle>
                  <CardDescription>
                    Learn how to list your driveway and manage bookings as a host.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-10">
                  <div id="hosting">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Key className="mr-2 h-5 w-5 text-primary" />
                      Listing Your Space
                    </h3>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>How do I list my driveway?</AccordionTrigger>
                        <AccordionContent>
                          <p>Listing your driveway is simple and takes only a few minutes:</p>
                          <ol className="list-decimal pl-5 space-y-2 mt-2">
                            <li>Create an account or log in to your existing account</li>
                            <li>Click "List Your Driveway" in the navigation menu</li>
                            <li>Enter your address and driveway details</li>
                            <li>Upload clear photos of your parking space</li>
                            <li>Set your availability schedule and pricing</li>
                            <li>Provide access instructions for drivers</li>
                            <li>Review and publish your listing</li>
                          </ol>
                          <p className="mt-2">Once published, your listing will be visible to drivers searching in your area.</p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-2">
                        <AccordionTrigger>How much should I charge?</AccordionTrigger>
                        <AccordionContent>
                          <p>Your pricing depends on several factors:</p>
                          <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>Location (proximity to city centers, attractions, venues)</li>
                            <li>Local parking rates (competitive pricing)</li>
                            <li>Space type (covered, secured, EV charging, etc.)</li>
                            <li>Seasonal demand (consider event schedules)</li>
                          </ul>
                          <p className="mt-2">Our pricing tool provides recommendations based on similar spaces in your area. Most hosts charge between $2-$10 per hour depending on location and amenities.</p>
                          <p className="mt-2">You can offer discounted rates for longer bookings to encourage extended stays.</p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-3">
                        <AccordionTrigger>What if I need to cancel a booking?</AccordionTrigger>
                        <AccordionContent>
                          <p>While we encourage hosts to honor all bookings, we understand emergencies happen:</p>
                          <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>Cancellations should be made as early as possible</li>
                            <li>The driver will receive a full refund</li>
                            <li>Frequent cancellations may affect your host rating</li>
                          </ul>
                          <p className="mt-2">To cancel a booking:</p>
                          <ol className="list-decimal pl-5 space-y-2 mt-2">
                            <li>Go to "My Listings" in your dashboard</li>
                            <li>Find the booking you need to cancel</li>
                            <li>Click "Cancel Booking" and provide a reason</li>
                            <li>The driver will be automatically notified</li>
                          </ol>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                  
                  <div id="hosting-payments">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <CreditCard className="mr-2 h-5 w-5 text-primary" />
                      Host Payments
                    </h3>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>How and when do I get paid?</AccordionTrigger>
                        <AccordionContent>
                          <p>As a host, you'll receive payment for each completed booking:</p>
                          <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>Payments are processed automatically after each booking is completed</li>
                            <li>Funds are transferred to your bank account within 1-3 business days</li>
                            <li>You can view your payment history in the "Earnings" section of your dashboard</li>
                          </ul>
                          <p className="mt-2">To set up payments, you'll need to add your bank account information in your account settings. We use secure payment processing to protect your financial information.</p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="item-2">
                        <AccordionTrigger>What fees does EasyPark charge?</AccordionTrigger>
                        <AccordionContent>
                          <p>EasyPark charges a simple service fee to cover our operating costs:</p>
                          <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>Host service fee: 15% of the booking amount</li>
                            <li>This fee covers payment processing, customer support, marketing, and platform maintenance</li>
                            <li>No hidden fees or monthly charges</li>
                          </ul>
                          <p className="mt-2">For example, if a driver pays $20 for a parking reservation, you'll receive $17 after the service fee.</p>
                          <p className="mt-2">The service fee is automatically deducted before payment is sent to your account.</p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Contact Support */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900">Still need help?</h2>
            <p className="mt-4 text-lg text-gray-600">
              Our support team is ready to assist you with any questions or issues.
            </p>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                    Send a Message
                  </CardTitle>
                  <CardDescription>
                    Get a response from our team within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="mailto:support@easypark.com">
                    <Button className="w-full">
                      Contact Support
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HelpCircle className="mr-2 h-5 w-5 text-primary" />
                    FAQ Library
                  </CardTitle>
                  <CardDescription>
                    Browse our comprehensive knowledge base.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    View All FAQs
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}