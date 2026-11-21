'use client';

import { useUserMaps } from '@/contexts/map/UserMapsContext';

export default function MapDebugger() {
  const { maps, isLoading, error } = useUserMaps();
  
  return (
    <div className="fixed bottom-0 right-0 p-4 m-4 bg-white border border-gray-300 rounded shadow-lg opacity-75 hover:opacity-100 transition-opacity z-50">
      <h3 className="text-sm font-bold mb-2">Map data debugger</h3>  
      <div className="text-xs">
        <p>loading status: {isLoading ? 'loading' : 'completed'}</p>
        <p>map count: {Array.isArray(maps) ? maps.length : 'not an array'}</p>
        {error && <p className="text-red-500">error: {error}</p>}
        <details>
          <summary className="cursor-pointer">view map data</summary>
          <pre className="mt-2 max-h-40 overflow-auto">
            {JSON.stringify(maps, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}