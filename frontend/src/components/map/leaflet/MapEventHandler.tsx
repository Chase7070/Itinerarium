import React from "react";
import { useMapEvents } from "react-leaflet";
import { reverseGeocode } from "@/api/openRouteService/index";
import { MessageType, Position } from "@/types/ws/event";
import { Pin } from "@/types/common/index";
import { Socket } from 'socket.io-client';

interface MapEventHandlerProps {
    pinMode: boolean;
    newPinName: string | null;
    addPin: (pin: Omit<Pin, 'id' | 'map_id'>) => Promise<void>;
    socket: Socket;
}

const MapEventHandler: React.FC<MapEventHandlerProps> = ({ pinMode, newPinName, addPin, socket }) => {
    useMapEvents({
        click: async (e) => {
            if (pinMode && newPinName && newPinName.trim()) {
                try {
                    const { country } = await reverseGeocode(e.latlng.lat, e.latlng.lng);
                    await addPin({ geo_location: e.latlng, city: newPinName, country });
                } catch (error) {
                    await addPin({ geo_location: e.latlng, city: newPinName, country: "Unknown" });
                }
            }
        },
        mousemove: (e) => {
            socket.emit(MessageType.MOUSE_MOVE, e.latlng as Position);
        },
    });

    return null;
};

export default MapEventHandler;