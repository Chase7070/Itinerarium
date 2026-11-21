import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Share } from "@/types/common/index";

interface MapAclContextType {
  share: Share | null;
  permission: 'read' | 'write';
  setShare: (share: Share | null) => void;
  setPermission: (permission: 'read' | 'write') => void;
}

const MapAclContext = createContext<MapAclContextType | undefined>(undefined);

export const MapMapAclContext = ({ children }: { children: ReactNode }) => {
  const [share, setShare] = useState<any | null>(null);
  const [permission, setPermission] = useState<'read' | 'write'>('read');

  return (
    <MapAclContext.Provider value={{ share, permission, setShare, setPermission }}>
      {children}
    </MapAclContext.Provider>
  );
};

export const useMapAcl = (): MapAclContextType => {
  const context = useContext(MapAclContext);
  if (!context) {
    throw new Error('useACL must be used within an MapMapAclContext');
  }
  return context;
};