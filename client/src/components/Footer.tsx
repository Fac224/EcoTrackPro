import { Link } from "wouter";
import { ParkingMeter } from "lucide-react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center">
              <ParkingMeter className="text-white h-8 w-8 mr-2" />
              <span className="text-2xl font-bold text-white">ParkShare</span>
            </div>
            <p className="mt-4 text-base text-gray-400">
              The easiest way to find and book parking spots near you. Or make money by renting out your driveway.
            </p>
            <div className="mt-6 flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <FaFacebookF className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <FaLinkedinIn className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">For Drivers</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="#how-it-works" className="text-base text-gray-400 hover:text-gray-300">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-base text-gray-400 hover:text-gray-300">
                  Find parking
                </Link>
              </li>
              <li>
                <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                  Help center
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">For Hosts</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                  Why host
                </a>
              </li>
              <li>
                <Link href="/list-driveway" className="text-base text-gray-400 hover:text-gray-300">
                  List your driveway
                </Link>
              </li>
              <li>
                <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                  Host resources
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                  Host insurance
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                  Privacy policy
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                  Terms of service
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} ParkShare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
