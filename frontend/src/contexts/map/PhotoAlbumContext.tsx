// src/context/PhotoAlbumContext.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { journeyAlbumApi, JourneyAlbumData } from '@/api/journeyAlbumApi';
import { useSelectedPoint } from '@/contexts/map/SelectedPointContext';
import { JourneyAlbum } from '@/types/common/index'; // assume Album type is defined

export interface Photo {
  id: string;     // unique identifier, usually the same as key
  url: string;    // complete access URL
  key: string;    // path in backend storage for API operations
}

interface PhotoAlbumContextType {
  albums: JourneyAlbum[];
  getAlbumById: (albumId: string) => JourneyAlbum | undefined;
  createAlbum: (name: string) => Promise<JourneyAlbum>;
  updateAlbumName: (albumId: string, newName: string) => Promise<void>;
  deleteAlbum: (albumId: string) => Promise<void>;
  addPhotosToAlbum: (albumId: string, newPhotos: Photo[]) => Promise<void>;
  deletePhotosFromAlbum: (albumId: string, photoIdentifiers: string[]) => Promise<void>;
  syncAlbums: () => Promise<void>;
}

const PhotoAlbumContext = createContext<PhotoAlbumContextType | undefined>(undefined);

export const PhotoAlbumProvider = ({ children, mapId }: { children: ReactNode, mapId: string }) => {
  const [albums, setAlbums] = useState<JourneyAlbum[]>([]);
  const { selectedPointId } = useSelectedPoint();
  const pinId = selectedPointId || "";

  const fetchJourneyAlbums = useCallback(async () => {
    if (!mapId || !pinId) {
      setAlbums([]);
      return null;
    }

    try {
      const allAlbums = await journeyAlbumApi.getJourneyAlbums(mapId, pinId);
      setAlbums(allAlbums.journeyAlbums);
      return allAlbums;
    } catch (err) {
      console.error("Failed to fetch albums:", err);
      return null;
    }
  }, [mapId, pinId]);

  useEffect(() => {
    if (mapId && pinId) {
      fetchJourneyAlbums();
    }
  }, [mapId, pinId, fetchJourneyAlbums]);

  const getAlbumById = useCallback((albumId: string) => {
    return albums.find(a => a.id === albumId);
  }, [albums]);

  const createAlbum = useCallback(
    async (name: string): Promise<JourneyAlbum> => {
      const newAlbum = await journeyAlbumApi.createJourneyAlbum(mapId, pinId, { name } as JourneyAlbumData);
      setAlbums((albums) => [...albums, newAlbum.journeyAlbum]);
      return newAlbum.journeyAlbum;
    },
    [mapId, pinId]
  );

  // Update album name
  const updateAlbumName = useCallback(
    async (albumId: string, newName: string) => {
      try {
        await journeyAlbumApi.updateJourneyAlbum(mapId, pinId, albumId, { name: newName });
        setAlbums((albums) =>
          albums.map((album) =>
            album.id === albumId ? { ...album, name: newName } : album
          )
        );
      } catch (err) {
        console.error("Failed to update album name:", err);
        throw err;
      }
    },
    [mapId, pinId]
  );

  // Add photos to an album
  const addPhotosToAlbum = useCallback(
    async (albumId: string, newPhotos: Photo[]) => {
      try {
        // ensure only key is sent to backend
        await journeyAlbumApi.updateJourneyAlbum(mapId, pinId, albumId, {
          images: newPhotos.map(photo => ({ key: photo.key }))
        });

        // update frontend state after success
        setAlbums(prev => prev.map(album =>
          album.id === albumId
            ? {
              ...album,
              images: [...(album.images || []), ...newPhotos]
            }
            : album
        ));
      } catch (err) {
        console.error("Failed to add photos to album:", err);
        throw err;
      }
    },
    [mapId, pinId]
  );

  // Delete photos from an album - support both id and key deletion
  const deletePhotosFromAlbum = useCallback(
    async (albumId: string, photoIdentifiersToDelete: string[]) => {
      const album = albums.find((a) => a.id === albumId);
      if (!album) {
        console.error(`Album with id ${albumId} not found for deleting photos.`);
        return;
      }

      try {
        // support both id and key deletion
        const remainingPhotos = album.images.filter((photo) => {
          // if photo's id or key is in the list of photos to delete, filter it out
          return !photoIdentifiersToDelete.includes(photo.key) &&
            !photoIdentifiersToDelete.includes(photo.key);
        });

        // send only key to backend
        const changedAlbum = await journeyAlbumApi.updateJourneyAlbum(mapId, pinId, albumId, {
          images: remainingPhotos.map((photo) => ({ key: photo.key })),
        });

        // update frontend state
        setAlbums((albums) =>
          albums.map((a) =>
            a.id === albumId
              ? changedAlbum.journeyAlbum
              : a
          )
        );
      } catch (err) {
        console.error("Failed to delete photos from album:", err);
        throw err;
      }
    },
    [albums, mapId, pinId]
  );

  // Delete an album
  const deleteAlbum = useCallback(
    async (albumId: string) => {
      const albumToDelete = albums.find((a) => a.id === albumId);
      if (!albumToDelete) {
        console.error(`Album with id ${albumId} not found for deletion.`);
        return;
      }

      try {
        await journeyAlbumApi.deleteJourneyAlbum(mapId, pinId, albumId);
        setAlbums((albums) => albums.filter((a) => a.id !== albumId));
      } catch (err) {
        console.error("Failed to delete album:", err);
        throw err;
      }
    },
    [albums, mapId, pinId]
  );

  const syncAlbums = useCallback(async () => {
    await fetchJourneyAlbums();
  }, [fetchJourneyAlbums]);

  return (
    <PhotoAlbumContext.Provider
      value={{
        albums,
        getAlbumById,
        createAlbum,
        updateAlbumName,
        deleteAlbum,
        addPhotosToAlbum,
        deletePhotosFromAlbum,
        syncAlbums,
      }}
    >
      {children}
    </PhotoAlbumContext.Provider>
  );
};

export const usePhotoAlbum = (): PhotoAlbumContextType => {
  const context = useContext(PhotoAlbumContext);
  if (!context) {
    throw new Error('usePhotoAlbum must be used within a PhotoAlbumProvider');
  }
  return context;
};