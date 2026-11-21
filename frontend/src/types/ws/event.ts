export enum EventType {
    PIN_CREATED = 'pinCreated',
    PIN_UPDATED = 'pinUpdated',
    PIN_DELETED = 'pinDeleted',
    ALBUM_CREATED = 'albumCreated',
    ALBUM_UPDATED = 'albumUpdated',
    ALBUM_DELETED = 'albumDeleted',
}

export interface RoomUserInfo {
    id: string; // User ID
    name: string; // User name
    email: string; // User email
}

export interface WebSocketMessage<T = any> {
    payload: T; // Message payload (generic type)
    user?: RoomUserInfo; // Optional: User information with id and email only
    timestamp?: string; // Optional: Timestamp of the message
}

export enum MessageType {
    EVENT = 'event',
    MESSAGE = 'message',
    USER_JOIN = 'user_join',
    USER_LEAVE = 'user_leave',
    MOUSE_MOVE = 'mouse_move',
    CONN_POSITIONS = 'conn_positions',
    ROOM_USERS = 'room_users',
}

export interface WebSocketEvent<T> {
    type: EventType;
    payload: T;
    timestamp: string;
}

export interface Position {
    lat: number; // Latitude
    lng: number; // Longitude
}

export interface UserPosition {
    user: RoomUserInfo;
    position: Position;
    style: string; // Style of the user's position
}


export interface RoomUser {
    user: RoomUserInfo; // User information
    style: string; // Style of the user
}