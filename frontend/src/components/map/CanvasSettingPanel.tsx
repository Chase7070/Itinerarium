/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTileStyle } from '@/contexts/map/TileStyleContext';
import { useUserMaps } from '@/contexts/map/UserMapsContext';
import { useMapAcl } from '@/contexts/map/MapAclContext'; // Assuming no MapPermission enum is imported
import MapStyleButton from './MapStyleButton';
import { Map } from '@/types/common/index';

// Import shared variants from your animations file
import {
  panelSlideUpFadeInVariants,
  contentCollapseVariants,
  itemFadeSlideDownVariants,
  chevronRotateVariants, // Corrected: Use the exact name from your file
} from '@/lib/animations'; // Adjust path if necessary

type CanvasSettingsPanelProps = {
  isActive: boolean;
  onToggle: () => void;
  map: Map;
};

const mapStyles = [
  { style: "light", label: "Light" },
  { style: "dark", label: "Dark" },
  { style: "satellite", label: "Satellite" },
  { style: "osm", label: "OSM" },
  { style: "terrain", label: "Terrain" },
  { style: "watercolor", label: "Watercolor" },
  { style: "topo", label: "Topo" },
  { style: "toner", label: "Toner" },
  { style: "open_topo", label: "Open Topo" },
  { style: "positron", label: "Positron" },
  { style: "arcgis_gray", label: "ArcGIS Gray" },
  { style: "arcgis_ocean", label: "ArcGIS Ocean" },
  { style: "arcgis_relief", label: "ArcGIS Relief" },
];

export default function CanvasSettingsPanel({ isActive, onToggle, map }: CanvasSettingsPanelProps) {
  const { setTileStyle, tileStyle } = useTileStyle();
  const { updateMap } = useUserMaps();
  const { permission } = useMapAcl(); // This will be a string like 'write', 'read', etc.

  const [name, setName] = useState(map.name || '');
  const [description, setDescription] = useState(map.description || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Reset form if map prop changes
  useEffect(() => {
    setName(map.name || '');
    setDescription(map.description || '');
    setIsEditing(false);
    setSaveError('');
    setSaveSuccess(false);
  }, [map]);

  // Use the string permission directly
  const canEditMapProperties = permission === 'write';

  const handleSaveMapProperties = async () => {
    if (!map || !canEditMapProperties) return;
    setIsSaving(true);
    setSaveError('');
    setSaveSuccess(false);
    try {
      await updateMap(map.id, { name, description });
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save map properties';
      setSaveError(errorMessage);
      setTimeout(() => setSaveError(''), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setName(map.name || '');
    setDescription(map.description || '');
    setIsEditing(false);
    setSaveError('');
  };

  return (
    <motion.div
      variants={panelSlideUpFadeInVariants} // Use shared variant
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      <button
        onClick={onToggle}
        aria-expanded={isActive}
        aria-controls="canvas-settings-content"
        className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <span>Canvas Settings</span>
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
            key="canvas-settings-content"
            id="canvas-settings-content"
            variants={contentCollapseVariants} // Use shared variant
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            <div className="px-6 py-4 space-y-6 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">🗺️ Map Style:</p>
                <div className="flex flex-wrap gap-2">
                  {mapStyles.map(({ style, label }) => (
                    <MapStyleButton
                      key={style}
                      style={style}
                      label={label}
                      isSelected={tileStyle === style}
                      onClick={() => setTileStyle(style)}
                    />
                  ))}
                </div>
              </div>

              {map && canEditMapProperties && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400">🗺️ Map Properties:</p>
                    {!isEditing ? (
                      <button onClick={() => setIsEditing(true)} className="text-xs text-blue-500 hover:underline">
                        Edit
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button onClick={handleCancelEdit} className="text-xs text-gray-500 hover:underline">
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveMapProperties}
                          disabled={isSaving}
                          className="text-xs text-blue-500 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSaving ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    )}
                  </div>

                  <AnimatePresence mode="wait" initial={false}>
                    {isEditing ? (
                      <motion.div
                        key="edit-form"
                        variants={itemFadeSlideDownVariants} // Use shared variant
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-4"
                      >
                        <div>
                          <label htmlFor="map-name" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Map Name
                          </label>
                          <input
                            id="map-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="map-description" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                          </label>
                          <textarea
                            id="map-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="display-text"
                        variants={itemFadeSlideDownVariants} // Use shared variant
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-2"
                      >
                        <p className="text-sm text-gray-700 dark:text-gray-200">
                          <span className="font-medium">Name:</span> {map.name || 'Untitled Map'}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-200 break-words">
                          <span className="font-medium">Description:</span> {map.description || 'No description'}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="h-5 mt-1"> {/* Placeholder for messages */}
                    <AnimatePresence>
                      {saveError && (
                        <motion.p
                          key="saveError"
                          variants={itemFadeSlideDownVariants} // Use shared variant
                          initial="hidden" animate="visible" exit="exit"
                          className="text-xs text-red-500"
                        >
                          {saveError}
                        </motion.p>
                      )}
                      {saveSuccess && (
                        <motion.p
                          key="saveSuccess"
                          variants={itemFadeSlideDownVariants} // Use shared variant
                          initial="hidden" animate="visible" exit="exit"
                          className="text-xs text-green-500"
                        >
                          Map properties saved successfully!
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
