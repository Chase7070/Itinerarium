'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PhotoGallery from './PhotoGallery';
import { usePhotoAlbum } from '@/contexts/map/PhotoAlbumContext';
import { useMapAcl } from '@/contexts/map/MapAclContext';
import ConfirmDialog from '../elements/ConfirmDialog';
import { useAsyncHandler } from '@/hooks/utils/useAsyncHandler';
import { useSelectedPoint } from '@/contexts/map/SelectedPointContext';
import { useSelectedAlbum } from '@/contexts/map/SelectedAlbumContext';
import { useMapPins } from '@/contexts/map/MapPinsContext';
import { Pin, JourneyAlbum } from '@/types/common/index';

// Import animation variants
import {
  panelSlideUpFadeInVariants,
  contentCollapseVariants,
  itemFadeSlideDownVariants,
  listItemSlideFadeInVariants,
  listContainerStaggerVariants,
  chevronRotateVariants,
  simpleFadeVariants,
  buttonHoverTapVariants, // Added for common button interactions
  subtleScaleHoverTapVariants, // Added for subtle interactions
} from '@/lib/animations'; // Ensure these new variants are defined in your animations file

type PhotoSettingsPanelProps = {
  isActive: boolean;
  onToggle: () => void;
};

// Icon components (assuming these are defined as in previous versions)
const LocationIcon = ({ className = "h-4 w-4 mr-1.5 text-indigo-400" }: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const AlbumCollectionIcon = ({ className = "h-4 w-4 mr-1.5 text-indigo-400" }: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const TrashIcon = ({ className = "w-4 h-4" }: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const AddAlbumIcon = ({ className = "h-5 w-5 mr-2" }: {className?: string}) => ( // Slightly larger icon
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

export default function PhotoSettingsPanel({ isActive, onToggle }: PhotoSettingsPanelProps) {
  // Context hooks
  const { selectedPointId, setSelectedPointId } = useSelectedPoint();
  const { selectedAlbumId, setSelectedAlbumId } = useSelectedAlbum();
  const { getPinById, deletePin } = useMapPins();
  const { albums: allAlbums, createAlbum, getAlbumById, deleteAlbum } = usePhotoAlbum();
  const { handleAsync, isLoading } = useAsyncHandler();
  const { permission } = useMapAcl();

  // Local state
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [selectedAlbumForPanel, setSelectedAlbumForPanel] = useState<JourneyAlbum | null>(null);
  const [confirmDeleteAlbum, setConfirmDeleteAlbum] = useState<string | null>(null);
  const [confirmDeletePoint, setConfirmDeletePoint] = useState<boolean>(false);
  const [showCreateAlbumDialog, setShowCreateAlbumDialog] = useState<boolean>(false);
  const [newAlbumName, setNewAlbumName] = useState<string>('');

  // Fetch selected pin data
  useEffect(() => {
    const fetchPinData = async () => {
      if (!selectedPointId) {
        setSelectedPin(null);
        return;
      }
      try {
        const pointData = await getPinById(selectedPointId);
        setSelectedPin(pointData || null);
      } catch (error) {
        console.error("Failed to fetch pin data:", error);
        setSelectedPin(null);
      }
    };
    fetchPinData();
  }, [selectedPointId, getPinById]);

  // Fetch selected album data
  useEffect(() => {
    const fetchAlbumData = async () => {
      if (!selectedAlbumId) {
        setSelectedAlbumForPanel(null);
        return;
      }
      try {
        const albumData = await getAlbumById(selectedAlbumId);
        setSelectedAlbumForPanel(albumData || null);
      } catch (error) {
        console.error("Failed to fetch album data:", error);
        setSelectedAlbumForPanel(null);
      }
    };
    fetchAlbumData();
  }, [selectedAlbumId, getAlbumById, allAlbums]);

  // Filter albums specific to the selected point
  const pointSpecificAlbums = useMemo(() => {
    return selectedPointId ? allAlbums.filter(a => a.map_pin_id === selectedPointId) : [];
  }, [allAlbums, selectedPointId]);

  // Handle album selection (original logic: no toggle, just set if different)
  const handleSelectAlbumToManage = useCallback((albumId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedAlbumId !== albumId) {
      setSelectedAlbumId(albumId);
    }
    // If toggle behavior is preferred:
    // setSelectedAlbumId(current => (current === albumId ? null : albumId));
  }, [selectedAlbumId, setSelectedAlbumId]);

  // Refresh album data when photos change (original logic)
  const handleAlbumPhotosChanged = useCallback(() => {
    if (selectedAlbumId) {
      // This assumes getAlbumById might update a shared state (like allAlbums)
      // or this callback's purpose is to trigger an effect that depends on allAlbums.
      // If direct update of selectedAlbumForPanel is needed, it should be async/await:
      // async () => { const data = await getAlbumById(selectedAlbumId); setSelectedAlbumForPanel(data); }
      getAlbumById(selectedAlbumId);
    }
  }, [selectedAlbumId, getAlbumById]);

  // Create album dialog handlers
  const handleShowCreateAlbumDialog = useCallback(() => {
    const defaultName = selectedPin
      ? `${selectedPin.city} Album ${pointSpecificAlbums.length + 1}`
      : `New Album ${allAlbums.length + 1}`;
    setNewAlbumName(defaultName);
    setShowCreateAlbumDialog(true);
  }, [selectedPin, allAlbums.length, pointSpecificAlbums.length]);

  // Original logic for confirmCreateAlbumHandler
  const confirmCreateAlbumHandler = useCallback(async () => {
    if (!newAlbumName.trim()) {
      setShowCreateAlbumDialog(false);
      return;
    }
    await handleAsync(
      async () => {
        const newAlbum = await createAlbum(newAlbumName); // Original: only album name
        if (newAlbum) {
          setSelectedAlbumId(newAlbum.id);
          // If linking to selectedPointId is needed and not handled by createAlbum:
          // if (selectedPointId) { /* await linkAlbumToPoint(newAlbum.id, selectedPointId); */ }
        }
      },
      {
        successMessage: "New album created successfully",
        errorMessage: "Failed to create new album",
      }
    );
    setNewAlbumName('');
    setShowCreateAlbumDialog(false);
  }, [newAlbumName, createAlbum, handleAsync, setSelectedAlbumId]);

  // Delete album handlers
  const handleDeleteAlbumRequest = useCallback((albumIdToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDeleteAlbum(albumIdToDelete);
  }, []);

  // Original logic for confirmDeleteAlbumHandler
  const confirmDeleteAlbumHandler = useCallback(async () => {
    if (!confirmDeleteAlbum) return;
    try {
      await deleteAlbum(confirmDeleteAlbum);
      if (selectedAlbumId === confirmDeleteAlbum) {
        setSelectedAlbumId(null);
        setSelectedAlbumForPanel(null);
      }
    } catch (error) {
      console.error("Failed to delete album:", error);
      // showNotification("Failed to delete album.", "error"); // Optional
    } finally {
      setConfirmDeleteAlbum(null);
    }
  }, [confirmDeleteAlbum, deleteAlbum, selectedAlbumId, setSelectedAlbumId, setSelectedAlbumForPanel]);

  // Delete point handlers
  const handleDeletePointRequest = useCallback(() => {
    setConfirmDeletePoint(true);
  }, []);

  const confirmDeletePointHandler = useCallback(async () => {
    if (!selectedPin?.id) {
      setConfirmDeletePoint(false);
      return;
    }
    await handleAsync(async () => {
      await deletePin(selectedPin.id);
    }, {
      successMessage: "Location and associated data deleted.",
      errorMessage: "Failed to delete location."
    });
    setSelectedPointId(null);
    setSelectedAlbumId(null);
    setSelectedPin(null);
    setSelectedAlbumForPanel(null);
    setConfirmDeletePoint(false);
  }, [selectedPin, deletePin, setSelectedPointId, setSelectedAlbumId, handleAsync]);

  const canWrite = permission === 'write';

  // Empty/Loading state renderer for cleaner renderContent
  const renderEmptyOrLoadingState = () => {
    if (!selectedPointId) {
      return (
        <motion.div variants={itemFadeSlideDownVariants} initial="hidden" animate="visible" exit="exit" className="text-center py-10 text-slate-400">
          <AlbumCollectionIcon className="h-12 w-12 mx-auto text-slate-500 mb-3" />
          <p className="font-medium text-slate-300">Please select a location on the map first.</p>
          <p className="text-sm">Select a pin to manage its photo albums.</p>
        </motion.div>
      );
    }
    if (!selectedPin) {
      return (
        <motion.div variants={itemFadeSlideDownVariants} initial="hidden" animate="visible" exit="exit" className="flex justify-center items-center py-10 text-slate-300">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-400 mr-3"></div>
          <p className="font-medium">Loading location details...</p>
        </motion.div>
      );
    }
    return null; // Indicates that main content should be rendered
  };

  // Main content renderer
  const renderContent = () => {
    const emptyOrLoadingState = renderEmptyOrLoadingState();
    if (emptyOrLoadingState) return emptyOrLoadingState;

    return (
      <div className="space-y-6">
        {/* Location Header */}
        <motion.div variants={listItemSlideFadeInVariants}>
          <h4 className="text-sm font-semibold text-slate-200 mb-1 flex items-center">
            <LocationIcon /> Location
          </h4>
          <div className="flex justify-between items-center">
            <p className="text-base font-medium text-white truncate" title={selectedPin?.city}>
              {selectedPin?.city}
            </p>
            {canWrite && (
              <motion.button
                {...buttonHoverTapVariants}
                onClick={handleDeletePointRequest}
                disabled={isLoading}
                className="p-1.5 rounded-full text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors disabled:opacity-50"
                title="Delete this location and all its albums"
                aria-label="Delete location"
              >
                <TrashIcon />
              </motion.button>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">ID: {selectedPin?.id}</p>
        </motion.div>

        {/* Albums Section */}
        <motion.div variants={listItemSlideFadeInVariants}>
          <h4 className="text-sm font-semibold text-slate-200 mb-2 flex items-center">
            <AlbumCollectionIcon /> Photo Albums ({pointSpecificAlbums.length})
          </h4>
          {pointSpecificAlbums.length > 0 ? (
            <motion.ul
              variants={listContainerStaggerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2.5 max-h-48 overflow-y-auto pr-1 -mr-1 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800/50 rounded-md"
            >
              {pointSpecificAlbums.map(album => (
                <motion.li
                  key={album.id}
                  variants={listItemSlideFadeInVariants}
                  layout
                  {...subtleScaleHoverTapVariants}
                  onClick={(e) => handleSelectAlbumToManage(album.id, e)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ease-in-out
                    ${selectedAlbumId === album.id
                      ? 'bg-indigo-500 border-indigo-400 text-white ring-2 ring-indigo-300 shadow-lg scale-[1.02]'
                      : 'bg-slate-800 border-slate-700 hover:bg-slate-700/70 hover:border-slate-600 text-white'}`}
                >
                  <div className="flex justify-between items-center">
                    <div className="min-w-0 flex-1 mr-2">
                      <p className="text-sm font-medium truncate">{album.name}</p>
                      <p className={`text-xs truncate ${selectedAlbumId === album.id ? 'text-indigo-100 opacity-90' : 'text-slate-400'}`}>
                        {album.images?.length || 0} photo{(album.images?.length !== 1) && 's'}
                      </p>
                    </div>
                    {canWrite && (
                      <motion.button
                        {...buttonHoverTapVariants}
                        onClick={(e) => handleDeleteAlbumRequest(album.id, e)}
                        className={`ml-2 p-1.5 rounded-full hover:bg-red-500/20 disabled:opacity-50 transition-colors
                          ${selectedAlbumId === album.id ? 'text-indigo-100 hover:text-red-100' : 'text-red-400 hover:text-red-300'}`}
                        disabled={isLoading}
                        title="Delete album"
                        aria-label={`Delete album ${album.name}`}
                      >
                        <TrashIcon />
                      </motion.button>
                    )}
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <p className="text-sm italic text-slate-500 px-1 py-2">No albums for this location yet.</p>
          )}
        </motion.div>

        {/* Create Album Button */}
        {canWrite && (
          <motion.button
            variants={itemFadeSlideDownVariants}
            {...buttonHoverTapVariants}
            onClick={handleShowCreateAlbumDialog}
            disabled={isLoading}
            className="w-full mt-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-md text-white
                       font-semibold transition-all duration-200 ease-in-out shadow-md hover:shadow-lg
                       disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <AddAlbumIcon />
            Create New Album
          </motion.button>
        )}

        {/* Photo Gallery */}
        <AnimatePresence mode="wait">
          {selectedAlbumId && selectedAlbumForPanel ? (
            <motion.div
              key={`gallery-${selectedAlbumId}`}
              variants={contentCollapseVariants} // Use a more fitting variant if needed
              initial="hidden" animate="visible" exit="exit"
              className="mt-4 pt-4 border-t border-slate-700/80"
            >
              <PhotoGallery
                album={selectedAlbumForPanel}
                onPhotosChanged={handleAlbumPhotosChanged}
              />
            </motion.div>
          ) : (selectedPointId && !selectedAlbumId && pointSpecificAlbums.length > 0) ? (
            <motion.p
              key="no-album-selected-prompt"
              variants={itemFadeSlideDownVariants}
              initial="hidden" animate="visible" exit="exit"
              className="text-center text-sm text-slate-400 py-4"
            >
              Select an album above to view or add photos.
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    );
  };

  const getAlbumNameById = (albumId: string | null): string => {
    if (!albumId) return 'this album';
    const album = allAlbums.find(a => a.id === albumId);
    return album?.name || 'this album';
  };

  return (
    <motion.div
      variants={panelSlideUpFadeInVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-slate-900 text-slate-100 rounded-xl shadow-2xl overflow-hidden border border-slate-700/80"
    >
      {/* Panel Header */}
      <motion.button
        {...buttonHoverTapVariants} // Added hover/tap animation
        onClick={onToggle}
        aria-expanded={isActive}
        aria-controls="photo-settings-content"
        className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold hover:bg-slate-800/80 transition-colors text-white"
      >
        <span>
          Photo Albums {selectedPin && (
            <>for <span className="text-indigo-300 font-bold">{selectedPin.city}</span></>
          )}
        </span>
        <motion.svg
          {...chevronRotateVariants(isActive)}
          className="w-5 h-5 text-slate-300"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </motion.button>

      {/* Panel Content */}
      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            key="photo-settings-content"
            id="photo-settings-content"
            variants={contentCollapseVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden" // Crucial for height animation with contentCollapseVariants
          >
            <div className="px-6 py-5 border-t border-slate-700/80 min-h-[200px] flex flex-col bg-slate-800/40">
              {renderContent()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialogs: Using original logic of direct rendering, with styling applied to ConfirmDialog props/message */}
      <AnimatePresence>
        {showCreateAlbumDialog && (
          <motion.div
            key="createAlbumDialogWrapper"
            variants={simpleFadeVariants} initial="hidden" animate="visible" exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setShowCreateAlbumDialog(false)} // Click outside to close
          >
             <div onClick={(e) => e.stopPropagation()} className="bg-slate-800 p-6 rounded-xl shadow-xl w-full max-w-md border border-slate-700">
              <ConfirmDialog
                isOpen={true}
                title="Create New Album"
                message={
                  <div className="mt-4">
                    <label htmlFor="album-name-dialog" className="block text-sm font-medium text-slate-200 mb-1.5">
                      Album Name
                    </label>
                    <input
                      type="text"
                      id="album-name-dialog"
                      className="block w-full border-slate-600 bg-slate-700 text-slate-100 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 placeholder-slate-400"
                      value={newAlbumName}
                      onChange={(e) => setNewAlbumName(e.target.value)}
                      autoFocus
                      placeholder="e.g., Summer Vacation '25"
                      onKeyPress={(e) => e.key === 'Enter' && !isLoading && confirmCreateAlbumHandler()}
                    />
                  </div>
                }
                confirmText="Create Album"
                cancelText="Cancel"
                confirmVariant="primary"
                onConfirm={confirmCreateAlbumHandler}
                onCancel={() => { setNewAlbumName(''); setShowCreateAlbumDialog(false); }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDeleteAlbum && (
          <motion.div
            key="deleteAlbumDialogWrapper"
            variants={simpleFadeVariants} initial="hidden" animate="visible" exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setConfirmDeleteAlbum(null)} // Click outside to close
          >
             <div onClick={(e) => e.stopPropagation()} className="bg-slate-800 p-6 rounded-xl shadow-xl w-full max-w-md border border-slate-700">
              <ConfirmDialog
                isOpen={true}
                title="Confirm Delete Album"
                message={`Are you sure you want to delete the album "${getAlbumNameById(confirmDeleteAlbum)}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                confirmVariant="danger"
                onConfirm={confirmDeleteAlbumHandler}
                onCancel={() => setConfirmDeleteAlbum(null)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDeletePoint && (
          <motion.div
            key="deletePointDialogWrapper"
            variants={simpleFadeVariants} initial="hidden" animate="visible" exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setConfirmDeletePoint(false)} // Click outside to close
          >
            <div onClick={(e) => e.stopPropagation()} className="bg-slate-800 p-6 rounded-xl shadow-xl w-full max-w-md border border-slate-700">
              <ConfirmDialog
                isOpen={true}
                title="Confirm Delete Location"
                message={`Are you sure you want to delete the location "${selectedPin?.city || 'this location'}" and all its associated photo albums? This action cannot be undone.`}
                confirmText="Delete Location"
                cancelText="Cancel"
                confirmVariant="danger"
                onConfirm={confirmDeletePointHandler}
                onCancel={() => setConfirmDeletePoint(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}