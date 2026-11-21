import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import PopupContent from "@/components/map/leaflet/PopupContent";
import { JourneyAlbum } from "@/types/common/index";
import { Pin } from '@/types/common/pin';


const pinIcon = L.divIcon({
    html: "📍",
    className: "bg-transparent border-none text-2xl",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
});

interface PinMarkersProps {
    pins: Pin[];
    selectedAlbum: JourneyAlbum | null;
    setSelectedPointId: (id: string) => void;
}

const PinMarkers: React.FC<PinMarkersProps> = ({ pins, selectedAlbum, setSelectedPointId }) => {
    return (
        <>
            {pins.map((point) => {
                const position: [number, number] = [point.geo_location.lat, point.geo_location.lng];
                return (
                    <Marker
                        key={point.id}
                        position={position}
                        icon={pinIcon}
                        eventHandlers={{ click: () => setSelectedPointId(point.id) }}
                    >
                        <Popup>
                            <PopupContent
                                point={{ id: point.id.toString(), name: point.city }}
                                album={selectedAlbum}
                            />
                        </Popup>
                    </Marker>
                );
            })}
        </>
    );
};

export default PinMarkers;