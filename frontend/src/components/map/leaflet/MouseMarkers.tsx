import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { UserPosition } from "@/types/ws/event";

interface MouseMarkersProps {
    connMousePositions: UserPosition[];
}

const MouseMarkers: React.FC<MouseMarkersProps> = ({ connMousePositions }) => {
    return (
        <>
            {connMousePositions.map(({ user, position, style }) => (
                <Marker
                    key={user.id}
                    position={[position.lat, position.lng]}
                    icon={L.divIcon({
                        html: style || "📍",
                        className: "bg-transparent border-none text-2xl",
                        iconSize: [30, 30],
                        iconAnchor: [15, 30],
                        popupAnchor: [0, -30],
                    })}
                >
                    <Popup autoPan={false}>
                        <div className="text-sm text-gray-800">
                            <p>
                                <strong>{user.name}</strong>
                            </p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </>
    );
};

export default MouseMarkers;