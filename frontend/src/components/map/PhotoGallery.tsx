// src/components/PhotoGallery.tsx
'use client'

import Image from 'next/image';
import React, { useState, useEffect } from 'react'
import { useNotification } from '@/contexts/notification/NotificationContext';
import { useMapAcl } from '@/contexts/map/MapAclContext';
import { usePhotoMethods } from '@/hooks/api/usePhotoMethods';
import { JourneyAlbum, JourneyAlbumImage } from '@/types/common/index';

interface PhotoGalleryProps {
  album: JourneyAlbum;
  onPhotosChanged: (updatedAlbumId: string) => void;
}

export default function PhotoGallery({ album: currentAlbum, onPhotosChanged }: PhotoGalleryProps) {
  const albumId = currentAlbum.id;

  const [selectedPhoto, setSelectedPhoto] = useState<JourneyAlbumImage | null>(null);
  const [selectedPhotosForBatchDelete, setSelectedPhotosForBatchDelete] = useState<Set<string>>(new Set());
  const [deleteConfirmStep, setDeleteConfirmStep] = useState(0);
  const [isBatchDeleteMode, setIsBatchDeleteMode] = useState(false);

  const { showNotification } = useNotification();
  const { permission } = useMapAcl();
  const canWrite = permission === "write"; // Derived for convenience

  const {
    uploadPhotosToAlbum,
    // deletePhoto, // Not used in this component directly, but good to have if needed
    deleteMultiplePhotos,
    getPhotoUrl,
    uploading,
    isDeleting, // Combined loading state for all delete operations
    // isLoading, // This was from usePhotoMethods, isDeleting might cover it or use a combined one
  } = usePhotoMethods();

  // Combined loading state for UI disabling
  const isProcessing = uploading || isDeleting;


  useEffect(() => {
    setIsBatchDeleteMode(false);
    setSelectedPhotosForBatchDelete(new Set());
    setSelectedPhoto(null);
    setDeleteConfirmStep(0);
  }, [currentAlbum?.id]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !albumId || !canWrite) return;

    try {
      // setUploading(true); // Handled by usePhotoMethods hook
      const result = await uploadPhotosToAlbum(albumId, e.target.files);
      if (result) {
        onPhotosChanged(albumId);
        showNotification("Photo upload successful", "success");
      }
      // Error handling for uploadPhotosToAlbum should be within usePhotoMethods or it should throw for this try/catch
    } catch (err) {
      console.error('upload error:', err);
      showNotification(
        err instanceof Error ? err.message : "Photo upload failed",
        "error"
      );
    } finally {
      // setUploading(false); // Handled by usePhotoMethods hook
      if (e.target) e.target.value = ""; // Reset file input
    }
  };

  const handleDeleteSelectedPhotos = async () => {
    if (!albumId || selectedPhotosForBatchDelete.size === 0 || !canWrite) return;

    try {
      const success = await deleteMultiplePhotos(albumId, Array.from(selectedPhotosForBatchDelete));
      if (success) {
        setSelectedPhotosForBatchDelete(new Set());
        if (selectedPhoto && selectedPhotosForBatchDelete.has(selectedPhoto.key)) {
          setSelectedPhoto(null);
        }
        onPhotosChanged(albumId);
        showNotification("Photos deleted successfully", "success");
      } else {
        // This else block might not be reached if deleteMultiplePhotos throws on failure
        showNotification("Failed to delete photos. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error during photo deletion:", error);
      showNotification(error instanceof Error ? error.message : "An error occurred while deleting photos", "error");
    } finally {
      setDeleteConfirmStep(0);
      setIsBatchDeleteMode(false); // Exit batch mode after deletion attempt
    }
  };

  const toggleBatchDeleteSelection = (photoIdentifier: string) => {
    if (!canWrite) return;
    setSelectedPhotosForBatchDelete(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(photoIdentifier)) {
        newSelection.delete(photoIdentifier);
      } else {
        newSelection.add(photoIdentifier);
      }
      return newSelection;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPhoto || !currentAlbum || !currentAlbum.images?.length) return;
      const currentIndex = currentAlbum.images.findIndex(p => p.key === selectedPhoto.key);
      if (currentIndex === -1) return;

      let newIndex = currentIndex;
      if (e.key === 'ArrowRight') {
        newIndex = (currentIndex + 1) % currentAlbum.images.length;
      } else if (e.key === 'ArrowLeft') {
        newIndex = (currentIndex - 1 + currentAlbum.images.length) % currentAlbum.images.length;
      } else if (e.key === 'Escape') {
        setSelectedPhoto(null);
        return;
      }
      if (newIndex !== currentIndex) {
        setSelectedPhoto(currentAlbum.images[newIndex]);
      }
    };

    if (selectedPhoto) { // Only add listener if modal is open
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedPhoto, currentAlbum]);


  if (!currentAlbum) {
    return ( // Consistent dark theme styling
      <div className="rounded-lg bg-slate-800 border border-slate-700 p-6 text-center shadow-sm my-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-slate-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-slate-300 font-medium">Loading album...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-1"> {/* Main container padding can be adjusted */}
      <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-3">
        <h3 className="text-base font-semibold text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {currentAlbum.name}
        </h3>
      </div>

      {canWrite && (
        <div className="relative overflow-hidden rounded-lg border-2 border-dashed border-slate-600 hover:border-indigo-500 bg-slate-800/50 hover:bg-slate-700/60 transition-colors p-6 text-center group">
          <input
            type="file" accept="image/*" multiple onChange={handlePhotoUpload}
            disabled={isProcessing}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            aria-label="Upload photos"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-slate-500 group-hover:text-indigo-400 mb-2 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-400 mb-1"></div>
              <p className="text-sm text-slate-300">Uploading...</p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium text-slate-200 group-hover:text-indigo-300 transition-colors">Click or drag photos here</p>
              <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, GIF formats</p>
            </div>
          )}
        </div>
      )}

      {currentAlbum.images?.length > 0 ? (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-slate-300">{currentAlbum.images.length} photos</span>
            {canWrite && (
              <>
                {!isBatchDeleteMode ? (
                  <button
                    onClick={() => setIsBatchDeleteMode(true)}
                    className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center font-medium"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Manage Photos
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs py-1 px-2.5 bg-indigo-500/20 text-indigo-300 rounded-full font-medium">
                      {selectedPhotosForBatchDelete.size} selected
                    </span>
                    {selectedPhotosForBatchDelete.size > 0 && (
                      <>
                        {deleteConfirmStep === 0 ? (
                          <button
                            onClick={() => setDeleteConfirmStep(1)}
                            className="text-xs py-1 px-2.5 bg-red-700/50 text-red-300 rounded-md hover:bg-red-600/60 transition-colors flex items-center font-medium"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        ) : (
                          <button
                            onClick={handleDeleteSelectedPhotos}
                            className="text-xs py-1 px-2.5 bg-red-600 text-white rounded-md hover:bg-red-500 transition-colors flex items-center font-semibold"
                          >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Confirm Delete
                          </button>
                        )}
                      </>
                    )}
                    <button
                      onClick={() => {
                        setIsBatchDeleteMode(false);
                        setSelectedPhotosForBatchDelete(new Set());
                        setDeleteConfirmStep(0);
                      }}
                      className="text-xs py-1 px-2.5 bg-slate-700 text-slate-300 rounded-md hover:bg-slate-600 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {currentAlbum.images && currentAlbum.images.map((photo) => {
              const photoIdentifier = photo.key;
              if (!photoIdentifier) {
                console.warn('Photo missing key:', photo);
                return null;
              }
              const isSelectedForDelete = selectedPhotosForBatchDelete.has(photoIdentifier);
              const isViewing = selectedPhoto?.key === photo.key;

              return (
                <div
                  key={photoIdentifier}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all duration-150
                    ${isViewing ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-indigo-400 shadow-lg' : 'border-transparent'}
                    ${isBatchDeleteMode ? 'cursor-pointer' : ''}
                    ${isSelectedForDelete ? 'border-indigo-500 ring-2 ring-indigo-500 scale-95' : 'border-slate-700 hover:border-slate-500'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isBatchDeleteMode) {
                      toggleBatchDeleteSelection(photoIdentifier);
                    } else {
                      setSelectedPhoto(photo);
                    }
                  }}
                >
                  <Image unoptimized width={1000} height={1000}
                    src={getPhotoUrl(photo.key)}
                    alt={`Photo in ${currentAlbum.name}`}
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  {isBatchDeleteMode && canWrite && (
                    <div
                      className={`absolute top-2 right-2 h-5 w-5 rounded-full border-2 flex items-center justify-center
                        ${isSelectedForDelete ? 'bg-indigo-500 border-indigo-300' : 'bg-slate-900/70 border-slate-500'}`}
                    >
                      {isSelectedForDelete && (
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  )}
                   {!isBatchDeleteMode && ( // Overlay for view icon on hover
                    <div
                        className="absolute inset-0 bg-black/0 hover:bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); setSelectedPhoto(photo);}}
                    >
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-.006.013-.01.026-.015.04C21.533 16.057 17.523 19 12 19c-4.478 0-8.268-2.943-9.542-7a24.395 24.395 0 01-.015-.04z" /></svg>
                    </div>
                    )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 bg-slate-800 rounded-lg border border-slate-700 text-center my-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-slate-300 font-medium mb-1">No photos in this album</p>
          {canWrite ? (
             <p className="text-sm text-slate-400">Upload some photos to get started using the area above.</p>
          ) : (
            <p className="text-sm text-slate-400">This album is currently empty.</p>
          )}
        </div>
      )}

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]" // Increased z-index
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <Image unoptimized width={1000} height={1000}
              src={getPhotoUrl(selectedPhoto.key)}
              style={{ width: 'auto', height: 'auto' }} className="block max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain"
              alt={`Viewing photo from ${currentAlbum.name}`}
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-3 -right-3 sm:top-2 sm:right-2 bg-slate-800/70 hover:bg-slate-700/90 rounded-full p-1.5 text-white transition-colors"
              aria-label="Close photo view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {currentAlbum && currentAlbum.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const idx = currentAlbum.images.findIndex(p => p.key === selectedPhoto.key);
                    if (idx === -1) return;
                    setSelectedPhoto(currentAlbum.images[(idx - 1 + currentAlbum.images.length) % currentAlbum.images.length]);
                  }}
                  className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 bg-slate-800/60 hover:bg-slate-700/80 rounded-full p-2 text-white transition-all"
                  aria-label="Previous photo"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const idx = currentAlbum.images.findIndex(p => p.key === selectedPhoto.key);
                    if (idx === -1) return;
                    setSelectedPhoto(currentAlbum.images[(idx + 1) % currentAlbum.images.length]);
                  }}
                  className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 bg-slate-800/60 hover:bg-slate-700/80 rounded-full p-2 text-white transition-all"
                  aria-label="Next photo"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                 <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full shadow-md">
                   {currentAlbum.images.findIndex(p => p.key === selectedPhoto?.key) + 1} / {currentAlbum.images.length}
                 </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}