'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { mapApi } from '@/api/mapApi';
import { Map } from '@/types/common/index';

interface UserMapsContextType {
  maps: Map[];
  isLoading: boolean;
  error: string | null;
  fetchMaps: () => Promise<void>;
  createMap: (mapData: { name: string; description?: string; type?: string }) => Promise<Map>;
  updateMap: (mapId: string, Map: { name: string; description?: string }) => Promise<Map>;
  deleteMap: (mapId: string) => Promise<void>;
  selectedMapId: string | null;
  setSelectedMapId: (mapId: string | null) => void;
  getMapById: (mapId: string) => Map | undefined;
}

const UserMapsContext = createContext<UserMapsContextType | undefined>(undefined);

export function UserMapsProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [maps, setMaps] = useState<Map[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMapId, setSelectedMapId] = useState<string | null>(null);

  // add flag to prevent duplicate requests
  const fetchingRef = useRef(false);
  const hasFetchedRef = useRef(false);

  // function to create default map
  const createDefaultMap = useCallback(async () => {
    if (!user || !user.username) return;

    setIsLoading(true);

    try {
      const defaultMapData = {
        name: `${user.username}'s Default Map`,
        description: 'This is a blank map.',
        type: 'default'
      };

      const newMap = await mapApi.createMap(defaultMapData);

      setMaps(prevMaps => [...prevMaps, newMap.map]);

      setSelectedMapId(newMap.map.id);

      return newMap;
    } catch (err) {
      console.error('Failed to create default map:', err);
      setError('Unable to create default map, please try again later');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const fetchMaps = useCallback(async (forceRefresh = false) => {
    // If already fetching data, return immediately
    if (fetchingRef.current) {
      console.log('Already fetching maps, skipping');
      return;
    }

    // If data already fetched and not force refreshing, return immediately
    if (hasFetchedRef.current && maps.length > 0 && !forceRefresh) {
      console.log('Maps already loaded, skipping fetch');
      return;
    }

    // Set flag to prevent duplicate requests
    fetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching maps data...', new Date().toISOString());
      const mapsData = await mapApi.getUserMaps();
      setMaps(mapsData.maps);
      hasFetchedRef.current = true;

      // Check if default map exists, create one if not
      const hasDefaultMap = mapsData.maps.some((map: Map) => map.type === 'default');
      if (!hasDefaultMap) {
        console.log('No default map found, creating a new default map');
        await createDefaultMap();
      }
    } catch (err) {
      console.error('Failed to fetch map list:', err);
      setError('Unable to load map list, please try again later');
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
    }
  }, [user, createDefaultMap]);

  useEffect(() => {
    if (user && !authLoading && !hasFetchedRef.current) {
      fetchMaps();
    } else if (!user) {
      setMaps([]);
      setSelectedMapId(null);
      hasFetchedRef.current = false;
    }
  }, [user, authLoading, fetchMaps]);

  const createMap = async (mapData: { name: string; description?: string }) => {
    setIsLoading(true);
    try {
      const newMap = await mapApi.createMap(mapData);
      setMaps(prevMaps => [...prevMaps, newMap.map]);
      return newMap.map;
    } catch (err) {
      console.error('Failed to create map:', err);
      setError('Failed to create map, please try again later');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateMap = async (mapId: string, mapData: { name: string; description?: string }) => {
    setIsLoading(true);
    try {
      const updatedMap = await mapApi.updateMap(mapId, mapData);
      setMaps(prevMaps => prevMaps.map(map => map.id === mapId ? updatedMap.map : map));
      return updatedMap.map;
    } catch (err) {
      console.error('Failed to update map:', err);
      setError('Failed to update map, please try again later');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMap = async (mapId: string) => {
    setIsLoading(true);
    try {
      await mapApi.deleteMap(mapId);
      setMaps(prevMaps => prevMaps.filter(map => map.id !== mapId));
      if (selectedMapId === mapId) {
        setSelectedMapId(null);
      }
    } catch (err) {
      console.error('Failed to delete map:', err);
      setError('Failed to delete map, please try again later');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getMapById = useCallback(
    (mapId: string): Map | undefined => {
      return maps.find(map => map.id === mapId);
    },
    [maps]
  );

  return (
    <UserMapsContext.Provider
      value={{
        maps,
        isLoading,
        error,
        fetchMaps: () => fetchMaps(true),
        createMap,
        updateMap,
        deleteMap,
        selectedMapId,
        setSelectedMapId,
        getMapById
      }}
    >
      {children}
    </UserMapsContext.Provider>
  );
}

export function useUserMaps() {
  const context = useContext(UserMapsContext);
  if (context === undefined) {
    throw new Error('useUserMaps must be used inside UserMapsProvider');
  }
  return context;
}