export enum MessageType {
    EVENT = 'event',
    MESSAGE = 'message',
    USER_JOIN = 'user_join',
    USER_LEAVE = 'user_leave',
    MOUSE_MOVE = 'mouse_move',
    CONN_POSITIONS = 'conn_positions',
    ROOM_USERS = 'room_users',
}

export interface WebSocketMessage<T = any> {
    payload: T; // Message payload (generic type)
    user?: {
        id: string; // User ID
        email: string; // User email
    }; // Optional: User information with id and email only
    timestamp?: string; // Optional: Timestamp of the message
}

/**
 * Event structure for WebSocket communication.
 */
export interface WebSocketEvent<T = any> {
    type: string; // The type of the event (e.g., "PIN_CREATED", "ALBUM_UPDATED")
    payload: T;   // The payload of the event (generic type)
    timestamp?: string; // Optional: Timestamp of the event
}

export interface Position {
    lat: number; // Latitude
    lng: number; // Longitude
}

export interface UserPosition {
    userId: string; // User ID
    position: Position;
    style: string; // Style of the user's position
}