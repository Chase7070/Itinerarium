import Map from '@/models/map';
import MapPin from '@/models/mapPin';
import { eventBus, EventTypes } from '@/events/eventBus';
import { ApiError, ApiErrorCode, ApiErrorReason } from '@/types/api';
import mongoose from 'mongoose';

/**
 * Create a new map pin.
 * @param mapId - The ID of the map.
 * @param userId - The ID of the user creating the pin.
 * @param data - The data for the map pin.
 */
export const createMapPin = async (mapId: string, userId: string, data: any) => {
    const mapPin = await MapPin.create({
        ...data,
        map_id: mapId,
        user_id: userId,
    });

    // Emit event after pin creation
    eventBus.emit(EventTypes.PIN_CREATED, { mapId, pin: mapPin });

    return mapPin;
};

/**
 * Get all map pins for a specific map.
 * @param mapId - The ID of the map.
 */


export const getMapPinsByMapId = async (mapId: string) => {
    const objectMapId = new mongoose.Types.ObjectId(mapId);
    return await MapPin.find({ map_id: objectMapId });
};
/**
 * Update a map pin by ID.
 * @param pinId - The ID of the map pin.
 * @param updates - The updates to apply to the map pin.
 */
export const updateMapPin = async (pinId: string, updates: any) => {
    const mapPin = await MapPin.findByIdAndUpdate(pinId, updates, { new: true });
    if (!mapPin) {
        throw new ApiError(ApiErrorCode.NOT_FOUND, ApiErrorReason.RESOURCE_NOT_FOUND, 'Map pin not found');
    }

    // Emit event after pin update
    eventBus.emit(EventTypes.PIN_UPDATED, { mapId: mapPin.map_id.toString(), pin: mapPin });

    return mapPin;
};

/**
 * Delete a map pin by ID.
 * @param pinId - The ID of the map pin.
 */
export const deleteMapPin = async (pinId: string) => {
    const mapPin = await MapPin.findByIdAndDelete(pinId);
    if (!mapPin) {
        throw new ApiError(ApiErrorCode.NOT_FOUND, ApiErrorReason.RESOURCE_NOT_FOUND, 'Map pin not found');
    }

    // Emit event after pin creation
    eventBus.emit(EventTypes.PIN_DELETED, { mapId: mapPin.map_id.toString(), pin: mapPin });

    return mapPin;
};

/**
 * Get all map pins for the current user, including user details.
 * @param userId - The ID of the user.
 */
export const getUserMapPins = async (userId: string) => {
    // Find all maps where the user is the owner or a collaborator
    const maps = await Map.find({
        $or: [
            { owner: userId }, // Maps owned by the user
            { collaborators: userId }, // Maps where the user is a collaborator
        ],
    }).select('_id'); // Only select the map IDs

    if (!maps || maps.length === 0) {
        throw new ApiError(ApiErrorCode.NOT_FOUND, ApiErrorReason.RESOURCE_NOT_FOUND, 'No maps found for the user');
    }

    // Extract map IDs
    const mapIds = maps.map((map) => map.id);

    // Find all pins associated with the maps and populate user details
    const mapPins = await MapPin.find({ map_id: { $in: mapIds } }).populate({
        path: 'user_id', // Populate the user_id field
        select: 'email name', // Only include specific fields from the User model
    });

    return mapPins;
};