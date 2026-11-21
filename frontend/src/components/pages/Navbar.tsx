// src/app/components/Navbar.tsx
'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { getUserAvatarUrl } from '@/utils/imageUtils';
import WavyText from "@/components/elements/WavyText";
import { AnimatePresence, motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) setAuthReady(true);
  }, [isLoading]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const menuItemVariants = {
    hover: {
      scale: 1.05,
      color: '#facc15', // yellow-300
      transition: { type: 'spring', stiffness: 300 },
    },
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-900 to-blue-900 fixed top-0 left-0 w-full z-[200] shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold hover:opacity-80 transition-opacity duration-300">
            <WavyText
              text="Itinerarium"
              yOffset={2.5}
              duration={1}
              letterClassName="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <motion.div whileHover="hover" variants={menuItemVariants}>
              <Link href="/" className="text-gray-200 text-sm font-medium tracking-wide">
                Home
              </Link>
            </motion.div>

            {authReady && isAuthenticated ? (
              <>
                <motion.div whileHover="hover" variants={menuItemVariants}>
                  <Link href="/dashboard" className="text-gray-200 text-sm font-medium tracking-wide">
                    Dashboard
                  </Link>
                </motion.div>

                <div className="flex items-center space-x-4">
                  <motion.div
                    className="flex items-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {user?.avatar ? (
                      <Image unoptimized width={32} height={32}
                        src={getUserAvatarUrl(user.avatar)}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full border-2 border-yellow-400 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/default-avatar.png';
                        }}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center border-2 border-yellow-400">
                        <span className="text-white font-medium">
                          {user?.username?.charAt(0).toUpperCase() || '?'}
                        </span>
                      </div>
                    )}
                    <span className="ml-2 text-gray-200">{user?.username}</span>
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(239,68,68,0.1)' }}
                    className="text-red-400 text-sm font-medium px-3 py-1 rounded-md transition-all"
                    onClick={handleLogout}
                  >
                    Logout
                  </motion.button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <motion.div whileHover="hover" variants={menuItemVariants}>
                  <Link
                    href="/login"
                    className="px-4 py-1.5 text-sm font-medium text-white rounded-md bg-indigo-700 hover:bg-indigo-600 transition-colors"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover="hover" variants={menuItemVariants}>
                  <Link
                    href="/register"
                    className="px-4 py-1.5 text-sm font-medium text-indigo-900 bg-yellow-400 rounded-md hover:bg-yellow-300 transition-colors"
                  >
                    Register
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-200 hover:text-yellow-300 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              key="mobileMenu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden pt-2 pb-4 border-t border-blue-800 bg-indigo-900/95 backdrop-blur-sm overflow-hidden"
            >
              <Link
                href="/"
                className="block px-4 py-2 text-gray-200 hover:bg-indigo-800 hover:text-yellow-300 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>

              {authReady && isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-gray-200 hover:bg-indigo-800 hover:text-yellow-300 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <div className="flex items-center justify-between px-4 py-2 border-t border-blue-800">
                    <div className="flex items-center">
                      {user?.avatar ? (
                        <Image unoptimized width={32} height={32}
                          src={getUserAvatarUrl(user.avatar)}
                          alt="Avatar"
                          className="w-8 h-8 rounded-full border-2 border-yellow-400"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/default-avatar.png';
                          }}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center border-2 border-yellow-400">
                          <span className="text-white font-medium">
                            {user?.username?.charAt(0).toUpperCase() || '?'}
                          </span>
                        </div>
                      )}
                      <span className="ml-2 text-gray-200">{user?.username}</span>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-2 px-4 py-3 border-t border-blue-800">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-center text-white rounded-md bg-indigo-700 hover:bg-indigo-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm font-medium text-center text-indigo-900 bg-yellow-400 rounded-md hover:bg-yellow-300 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
