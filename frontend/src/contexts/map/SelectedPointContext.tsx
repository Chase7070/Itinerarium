import React, { createContext, useState, useContext, ReactNode } from 'react';

interface SelectedPointContextType {
    selectedPointId: string | null;
    setSelectedPointId: (pointId: string | null) => void;
}

const SelectedPointContext = createContext<SelectedPointContextType | undefined>(undefined);

export const SelectedPointProvider = ({ children }: { children: ReactNode }) => {
    const [selectedPointId, setSelectedPointId] = useState<string | null>(null);

    return (
        <SelectedPointContext.Provider value={{ selectedPointId, setSelectedPointId }}>
            {children}
        </SelectedPointContext.Provider>
    );
};

export const useSelectedPoint = (): SelectedPointContextType => {
    const context = useContext(SelectedPointContext);
    if (!context) {
        throw new Error('useSelectedPoint must be used within a SelectedPointProvider');
    }
    return context;
};