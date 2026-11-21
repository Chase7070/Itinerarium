'use client';

import React, { useRef, useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMap } from "@/contexts/map/MapContext";
import { useTileStyle } from "@/contexts/map/TileStyleContext";
import { useMapPins } from "@/contexts/map/MapPinsContext";
import { useSelectedPoint } from "@/contexts/map/SelectedPointContext";
import { JourneyAlbum } from '@/types/common/index';
import { useSelectedAlbum } from '@/contexts/map/SelectedAlbumContext';
import { usePhotoAlbum } from '@/contexts/map/PhotoAlbumContext';
import { useSocket } from '@/contexts/WebsocketContext';
import UserPanel from '@/components/map/leaflet/UserPanel';
import MouseMarkers from '@/components/map/leaflet/MouseMarkers';
import PinMarkers from '@/components/map/leaflet/PinMarkers';
import MapEventHandler from "@/components/map/leaflet/MapEventHandler";
import { useWebSocketListeners } from '@/hooks/ws/useWebSocketListeners';
import { UserPosition, RoomUser } from '@/types/ws/event';


const RouteMapLeaflet = () => {
  // Reference to the Leaflet map instance
  const mapRef = useRef<L.Map>(null);

  // Get tile layer link and options from context
  const { getTileLayerLink } = useTileStyle();

  // Manage map pins and synchronization
  const { pins, syncPins } = useMapPins();
  const { setSelectedPointId } = useSelectedPoint();

  // Manage pin creation mode and new pin name
  const { pinMode, newPinName } = useMap();
  const { addPin } = useMapPins();

  // Manage selected album and album synchronization
  const [selectedAlbum, setSelectedAlbum] = useState<JourneyAlbum | null>(null);
  const { selectedAlbumId } = useSelectedAlbum();
  const { getAlbumById, syncAlbums } = usePhotoAlbum();

  // WebSocket connection and listeners
  const socket = useSocket();
  const [connMousePositions, setConnMousePositions] = useState<UserPosition[]>([]);
  const [roomUsers, setRoomUsers] = useState<RoomUser[]>([]);
  useWebSocketListeners({ socket, setConnMousePositions, setRoomUsers, syncPins, syncAlbums });

  // Fetch album data when the selected album ID changes
  useEffect(() => {
    const fetchAlbumData = async () => {
      if (selectedAlbumId) {
        try {
          const albumData = await getAlbumById(selectedAlbumId);
          setSelectedAlbum(albumData || null);
        } catch {
          setSelectedAlbum(null);
        }
      } else {
        setSelectedAlbum(null);
      }
    };

    fetchAlbumData();
  }, [selectedAlbumId, getAlbumById]);

  // Adjust map size when the number of pins changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.invalidateSize();
    }
  }, [pins.length]);

  return (
    <div className="w-full h-full relative z-50 overflow-hidden rounded-lg shadow-md border border-gray-200 bg-gray-50">
      <UserPanel roomUsers={roomUsers} />
      <MapContainer
        ref={mapRef}
        center={[30, 0]} zoom={2} minZoom={2} maxZoom={19}
        maxBoundsViscosity={1.0} worldCopyJump={true} zoomControl={false} scrollWheelZoom={true} className="w-full h-full"
        maxBounds={[
          [-85, -Infinity],
          [85, Infinity]
        ]}
      >
        <TileLayer
          url={getTileLayerLink()}
          attribution="&copy; OpenStreetMap contributors" maxZoom={19} minZoom={2} noWrap={false}
        />
        <MapEventHandler pinMode={pinMode} newPinName={newPinName} addPin={addPin} socket={socket} />
        <MouseMarkers connMousePositions={connMousePositions} />
        <PinMarkers pins={pins} selectedAlbum={selectedAlbum} setSelectedPointId={setSelectedPointId} />
      </MapContainer>
    </div>
  );
};

export default RouteMapLeaflet;