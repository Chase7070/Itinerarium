// src/context/MapContext.tsx
import React, { createContext, useState, useContext, ReactNode, useCallback, useRef, useEffect } from 'react';
import L from 'leaflet';
import { MapMapAclContext } from './MapAclContext'; // 引入 ACLProvider

interface MapContextType {
  pinMode: boolean;
  setPinMode: React.Dispatch<React.SetStateAction<boolean>>;
  newPinName: string;
  setNewPinName: React.Dispatch<React.SetStateAction<string>>;
  mapInstance: L.Map | null;
  setMapInstance: React.Dispatch<React.SetStateAction<L.Map | null>>;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const [pinMode, setPinMode] = useState<boolean>(false);
  const [newPinName, setNewPinName] = useState<string>("");
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapInstance) {
      mapRef.current = mapInstance;
    }
  }, [mapInstance]);

  return (
    <MapContext.Provider
      value={{
        pinMode, setPinMode,
        newPinName, setNewPinName,
        mapInstance, setMapInstance,
      }}
    >
      <MapMapAclContext>{children}</MapMapAclContext>
    </MapContext.Provider>
  );
};

export const useMap = (): MapContextType => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return context;
};
