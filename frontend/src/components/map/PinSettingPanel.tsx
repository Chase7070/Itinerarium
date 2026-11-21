/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMap } from '@/contexts/map/MapContext';
import { useMapAcl } from '@/contexts/map/MapAclContext'; // Correct: No MapPermission enum imported
import { toast } from 'react-hot-toast';
import { useMapPins } from '@/contexts/map/MapPinsContext';
import type { Pin } from '@/types/common/pin';
import { useSelectedPoint } from '@/contexts/map/SelectedPointContext';
import ConfirmDialog from '@/components/elements/ConfirmDialog';
import { fetchLocationSuggestions, fetchLocationDetails } from '@/api/openRouteService/index';

// Import shared variants from your animations file
import {
  panelSlideUpFadeInVariants,
  contentCollapseVariants,
  itemFadeSlideDownVariants,
  listItemSlideFadeInVariants, // Available if needed for different list item style
  listContainerStaggerVariants, // Available for staggering lists
  chevronRotateVariants,      // Corrected: Use the exact name from your file
  simpleFadeVariants,
} from '@/lib/animations'; // Adjust path if necessary

// Helper for debouncing
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
  debounced.cancel = () => { if (timeout !== null) clearTimeout(timeout); };
  return debounced;
}

interface PinSettingPanelProps {
  isActive: boolean;
  onToggle: () => void;
}

type LocationSuggestion = {
  name: string;
  country: string;
  coords: [number, number];
  label?: string; // For enriched display
};

// Inline pulseVariants if it's specific to this button and not in shared animations
const pulseVariants = {
  pulse: {
    scale: [1, 1.02, 1], // Subtle pulse
    opacity: [0.85, 1, 0.85],
    transition: {
      repeat: Infinity,
      duration: 1.8,
      ease: "easeInOut",
    }
  }
};

