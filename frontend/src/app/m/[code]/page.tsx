'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useMapAcl } from '@/contexts/map/MapAclContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import MainMapContainer from '@/components/map/MainMapContainer';
import { shareApi } from '@/api/shareApi';
import { Map } from '@/types/common/index';

export default function Page({ params }: { params: Promise<{ code: string }> }) {
    const [map, setMap] = useState<Map | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { user } = useAuth(); // get user info
    const { setPermission, setShare } = useMapAcl(); // get user info

    const resolvedParams = use(params);
    const code = resolvedParams.code;

    useEffect(() => {
        if (!user) {
            return; // if user not logged in, do not execute后续逻辑
        }

        const fetchMap = async () => {
            try {
                const data = await shareApi.getShareByCode(code);
                setMap(data.share.map || null);
                setPermission(data.permission);
                setShare(data.share);
            } catch (error) {
                console.error('Error fetching mapId:', error);
                router.replace('/404'); // @FIXME
            } finally {
                setLoading(false);
            }
        };

        fetchMap();
    }, [code, user, router, setPermission, setShare]);

    if (!user) {
        return <div>Redirecting to login...</div>; // if user not logged in, show redirecting to login
    }

    if (loading) {
        return <div>Loading...</div>; // show loading status
    }

    if (!map) {
        return <div>Map not found</div>; // map not found
    }

    return (
        <ProtectedRoute>
            <MainMapContainer map={map} user={user} />
        </ProtectedRoute>
    );
}