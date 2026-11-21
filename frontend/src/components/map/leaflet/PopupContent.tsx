'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { JourneyAlbum } from '@/types/common/index';

interface PointDataForPopup {
  id: string;
  name?: string;
}

interface PopupContentProps {
  point: PointDataForPopup;
  album: JourneyAlbum | null;
}

const PopupContent: React.FC<PopupContentProps> = ({ point, album }) => {
  const pointName = point.name || 'Unnamed Location';
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const validImages = useMemo(
    () => album?.images?.map(img => img.key).filter(Boolean) || [],
    [album]
  );

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [point.id]);

  useEffect(() => {
    if (validImages.length > 0 && validImages[currentImageIndex]) {
      setIsImageLoading(true);
      setImageError(false);
    } else {
      setIsImageLoading(false);
      setImageError(false);
    }
  }, [point.id, currentImageIndex, validImages]);

  const handleSwitchImage = (direction: 'prev' | 'next') => {
    if (validImages.length === 0) return;
    setCurrentImageIndex(prev => {
      const newIndex = direction === 'next'
        ? (prev + 1) % validImages.length
        : (prev - 1 + validImages.length) % validImages.length;
      return newIndex;
    });
  };

  const retryLoad = () => {
    if (validImages.length === 0 || !validImages[currentImageIndex]) return;
    setIsImageLoading(true);
    setImageError(false);
  };

  const renderHeader = (
    <div className="flex items-center gap-3 border-b border-slate-700 pb-3 mb-3">
      <div className="bg-indigo-600 p-2 rounded-full shadow-sm">
        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-white truncate" title={pointName}>{pointName}</h4>
        <p className="text-xs text-slate-300">Location Info</p>
      </div>
    </div>
  );

  if (validImages.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="p-5 w-72 max-w-xs rounded-2xl bg-slate-900 text-white shadow-xl font-sans"
      >
        {renderHeader}
        <div className="flex flex-col items-center justify-center text-center h-36 bg-slate-800 rounded-lg p-4">
          <svg className="h-10 w-10 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-xs text-slate-400 font-medium">No photos for this location</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="p-5 w-72 max-w-xs rounded-2xl bg-slate-900 text-white shadow-xl font-sans"
    >
      {renderHeader}
      <div className="relative group overflow-hidden rounded-xl bg-slate-800 aspect-[4/3]">
        <AnimatePresence mode="wait">
          {imageError && validImages[currentImageIndex] && (
            <motion.div
              key={`error-${currentImageIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 text-center p-4"
            >
              <svg className="h-8 w-8 text-red-400 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm font-medium text-slate-300">Failed to load image</p>
              <button
                onClick={(e) => { e.stopPropagation(); retryLoad(); }}
                className="mt-3 px-4 py-1.5 text-xs font-semibold rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {!imageError && validImages[currentImageIndex] && (
            <motion.div
              key={`image-content-${currentImageIndex}`}
              className="w-full h-full relative" // Added relative for positioning children
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isImageLoading && (
                <motion.div
                  key={`loader-overlay-${currentImageIndex}`}
                  className="absolute inset-0 flex items-center justify-center bg-slate-800 z-10"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                >
                  <svg className="animate-spin h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </motion.div>
              )}
              <motion.img
                key={validImages[currentImageIndex]}
                src={`${process.env.NEXT_PUBLIC_API_URL || ''}${validImages[currentImageIndex]}`}
                alt={`${pointName} - Photo ${currentImageIndex + 1}`}
                className="w-full h-full object-contain"
                initial={{ opacity: 0 }}
                animate={{ opacity: isImageLoading ? 0 : 1 }}
                transition={{ duration: 0.3, delay: isImageLoading ? 0 : 0.1 }}
                onLoad={() => {
                  setIsImageLoading(false);
                  setImageError(false);
                }}
                onError={() => {
                  setIsImageLoading(false);
                  setImageError(true);
                }}
                loading="lazy"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={() => handleSwitchImage('prev')}
              disabled={isImageLoading}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-slate-700/70 hover:bg-slate-600 text-white p-2 rounded-full transition transform hover:scale-110 shadow-md opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed z-20"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={() => handleSwitchImage('next')}
              disabled={isImageLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-700/70 hover:bg-slate-600 text-white p-2 rounded-full transition transform hover:scale-110 shadow-md opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed z-20"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </>
        )}

        {/* Pagination Indicator */}
        {validImages.length > 0 && !imageError && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <span className="bg-slate-900/70 backdrop-blur-sm text-slate-200 text-xs px-2.5 py-1 rounded-full shadow-md">
              {currentImageIndex + 1} / {validImages.length}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PopupContent;