export default function PinSettingPanel({ isActive, onToggle }: PinSettingPanelProps) {
  const {
    pinMode,
    setPinMode,
    setNewPinName,
    newPinName,
  } = useMap();
  const { permission } = useMapAcl();
  const { pins, addPin, deletePin } = useMapPins();
  const { selectedPointId, setSelectedPointId } = useSelectedPoint();

  const [cityInput, setCityInput] = useState("");
  const [searchError, setSearchError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [countryExpandState, setCountryExpandState] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const suggestionListRef = useRef<HTMLUListElement>(null); // Ref for the suggestions list (ul)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const canWrite = permission === 'write';

  // --- Functions (saveNewPinToBackend, deletePinFromBackend, etc. remain the same) ---
  const saveNewPinToBackend = async (name: string, coords: [number, number], country: string) => {
    if (!canWrite) {
        toast.error("You don't have permission to add pins.");
        return;
    }
    setIsLoading(true);
    try {
      await addPin({ geo_location: { lat: coords[0], lng: coords[1] }, city: name, country: country });
      toast.success('Pin added successfully!');
      setCityInput("");
      setSuggestions([]);
      setShowSuggestions(false);
      setSearchError(null);
    } catch (error: any) {
      console.error('Failed to create pin:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save pin.';
      toast.error(errorMessage);
      setSearchError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePinFromBackend = async (pinId: string) => {
    if (!canWrite) {
        toast.error("You don't have permission to delete pins.");
        return;
    }
    setIsLoading(true);
    try {
      await deletePin(pinId);
      toast.success('Pin deleted successfully!');
      if (selectedPointId === pinId) {
        setSelectedPointId(null);
      }
    } catch (error: any) {
      console.error('Failed to delete pin:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to delete pin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = async (suggestion: LocationSuggestion) => {
    await saveNewPinToBackend(suggestion.name, suggestion.coords, suggestion.country);
  };

  const handleDeletePoint = (pointId: string, e?: React.MouseEvent) => {
    if (e) { e.stopPropagation(); }
    if (!canWrite) {
        toast.error("You don't have permission to delete pins.");
        return;
    }
    setConfirmDelete(pointId);
  };

  const pointsByCountry = useMemo(() => {
    return pins.reduce((groups, point) => {
      const country = point.country || 'Unknown';
      if (!groups[country]) { groups[country] = []; }
      groups[country].push(point);
      return groups;
    }, {} as Record<string, Pin[]>);
  }, [pins]);

  useEffect(() => {
    setCountryExpandState(prev => {
      const newExpandState = { ...prev };
      const currentCountries = Object.keys(pointsByCountry);
      currentCountries.forEach(country => {
        if (!(country in newExpandState)) {
          newExpandState[country] = true;
        }
      });
      return newExpandState;
    });
  }, [pointsByCountry]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionListRef.current && !suggestionListRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const debouncedFetchSuggestions = useMemo(
    () => debounce(async (input: string) => {
      if (!input.trim() || input.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        setSearchError(null);
        return;
      }
      setIsSearching(true);
      setSearchError(null);
      try {
        const fetchedSuggestions = await fetchLocationSuggestions(input);
        const enrichedSuggestions = fetchedSuggestions.map(s => ({...s, label: `${s.name}, ${s.country}`}));
        setSuggestions(enrichedSuggestions);
        setShowSuggestions(true);
        if (enrichedSuggestions.length === 0) {
          setSearchError("No suggestions found.");
        }
      } catch (error) {
        console.error("Search error:", error);
        setSuggestions([]);
        setShowSuggestions(false);
        setSearchError("Failed to fetch suggestions.");
      } finally {
        setIsSearching(false);
      }
    }, 500),
    [] // Empty dependency array is intentional for debounce
  );

  useEffect(() => () => debouncedFetchSuggestions.cancel(), [debouncedFetchSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCityInput(value);
    debouncedFetchSuggestions(value);
  };

  const handleSearch = async () => {
    if (!cityInput.trim()) {
      setSearchError("Please enter city name.");
      return;
    }
    if (!canWrite) {
        toast.error("You don't have permission to add pins.");
        return;
    }
    setIsSearching(true);
    setShowSuggestions(false);
    try {
      const location = await fetchLocationDetails(cityInput);
      if (!location || !location.coords) {
        setSearchError('City not found or location data incomplete.');
        setIsSearching(false);
        return;
      }
      await saveNewPinToBackend(location.name, location.coords, location.country);
    } catch (error) {
      console.error("Direct search error:", error);
      setSearchError("Request error. Please check network or API key.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
  };

  const toggleCountryExpand = (country: string) => {
    setCountryExpandState(prev => ({ ...prev, [country]: !prev[country] }));
  };

  return (
    <motion.div
      variants={panelSlideUpFadeInVariants} // Use shared variant
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700" // Matched Canvas Panel style
    >
      <button
        onClick={onToggle}
        aria-expanded={isActive}
        aria-controls="pin-settings-panel-content"
        className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" // Matched Canvas Panel style
      >
        <span>Pin Settings</span>
        <motion.svg
          {...chevronRotateVariants(isActive)} // Use shared variant function
          className="w-5 h-5 text-gray-500 dark:text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            key="pin-settings-content"
            id="pin-settings-panel-content"
            variants={contentCollapseVariants} // Use shared variant
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden" // Important for height animation
          >
            <div className="px-6 py-4 space-y-6 border-t border-gray-200 dark:border-gray-700"> {/* Matched Canvas Panel style */}
              {(isLoading || isSearching) && ( // Loading spinner animation
                <motion.div
                  className="flex justify-center my-2"
                  variants={itemFadeSlideDownVariants} // Use shared variant
                  initial="hidden" animate="visible" exit="exit"
                >
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-500"></div>
                </motion.div>
              )}
              {canWrite && (
                // Stagger children if needed, or animate as a block
                <motion.div variants={listContainerStaggerVariants} initial="hidden" animate="visible">
                  <motion.div variants={listItemSlideFadeInVariants} className="relative"> {/* Add Pin Section */}
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">📍 Add New Pin:</p>
                    <div className="flex space-x-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder="Enter city name"
                          value={cityInput}
                          onChange={handleInputChange}
                          onKeyPress={handleInputKeyPress}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          onFocus={() => {
                            if (cityInput.trim().length >= 2 && suggestions.length > 0) setShowSuggestions(true);
                            else if (cityInput.trim().length >=2 ) debouncedFetchSuggestions(cityInput);
                          }}
                          disabled={isLoading || isSearching}
                        />
                        <AnimatePresence>
                          {showSuggestions && suggestions.length > 0 && (
                            <motion.ul
                              ref={suggestionListRef}
                              variants={contentCollapseVariants} // For expand/collapse effect
                              initial="hidden" animate="visible" exit="exit"
                              className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-lg z-10 max-h-40 overflow-y-auto"
                            >
                              {suggestions.map((suggestion, index) => (
                                <motion.li
                                  key={`${suggestion.name}-${suggestion.country}-${index}`}
                                  variants={itemFadeSlideDownVariants} // Animate individual suggestion items
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex items-center text-gray-700 dark:text-gray-200"
                                  whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                                >
                                  <span className="font-medium">{suggestion.label || suggestion.name}</span>
                                  {!suggestion.label && <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">, {suggestion.country}</span>}
                                </motion.li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>
                      <button
                        onClick={handleSearch}
                        className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
                        disabled={isLoading || isSearching || !cityInput.trim()}
                      > Add 📍 </button>
                    </div>
                     <div className="h-4 mt-1"> {/* Placeholder for error message */}
                        <AnimatePresence>
                        {searchError && (
                            <motion.p className="text-red-500 text-xs" variants={itemFadeSlideDownVariants} initial="hidden" animate="visible" exit="exit">
                            {searchError}
                            </motion.p>
                        )}
                        </AnimatePresence>
                    </div>
                  </motion.div>

                  <motion.div variants={listItemSlideFadeInVariants}> {/* Direct Pin Mode Section */}
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">🗺️ Direct Pin Mode:</p>
                    <motion.button // Made button a motion component for pulse
                      onClick={() => setPinMode(!pinMode)}
                      className={`px-3 py-2 rounded text-sm transition-colors w-full ${pinMode
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}`}
                      animate={pinMode ? "pulse" : ""} // Control pulse animation
                      variants={pinMode ? pulseVariants : {}} // Apply pulseVariants only when pinMode is true
                    >
                      {pinMode ? '✓ Click map to place marker' : 'Click to enable map marker mode'}
                    </motion.button>
                    <AnimatePresence>
                      {pinMode && (
                        <motion.div className="mt-2" variants={itemFadeSlideDownVariants} initial="hidden" animate="visible" exit="exit">
                          <input
                            type="text"
                            placeholder="Marker name (optional)"
                            value={newPinName}
                            onChange={(e) => setNewPinName(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              )}

              <div className="pt-4 border-t border-gray-200 dark:border-gray-600"> {/* Matched Canvas Panel style */}
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">📌 Manage Pins:</p>
                {Object.keys(pointsByCountry).length > 0 ? (
                  <div className="max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded">
                    {Object.entries(pointsByCountry).map(([country, countryPoints]) => (
                      <motion.div key={country} layout className="border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                        <div
                          className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600/50"
                          onClick={() => toggleCountryExpand(country)}
                        >
                          <div className="flex items-center space-x-1">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{country}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">({countryPoints.length})</span>
                          </div>
                          <motion.svg
                            {...chevronRotateVariants(countryExpandState[country] || false)}
                            className={`w-4 h-4 text-gray-500 dark:text-gray-400`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </motion.svg>
                        </div>

                        <AnimatePresence initial={false}>
                          {(countryExpandState[country] || false) && (
                            <motion.div
                              key={`${country}-pins-list`}
                              variants={contentCollapseVariants}
                              initial="hidden" animate="visible" exit="exit"
                              className="overflow-hidden"
                            >
                              {/* Optional: Wrap this in motion.div with listContainerStaggerVariants for staggered items */}
                              {countryPoints.map(point => (
                                <motion.div
                                  key={point.id}
                                  layout
                                  variants={itemFadeSlideDownVariants} // Consistent item animation
                                  // If using stagger on parent, remove initial/animate/exit here or adjust
                                  className={`flex items-center justify-between p-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 pl-4 border-t border-gray-100 dark:border-gray-700 cursor-pointer ${selectedPointId === point.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
                                  onClick={() => setSelectedPointId(point.id)}
                                  whileHover={{ backgroundColor: "rgba(0,0,0,0.03)" }}
                                >
                                  <span className="truncate flex-1 text-gray-700 dark:text-gray-300">{point.city}</span>
                                  {canWrite && (
                                    <button
                                      onClick={(e) => handleDeletePoint(point.id, e)}
                                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1 text-xl rounded-full hover:bg-red-100 dark:hover:bg-red-500/20"
                                      aria-label={`Delete ${point.city}`}
                                    > ❌ </button>
                                  )}
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-xs italic">
                    {isLoading ? "Loading pins..." : "No markers yet"}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDelete !== null && (
           <motion.div
            key="confirmDialogWrapper"
            variants={simpleFadeVariants} // Use shared variant
            initial="hidden" animate="visible" exit="exit"
           >
            <ConfirmDialog
                isOpen={true} // ConfirmDialog visibility controlled by AnimatePresence now
                title="Confirm delete marker point"
                message="Are you sure you want to delete this marker point? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                confirmVariant="danger"
                onConfirm={async () => {
                  if (confirmDelete) {
                    await deletePinFromBackend(confirmDelete);
                    setConfirmDelete(null);
                  }
                }}
                onCancel={() => setConfirmDelete(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
