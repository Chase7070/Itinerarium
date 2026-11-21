'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import PhotoSettingsPanel from '@/components/map/PhotoSettingsPanel';
import CanvasSettingPanel from '@/components/map/CanvasSettingPanel';
import PinSettingPanel from '@/components/map/PinSettingPanel';
import ShareSettingPanel from '@/components/map/ShareSettingPanel';
import { PhotoAlbumProvider } from '@/contexts/map/PhotoAlbumContext';
import { SelectedPointProvider } from '@/contexts/map/SelectedPointContext';
import { SelectedAlbumProvider } from '@/contexts/map/SelectedAlbumContext';
import { MapPinsProvider } from '@/contexts/map/MapPinsContext';
import { Map, User } from '@/types/common/index';
import dynamic from 'next/dynamic';


type PanelType = 'canvas' | 'pin' | 'photo' | 'share' | null;

interface MainMapContainerProps {
    map: Map;
    user: User;
}


const RouteMapLeaflet = dynamic(() => import('@/components/map/RouteMapLeaflet'), { ssr: false });
const SocketProvider = dynamic(() => import('@/contexts/WebsocketContext').then(mod => mod.SocketProvider), { ssr: false, });

const MainMapContainer: React.FC<MainMapContainerProps> = ({ map, user }) => {
    const [activePanel, setActivePanel] = useState<PanelType>(null);
    const [showMap] = useState(true);
    const togglePanel = (panel: PanelType) => { setActivePanel((prev) => (prev === panel ? null : panel)) };

    return (
        <SelectedPointProvider>
            <SelectedAlbumProvider>
                <MapPinsProvider mapId={map.id}>
                    <PhotoAlbumProvider mapId={map.id}>
                        <SocketProvider mapId={map.id}>
                            <div className="h-screen flex flex-col bg-gray-50 pt-16 dark:bg-gray-900">
                                <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] p-4 gap-4">
                                    <div className="flex-1 h-[300px] md:h-full bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                                        {showMap ? (
                                            <RouteMapLeaflet />
                                        ) : (
                                            <div className="flex h-full items-center justify-center">
                                                <p className="text-gray-500 text-lg">Map loading...</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="w-full md:w-80 flex-shrink-0 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 overflow-auto flex flex-col ">
                                        <div className="mb-6">
                                            <div className="flex items-center space-x-4 mb-4">
                                                {user?.avatar ? (
                                                    <Image unoptimized width={48} height={48}
                                                        src={`${process.env.NEXT_PUBLIC_API_URL}${user.avatar}`}
                                                        alt="User avatar"
                                                        className="w-12 h-12 rounded-full border-2 border-indigo-100 dark:border-indigo-900"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = '/assets/default-avatar.png';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-inner">
                                                        <span className="text-white font-medium">
                                                            {user?.username?.charAt(0).toUpperCase() || '?'}
                                                        </span>
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">{user?.username || 'User'}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || ''}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-3 flex-1">
                                                {/* Canvas Settings */}
                                                {map && (
                                                    <CanvasSettingPanel
                                                        isActive={activePanel === 'canvas'}
                                                        onToggle={() => togglePanel('canvas')}
                                                        map={map}
                                                    />
                                                )}

                                                {/* Pin Settings */}
                                                <PinSettingPanel
                                                    isActive={activePanel === 'pin'}
                                                    onToggle={() => togglePanel('pin')}
                                                />

                                                {/* Photo Settings Panel */}
                                                <PhotoSettingsPanel
                                                    isActive={activePanel === 'photo'}
                                                    onToggle={() => togglePanel('photo')}
                                                />


                                                {/* Share Settings Panel */}
                                                {map && map.type !== "default" && map.owner == user.id && (
                                                    <ShareSettingPanel
                                                        isActive={activePanel === 'share'}
                                                        onToggle={() => togglePanel('share')}
                                                        map={map}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SocketProvider>
                    </PhotoAlbumProvider>
                </MapPinsProvider>
            </SelectedAlbumProvider>
        </SelectedPointProvider>
    );
};

export default MainMapContainer;