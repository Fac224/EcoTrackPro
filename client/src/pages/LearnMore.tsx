import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BankNote, Shield, Clock, Star, MessageSquare, Calendar } from "lucide-react";

export default function LearnMore() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-primary/10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-primary/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              List Your Driveway
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl">
              Turn your unused parking space into extra income. Join thousands of property owners who are earning money with EasyPark.
            </p>
            <div className="mt-8 flex space-x-4">
              <Link href="/list-driveway">
                <Button size="lg" className="bg-primary text-white">
                  Get Started
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline">
                  How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Benefits</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why List Your Driveway with EasyPark?
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Join our growing community of hosts and start earning from your unused space.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="pt-6">
              <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                      <BankNote className="h-6 w-6 text-white" />
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Earn Extra Income</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Earn up to $400 per month renting out your driveway, depending on your location and availability.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                      <Clock className="h-6 w-6 text-white" />
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Flexible Schedule</h3>
                  <p className="mt-5 text-base text-gray-500">
                    You decide when your space is available. Rent it out only when you don't need it.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                      <Shield className="h-6 w-6 text-white" />
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Peace of Mind</h3>
                  <p className="mt-5 text-base text-gray-500">
                    All bookings are covered by our liability guarantee. Our platform handles all payments securely.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                      <Star className="h-6 w-6 text-white" />
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Build Reputation</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Receive reviews from drivers and establish yourself as a trusted host in your community.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                      <Calendar className="h-6 w-6 text-white" />
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Easy Management</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Our intuitive dashboard lets you track bookings, manage your schedule, and view earnings.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">24/7 Support</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Our customer support team is available around the clock to help with any questions or issues.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How to List Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Getting Started</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How to List Your Driveway
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Follow these simple steps to start earning from your unused parking space.
            </p>
          </div>

          <div className="mt-16 max-w-4xl mx-auto">
            <ol className="space-y-10">
              <li className="relative flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-gray-900">Sign up for an account</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Create a free account with your email or social media. Verify your identity to build trust with potential parkers.
                  </p>
                </div>
              </li>

              <li className="relative flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-gray-900">Add your driveway details</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Provide information about your space: address, size, access instructions, and any special features like EV charging or covered spots.
                  </p>
                </div>
              </li>

              <li className="relative flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-gray-900">Upload photos</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Take clear photos of your parking space from different angles. Good photos increase booking rates by up to 40%.
                  </p>
                </div>
              </li>

              <li className="relative flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  4
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-gray-900">Set your availability and price</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Choose when your space is available and how much you want to charge. Our price recommendation tool helps maximize your earnings.
                  </p>
                </div>
              </li>

              <li className="relative flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  5
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-gray-900">Publish your listing</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Review your listing details and publish it. Your space will appear in search results for drivers looking for parking in your area.
                  </p>
                </div>
              </li>
            </ol>
          </div>

          <div className="mt-16 text-center">
            <Link href="/list-driveway">
              <Button size="lg" className="bg-primary text-white">
                List Your Driveway Now
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Testimonials</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Hear From Our Hosts
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-gray-50 border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <img
                      className="h-12 w-12 rounded-full"
                      src="https://randomuser.me/api/portraits/women/32.jpg"
                      alt="Sarah T."
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Sarah T.</h3>
                    <p className="text-sm text-gray-500">Boston, MA</p>
                  </div>
                </div>
                <p className="mt-4 text-base text-gray-600">
                  "I've been renting out my driveway for 6 months now and have made over $2,000. It's amazing passive income for space I wasn't using anyway."
                </p>
                <div className="mt-4 flex text-yellow-400">
                  {Array(5).fill(null).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-50 border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <img
                      className="h-12 w-12 rounded-full"
                      src="https://randomuser.me/api/portraits/men/42.jpg"
                      alt="James R."
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">James R.</h3>
                    <p className="text-sm text-gray-500">Chicago, IL</p>
                  </div>
                </div>
                <p className="mt-4 text-base text-gray-600">
                  "Living near the stadium, my driveway is in high demand during game days. I can earn up to $50 for a single day. The platform makes it so easy."
                </p>
                <div className="mt-4 flex text-yellow-400">
                  {Array(5).fill(null).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-50 border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <img
                      className="h-12 w-12 rounded-full"
                      src="https://randomuser.me/api/portraits/women/58.jpg"
                      alt="Maria L."
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Maria L.</h3>
                    <p className="text-sm text-gray-500">San Francisco, CA</p>
                  </div>
                </div>
                <p className="mt-4 text-base text-gray-600">
                  "As a retiree, the extra income from my driveway helps with utilities and groceries. The customers have all been respectful and friendly."
                </p>
                <div className="mt-4 flex text-yellow-400">
                  {Array(5).fill(null).map((_, i) => (
                    <Star key={i} className={`h-5 w-5 fill-current ${i === 4 ? 'text-gray-300' : ''}`} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">FAQs</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Common Questions About Listing Your Driveway
            </p>
          </div>
          
          <div className="mt-12 max-w-3xl mx-auto divide-y divide-gray-200">
            <div className="py-6">
              <h3 className="text-lg font-medium text-gray-900">How much can I earn from my driveway?</h3>
              <div className="mt-2">
                <p className="text-base text-gray-500">
                  Earnings vary based on your location, the size of your space, and local demand. Urban areas near attractions, business districts, or event venues typically earn more. Hosts in high-demand areas can earn $200-$400 per month.
                </p>
              </div>
            </div>
            
            <div className="py-6">
              <h3 className="text-lg font-medium text-gray-900">Is my property protected?</h3>
              <div className="mt-2">
                <p className="text-base text-gray-500">
                  Yes. All bookings through EasyPark are covered by our Host Protection Policy, which includes liability coverage. We also verify all drivers and have a rating system to promote responsible behavior.
                </p>
              </div>
            </div>
            
            <div className="py-6">
              <h3 className="text-lg font-medium text-gray-900">When do I get paid?</h3>
              <div className="mt-2">
                <p className="text-base text-gray-500">
                  Payments are processed automatically after each completed booking. Funds are transferred to your bank account within 1-3 business days, depending on your bank's processing time.
                </p>
              </div>
            </div>
            
            <div className="py-6">
              <h3 className="text-lg font-medium text-gray-900">Do I need permission to rent out my driveway?</h3>
              <div className="mt-2">
                <p className="text-base text-gray-500">
                  In most cases, if you own your property, you can rent out your driveway. If you're renting, you should check with your landlord. Some homeowners associations may have specific rules about this.
                </p>
              </div>
            </div>
            
            <div className="py-6">
              <h3 className="text-lg font-medium text-gray-900">What if a driver damages my property?</h3>
              <div className="mt-2">
                <p className="text-base text-gray-500">
                  In the rare event that a driver damages your property, you can file a claim through our Host Protection Policy. We'll work with you and the driver to resolve the situation and cover eligible damages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            <span className="block">Ready to start earning?</span>
            <span className="block text-blue-100">List your driveway today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link href="/list-driveway">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-50">
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}