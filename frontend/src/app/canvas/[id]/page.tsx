'use client';

import { use, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useMapAcl } from '@/contexts/map/MapAclContext';
import { useUserMaps } from '@/contexts/map/UserMapsContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import MainMapContainer from '@/components/map/MainMapContainer';
import { useRouter } from 'next/navigation';

export default function CanvasPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useAuth();
  const { setPermission, setShare } = useMapAcl();
  const { maps, fetchMaps } = useUserMaps();
  const router = useRouter();

  const resolvedParams = use(params);
  const mapId = resolvedParams.id;

  // Ensure we get the latest map list when the page loads
  useEffect(() => {
    if (user && (!maps || maps.length === 0)) {
      console.log('Fetching maps in canvas page');
      fetchMaps();
    }
  }, [user, maps?.length]);

  // Validate map ID and handle default map logic
  useEffect(() => {
    if (!maps || maps.length === 0) {
      return;
    }

    const isValidId = maps.some(map => map.id === mapId);

    if (!isValidId) {
      console.log('Invalid map ID, looking for default map...');
      const defaultMap = maps.find(map => map.type === 'default');

      if (defaultMap && defaultMap.id) {
        const defaultMapId = defaultMap.id;
        console.log('Default map found, redirecting to:', defaultMapId);
        router.replace(`/canvas/${defaultMapId}`);
      } else {
        console.error('Could not find default map');
      }
    }
  }, [maps, mapId, router]);

  const currentMap = maps?.find(map => map.id === mapId);
  // Move setShare and setPermission to useEffect
  useEffect(() => {
    if (currentMap) {
      setShare(currentMap.share || null);
      setPermission("write");
    }
  }, [currentMap, setShare, setPermission]);

  return (
    <ProtectedRoute>
      {user && maps && currentMap && <MainMapContainer map={currentMap} user={user} />}
    </ProtectedRoute>
  );
}