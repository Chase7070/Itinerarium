'use client';
import React from 'react';
import Introduction from "@/components/pages/Introduction";
import Link from "next/link";
import { motion } from 'framer-motion'; // Import motion

// Animation Variants
const heroContentVariants = {
  hidden: {}, // Parent orchestrates
  visible: {
    transition: {
      staggerChildren: 0.2, // Time between each child animation
      delayChildren: 0.1,   // Initial delay before children start
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 10, duration: 0.5 },
  },
};

const introductionSectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut", delay: 0.5 }, // Delay after hero content
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-x-hidden"> {/* Added overflow-x-hidden for safety */}
      {/* Hero Section */}
      <div className="relative w-full">
        {/* Background Image */}
        <div className="bg-[url('/assets/home/Banner1.jpeg')] w-full h-[60vh] bg-cover bg-center relative">
          {/* Background Overlay */}
          <div className="absolute inset-0 bg-indigo-900/15 backdrop-blur-[1px]"></div>

          {/* Title Content - Animated */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-4"
            variants={heroContentVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 drop-shadow-lg"
              variants={titleVariants}
            >
              Travel <span className="text-yellow-400">Map</span> Journal
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-white/90 max-w-2xl drop-shadow"
              variants={subtitleVariants}
            >
              Record your travel footprints, share your adventure stories
            </motion.p>
            {/* Hero section button - Animated */}
            <motion.div
              className="mt-8 relative z-50" // Ensure button is interactive
              variants={buttonVariants}
            >
              <Link
                href="/register"
                className="inline-block px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-300 hover:to-yellow-200 text-indigo-900 font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
              >
                Start Your Journey
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Wave Separator */}
        {/* No specific animation for wave, it will appear as the page loads */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900"></div>
        <svg className="absolute -bottom-23 left-0 w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="currentColor" // Use currentColor to inherit the text color
            className="text-gray-50 dark:text-gray-900" // Tailwind classes to dynamically set the color
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,133.3C672,139,768,181,864,197.3C960,213,1056,203,1152,170.7C1248,139,1344,85,1392,58.7L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Introduction Section - Animated */}
      <motion.div
        className="relative z-10 pb-20 pt-16 md:pt-24" // Added some padding top after wave
        variants={introductionSectionVariants}
        initial="hidden"
        animate="visible"
      >
        <Introduction />
      </motion.div>
    </div>
  );
}