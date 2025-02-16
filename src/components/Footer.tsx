import { Store, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center">
              <Store className="h-8 w-8 text-indigo-400" />
              <span className="ml-2 text-xl font-bold">LuxeFurniture</span>
            </div>
            <p className="mt-4 text-gray-400">
              Transforming spaces with elegant and modern furniture solutions.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-400 hover:text-white">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop?category=living-room" className="text-gray-400 hover:text-white">
                  Living Room
                </Link>
              </li>
              <li>
                <Link to="/shop?category=bedroom" className="text-gray-400 hover:text-white">
                  Bedroom
                </Link>
              </li>
              <li>
                <Link to="/shop?category=dining" className="text-gray-400 hover:text-white">
                  Dining
                </Link>
              </li>
              <li>
                <Link to="/shop?category=office" className="text-gray-400 hover:text-white">
                  Office
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <Mail className="h-5 w-5 mr-2" />
                info@luxefurniture.com
              </li>
              <li className="flex items-center text-gray-400">
                <Phone className="h-5 w-5 mr-2" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center text-gray-400">
                <MapPin className="h-5 w-5 mr-2" />
                123 Furniture Street, Design District
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} LuxeFurniture. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}