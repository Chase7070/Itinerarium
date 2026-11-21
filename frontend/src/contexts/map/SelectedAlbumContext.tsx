import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface SelectedAlbumContextType {
    selectedAlbumId: string | null;
    setSelectedAlbumId: (albumId: string | null) => void;
}

const SelectedAlbumContext = createContext<SelectedAlbumContextType | undefined>(undefined);

export const SelectedAlbumProvider = ({ children }: { children: ReactNode }) => {
    const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
    return (
        <SelectedAlbumContext.Provider value={{ selectedAlbumId, setSelectedAlbumId }}>
            {children}
        </SelectedAlbumContext.Provider>
    );
};

export const useSelectedAlbum = (): SelectedAlbumContextType => {
    const context = useContext(SelectedAlbumContext);
    if (!context) {
        throw new Error('useSelectedAlbum must be used within a SelectedAlbumProvider');
    }
    return context;
};