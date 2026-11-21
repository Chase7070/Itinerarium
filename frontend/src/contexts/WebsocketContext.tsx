'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

type SocketContextType = {
    socket: Socket | null;
};

const SocketContext = createContext<SocketContextType>({ socket: null });

export const SocketProvider = ({ children, mapId }: { children: ReactNode, mapId: string }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const newSocket = io(`${process.env.NEXT_PUBLIC_WS_BASE_URL || 'ws://localhost:3001'}/ws/map`, {
            transports: ['websocket'],
            auth: { token },
            query: { map_id: mapId },
        });
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [mapId]);

    if (!socket) {
        return <div>Loading WebSocket...</div>;
    }

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const { socket } = useContext(SocketContext);
    if (!socket) throw new Error('Socket is not connected yet');
    return socket;
};
