import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { registerWebSocketRoutes } from './mapWebsocket';

export function initializeWebSocket(httpServer: HttpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: '*', // Adjust this to match your frontend's origin
            methods: ['GET', 'POST'],
        },
    });

    // Namespace for /ws/map
    registerWebSocketRoutes(io);

    return io;
}