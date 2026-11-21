'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';

interface TileStyleContextType {
    tileStyle: string;
    setTileStyle: (style: string) => void;
    getTileLayerLink: () => string;
}

const TileStyleContext = createContext<TileStyleContextType | undefined>(undefined);

export const TileStyleProvider = ({ children, initialStyle = 'light' }: { children: ReactNode; initialStyle?: string }) => {
    const { user } = useAuth();
    const localKey = `tileStyle_${user?.id || 'default'}`;

    const [tileStyle, setTileStyleState] = useState<string>(initialStyle);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedStyle = localStorage.getItem(localKey);
            if (storedStyle) {
                setTileStyleState(storedStyle);
            }
        }
    }, [localKey]);

    const setTileStyle = (style: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(localKey, style);
        }
        setTileStyleState(style);
    };

    const getTileLayerLink = (): string => {
        switch (tileStyle) {
            case "light":
                return "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
            case "dark":
                return "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
            case "satellite":
                return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
            case "terrain":
                return "https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png";
            case "watercolor":
                return "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg";
            case "topo":
                return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}";
            case "toner":
                return "https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png";
            case "arcgis_gray":
                return "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}";
            case "arcgis_ocean":
                return "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}";
            case "arcgis_relief":
                return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}";
            case "open_topo":
                return "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";
            default:
                return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
        }
    };

    return (
        <TileStyleContext.Provider value={{ tileStyle, setTileStyle, getTileLayerLink }}>
            {children}
        </TileStyleContext.Provider>
    );
};

export const useTileStyle = (): TileStyleContextType => {
    const context = useContext(TileStyleContext);
    if (!context) {
        throw new Error('useTileStyle must be used within a TileStyleProvider');
    }
    return context;
};