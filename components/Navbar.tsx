import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Menu, X, User, LogOut } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

interface NavbarProps {
  isLoggedIn?: boolean;
  userRole?: 'guest' | 'user' | 'admin';
  currentPage?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  isLoggedIn = false,
  userRole = 'guest',
  currentPage = 'home',
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    await supabase.auth.signOut();
    router.push('/login');
  };

  const navLinks = [
    { label: 'Fleet', href: '/fleet' },
    { label: 'Booking', href: '/booking' },
    ...(userRole === 'user' ? [{ label: 'Dashboard', href: '/dashboard' }] : []),
    ...(userRole === 'admin' ? [{ label: 'Admin', href: '/admin' }] : []),
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-performance-grey/95 backdrop-blur-md border-b border-performance-turquoise/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo.svg"
              alt="M&M Auto Performance UK"
              width={44}
              height={44}
              className="rounded-full"
              priority
              unoptimized
            />
            <span className="text-white font-bold text-lg hidden sm:inline tracking-wide">
              M&amp;M Auto Performance
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  currentPage === link.label.toLowerCase()
                    ? 'text-performance-turquoise'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="hidden sm:flex items-center gap-3">
                <Link href="/dashboard" className="p-2 hover:bg-performance-turquoise/10 rounded-lg transition-colors" aria-label="View profile">
                  <User size={20} className="text-performance-turquoise" />
                </Link>
                <button onClick={handleLogout} className="px-4 py-2 text-sm text-gray-300 hover:text-white flex items-center gap-2">
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm text-performance-turquoise hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-performance-turquoise hover:bg-performance-turquoise/90 text-performance-grey font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  Book Now
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-performance-turquoise/10 rounded-lg"
            >
              {isMenuOpen ? (
                <X size={24} className="text-performance-turquoise" />
              ) : (
                <Menu size={24} className="text-performance-turquoise" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-performance-turquoise/10 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {!isLoggedIn && (
              <div className="flex gap-2 pt-2">
                <Link
                  href="/login"
                  className="flex-1 px-4 py-2 text-center text-performance-turquoise hover:bg-performance-turquoise/10 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="flex-1 px-4 py-2 bg-performance-turquoise text-performance-grey font-semibold rounded-lg"
                >
                  Book Now
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
