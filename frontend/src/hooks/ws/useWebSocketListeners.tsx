import type { Socket } from "socket.io-client";
import { useEffect } from "react";
import { MessageType, WebSocketEvent, EventType, UserPosition, RoomUser } from "@/types/ws/event";

interface UseWebSocketListenersProps {
    socket: Socket;
    setConnMousePositions: React.Dispatch<React.SetStateAction<UserPosition[]>>;
    setRoomUsers: React.Dispatch<React.SetStateAction<RoomUser[]>>;
    syncPins: () => Promise<void>;
    syncAlbums: () => Promise<void>;
}

export const useWebSocketListeners = ({
    socket,
    setConnMousePositions,
    setRoomUsers,
    syncPins,
    syncAlbums,
}: UseWebSocketListenersProps) => {
    useEffect(() => {
        // Handle general events
        const handleEvent = async (data: WebSocketEvent<unknown>) => {
            switch (data.type) {
                case EventType.PIN_CREATED:
                case EventType.PIN_UPDATED:
                case EventType.PIN_DELETED:
                    await syncPins();
                    break;

                case EventType.ALBUM_CREATED:
                case EventType.ALBUM_UPDATED:
                case EventType.ALBUM_DELETED:
                    await syncAlbums();
                    break;

                default:
                    console.warn("Unhandled WebSocket event type:", data.type);
            }
        };

        // Listen for WebSocket events
        socket.on(MessageType.EVENT, handleEvent);

        // Listen for connection mouse positions
        socket.on(MessageType.CONN_POSITIONS, (data: WebSocketEvent<UserPosition[]>) => {
            setConnMousePositions(data.payload);
        });

        // Listen for room users
        socket.on(MessageType.ROOM_USERS, (data: WebSocketEvent<RoomUser[]>) => {
            setRoomUsers(data.payload);
        });

        // Cleanup listeners on unmount
        return () => {
            socket.off(MessageType.EVENT, handleEvent);
            socket.off(MessageType.CONN_POSITIONS);
            socket.off(MessageType.ROOM_USERS);
        };
    }, [socket, setConnMousePositions, setRoomUsers, syncPins, syncAlbums]);
};