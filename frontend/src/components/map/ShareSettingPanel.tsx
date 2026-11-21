'use client';

import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ShareMapPanel from './ShareMapPanel';
import { Map as MapType, Share } from '@/types/common/index';
import { useMapAcl } from '@/contexts/map/MapAclContext';

import {
  panelSlideUpFadeInVariants,
  contentCollapseVariants,
  chevronRotateVariants,
  itemFadeSlideDownVariants,
  // buttonHoverTapVariants, // Using direct Framer Motion props for button
} from '@/lib/animations';

type ShareSettingPanelProps = {
  isActive: boolean;
  onToggle: () => void;
  map: MapType;
};

// Icon for "Not Available" message
const InfoIcon = ({ className = "h-10 w-10 mx-auto text-slate-500 mb-3" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function ShareSettingPanel({ isActive, onToggle, map }: ShareSettingPanelProps) {
  const aclContextValue = useMapAcl();

  const shareData = useMemo(() => aclContextValue?.share, [aclContextValue]);

  const canDisplayShareOptions = useMemo(() => {
    return !!(
      shareData &&
      typeof shareData === 'object' && // Make sure it's an object
      shareData.access
    );
  }, [shareData]);

  // Optional: For debugging what the context provides
  useEffect(() => {
    console.log("ShareSettingPanel - ACL Context:", aclContextValue);
    console.log("ShareSettingPanel - Derived shareData:", shareData);
    console.log("ShareSettingPanel - Can Display Share Options:", canDisplayShareOptions);
  }, [aclContextValue, shareData, canDisplayShareOptions]);

  return (
    <motion.div
      variants={panelSlideUpFadeInVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-slate-900 text-slate-100 rounded-xl shadow-2xl overflow-hidden border border-slate-700/80"
    >
      <motion.button
        whileHover={{ backgroundColor: "rgba(51, 65, 85, 0.8)" }} // slate-700 with opacity
        whileTap={{ scale: 0.98 }}
        onClick={onToggle}
        aria-expanded={isActive}
        aria-controls="share-settings-content"
        className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-white transition-colors"
      >
        <span>Share Settings</span>
        <motion.svg
          {...chevronRotateVariants(isActive)}
          className="w-5 h-5 text-slate-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </motion.button>

      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            key="share-settings-content"
            id="share-settings-content"
            variants={contentCollapseVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            <div className="px-6 py-5 border-t border-slate-700/80 flex flex-col bg-slate-800/40 min-h-[120px] justify-center">
              {canDisplayShareOptions && shareData ? (
                // Ensure the prop name here ('share') matches what ShareMapPanel expects
                <ShareMapPanel map={map} share={shareData} />
              ) : (
                <motion.div
                    variants={itemFadeSlideDownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="text-center py-6 text-slate-400"
                >
                    <InfoIcon />
                    <p className="font-medium text-slate-300">Sharing Not Available</p>
                    <p className="text-sm">
                    Sharing options may not be configured or permissions are missing for this map.
                    </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}