'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { mapPinApi } from '@/api/mapPinApi';
import { Pin } from '@/types/common/pin';

interface MapPinsContextType {
  pins: Pin[];
  addPin: (pinData: Omit<Pin, 'id' | 'map_id'>) => Promise<void>;
  updatePin: (pinId: string, updates: Partial<Pin>) => Promise<void>;
  deletePin: (pinId: string) => Promise<void>;
  getPinById: (pinId: string) => Pin | undefined;
  syncPins: () => Promise<void>;
}

const MapPinsContext = createContext<MapPinsContextType | undefined>(undefined);

interface MapPinsProviderProps {
  children: ReactNode;
  mapId: string;
}

export const MapPinsProvider = ({ children, mapId }: MapPinsProviderProps) => {
  const [pins, setPins] = useState<Pin[]>([]);

  // Fetch pins from the backend
  const fetchPins = useCallback(async () => {
    try {
      const response = await mapPinApi.getMapPins(mapId);
      setPins(response.mapPins);
    } catch (err) {
      console.error('Failed to fetch pins:', err);
    }
  }, [mapId]);

  // Add a new pin
  const addPin = useCallback(
    async (pinData: Omit<Pin, 'id' | 'map_id'>) => {
      try {
        const response = await mapPinApi.createMapPin(mapId, pinData);
        setPins((prevPins) => [...prevPins, response.mapPin]);
      } catch (err) {
        console.error('Failed to add pin:', err);
      }
    },
    [mapId]
  );

  // Update an existing pin
  const updatePin = useCallback(
    async (pinId: string, updates: Partial<Pin>) => {
      try {
        const response = await mapPinApi.updateMapPin(mapId, pinId, updates);
        setPins((prevPins) =>
          prevPins.map((pin) => (pin.id === pinId ? { ...pin, ...response.mapPin } : pin))
        );
      } catch (err) {
        console.error('Failed to update pin:', err);
      }
    },
    [mapId]
  );

  // Delete a pin
  const deletePin = useCallback(
    async (pinId: string) => {
      try {
        await mapPinApi.deleteMapPin(mapId, pinId);
        setPins((prevPins) => prevPins.filter((pin) => pin.id !== pinId));
      } catch (err) {
        console.error('Failed to delete pin:', err);
      }
    },
    [mapId]
  );

  // Get a pin by its ID
  const getPinById = useCallback(
    (pinId: string): Pin | undefined => {
      return pins.find((pin) => pin.id === pinId);
    },
    [pins]
  );

  // Sync pins manually
  const syncPins = useCallback(async () => {
    await fetchPins();
  }, [fetchPins]);

  useEffect(() => { fetchPins() }, [fetchPins]);

  return (
    <MapPinsContext.Provider value={{ pins, addPin, updatePin, deletePin, getPinById, syncPins }}>
      {children}
    </MapPinsContext.Provider>
  );
};

export const useMapPins = (): MapPinsContextType => {
  const context = useContext(MapPinsContext);
  if (!context) {
    throw new Error('useMapPins must be used within a MapPinsProvider');
  }
  return context;
};