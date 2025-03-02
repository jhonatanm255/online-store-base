
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Menu,
  X,
  Store,
  User,
  LogOut,
  ShoppingBag,
  Package,
} from "lucide-react";
import CartIcon from "./CartIcon";
import { supabase } from "../lib/supabase";
import { auth as firebaseAuth } from "../lib/firebase";
import toast from "react-hot-toast";

// Tipado adecuado para el usuario
interface User {
  photoURL: string;
  email: string;
}

export default function Navbar() {
  const { user, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      if (isAdmin) {
        await supabase.auth.signOut();
      } else {
        await firebaseAuth.signOut();
      }
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <nav className="fixed w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Store className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                LuxeFurniture
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center sm:ml-6 sm:flex sm:space-x-8">
            <Link
              to="/"
              className="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
            >
              Shop
            </Link>
            <Link
              to="/contact"
              className="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
            >
              Contact
            </Link>
          </div>

          <div className="flex items-center">
            <CartIcon />

            {user ? (
              <div className="relative ml-4" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center focus:outline-none"
                >
                  {isAdmin ? (
                    <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                      A
                    </div>
                  ) : user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-gray-700 hover:text-indigo-600" />
                  )}
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium text-gray-900">
                        {isAdmin ? "Administrator" : "Welcome!"}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>

                    {isAdmin ? (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Admin Panel
                      </Link>
                    ) : (
                      <>
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <User className="h-4 w-4 mr-2" />
                          My Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Package className="h-4 w-4 mr-2" />
                          My Orders
                        </Link>
                      </>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="text-red-600 h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Login
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="ml-4 inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 sm:hidden"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`sm:hidden ${isMenuOpen ? "block" : "hidden"}`}>
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}