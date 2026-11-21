import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from '@/config/config';
import { eventBus, EventTypes } from '@/events/eventBus';
import { validateMapAccess } from '@/services/mapService';
import { WebSocketMessage, WebSocketEvent, MessageType, Position } from '@/types/websocket';


export function registerWebSocketRoutes(io: Server) {
  const mapNamespace = io.of('/ws/map');

  // Middleware for JWT authentication and map_id validation
  mapNamespace.use(async (socket, next) => {
    const token = socket.handshake.auth.token; // JWT from client
    const { map_id } = socket.handshake.query; // map_id from query

    if (!token) {
      return next(new Error('Authentication error: Token is required'));
    }

    if (!map_id) {
      return next(new Error('Validation error: map_id is required'));
    }

    try {
      // Verify JWT
      const user = jwt.verify(token, config.jwt_secret) as { id: string; name: string; email: string };
      socket.data.user = user; // Attach user info to the socket

      // Validate map access
      const permission = await validateMapAccess(map_id as string, user.id);
      socket.data.user_permission = permission; // Attach permission info to the socket

      // Initialize mouse position and style
      socket.data.mouse_current_position = null; // { lat: number, lng: number }
      socket.data.mouse_style = `🐱`; // Assign a default mouse icon (can be customized)

      next(); // Proceed to the next middleware
    } catch (err) {
      const error = err as Error;
      return next(new Error(error.message || 'Authentication error'));
    }
  });

  mapNamespace.on('connection', (socket) => {
    console.log(`Client connected to /ws/map: ${socket.id}`);

    // Join a room based on map_id
    const map_id = Array.isArray(socket.handshake.query.map_id) ? socket.handshake.query.map_id[0] : socket.handshake.query.map_id;
    if (!map_id) {
      socket.disconnect(true);
      console.log(`Client disconnected: Missing map_id`);
      return;
    }

    socket.join(map_id);
    console.log(`Client ${socket.id} UserID ${socket.data.user.id} Username ${socket.data.user.name} joined room: ${map_id}`);

    socket.broadcast.to(map_id).emit(MessageType.USER_JOIN, {
      user: socket.data.user,
      timestamp: new Date().toISOString(),
    } as WebSocketMessage);

    // Handle map-specific events
    socket.on(MessageType.MESSAGE, (data) => {
      console.log(`Map event received in room ${map_id}: ${data}`);

      // Broadcast to all clients in the same room
      socket.broadcast.to(map_id).emit(MessageType.MESSAGE, {
        payload: data,
        user: socket.data.user,
        timestamp: new Date().toISOString(),
      } as WebSocketMessage);
    });

    // Function to broadcast unique users in the room
    const broadcastRoomUsers = () => {
      const allClients = Array.from(mapNamespace.adapter.rooms.get(map_id) || []);
      const uniqueUsers = Array.from(
        new Map(
          allClients.map((clientId) => {
            const clientSocket = mapNamespace.sockets.get(clientId);
            return [
              clientSocket?.data.user.id, // Use user ID as the key for uniqueness
              {
                user: clientSocket?.data.user,
                style: clientSocket?.data.mouse_style,
              },
            ];
          })
        ).values()
      );

      mapNamespace.to(map_id).emit(MessageType.ROOM_USERS, {
        payload: uniqueUsers,
        timestamp: new Date().toISOString(),
      } as WebSocketMessage);
    };

    broadcastRoomUsers();

    // Handle mouse_move event
    socket.on(MessageType.MOUSE_MOVE, (data: Position) => {
      socket.data.mouse_current_position = data;

      const allClients = Array.from(mapNamespace.adapter.rooms.get(map_id) || []);

      allClients.forEach((clientId) => {
        const clientSocket = mapNamespace.sockets.get(clientId);

        if (!clientSocket) return;

        const otherClients = allClients
          .filter((otherClientId) => otherClientId !== clientId)
          .map((otherClientId) => {
            const otherSocket = mapNamespace.sockets.get(otherClientId);
            return {
              user: otherSocket?.data.user,
              position: otherSocket?.data.mouse_current_position,
              style: otherSocket?.data.mouse_style,
            };
          })
          .filter((client) => client.position);

        clientSocket.emit(MessageType.CONN_POSITIONS, {
          payload: otherClients,
          timestamp: new Date().toISOString(),
        } as WebSocketMessage);
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Client disconnected from /ws/map: ${socket.id}`);
      socket.broadcast.to(map_id).emit(MessageType.USER_LEAVE, {
        user: socket.data.user,
        timestamp: new Date().toISOString(),
      } as WebSocketMessage);

      broadcastRoomUsers();
    });
  });


  // Register global event listeners
  eventBus.on(EventTypes.PIN_CREATED, ({ mapId, pin }) => {
    mapNamespace.to(mapId).emit(MessageType.EVENT, {
      type: EventTypes.PIN_CREATED,
      payload: { pin },
      timestamp: new Date().toISOString(),
    } as WebSocketEvent);
  });

  eventBus.on(EventTypes.PIN_UPDATED, ({ mapId, pin }) => {
    mapNamespace.to(mapId).emit(MessageType.EVENT, {
      type: EventTypes.PIN_UPDATED,
      payload: { pin },
      timestamp: new Date().toISOString(),
    } as WebSocketEvent);
  });

  eventBus.on(EventTypes.PIN_DELETED, ({ mapId, pin }) => {
    mapNamespace.to(mapId).emit(MessageType.EVENT, {
      type: EventTypes.PIN_DELETED,
      payload: { pin },
      timestamp: new Date().toISOString(),
    } as WebSocketEvent);
  });

  eventBus.on(EventTypes.ALBUM_CREATED, ({ mapId, album }) => {
    mapNamespace.to(mapId).emit(MessageType.EVENT, {
      type: EventTypes.ALBUM_CREATED,
      payload: { album },
      timestamp: new Date().toISOString(),
    } as WebSocketEvent);
  });

  eventBus.on(EventTypes.ALBUM_UPDATED, ({ mapId, album }) => {
    mapNamespace.to(mapId).emit(MessageType.EVENT, {
      type: EventTypes.ALBUM_UPDATED,
      payload: { album },
      timestamp: new Date().toISOString(),
    } as WebSocketEvent);
  });

  eventBus.on(EventTypes.ALBUM_DELETED, ({ mapId, album }) => {
    mapNamespace.to(mapId).emit(MessageType.EVENT, {
      type: EventTypes.ALBUM_DELETED,
      payload: { album },
      timestamp: new Date().toISOString(),
    } as WebSocketEvent);
  });
}