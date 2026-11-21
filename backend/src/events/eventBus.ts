import { EventEmitter } from 'events';

export const eventBus = new EventEmitter();

// Define event types
export enum EventTypes {
    PIN_CREATED = 'pinCreated',
    PIN_UPDATED = 'pinUpdated',
    PIN_DELETED = 'pinDeleted',
    ALBUM_CREATED = 'albumCreated',
    ALBUM_UPDATED = 'albumUpdated',
    ALBUM_DELETED = 'albumDeleted',
}