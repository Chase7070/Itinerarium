'use client';

import { ReactNode } from 'react';
import { MapProvider } from '@/contexts/map/MapContext';

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <MapProvider>
            {children}
        </MapProvider>
    );
}