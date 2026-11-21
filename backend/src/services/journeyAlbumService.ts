import { eventBus, EventTypes } from '@/events/eventBus';
import JourneyAlbum from '@/models/journeyAlbum';
import { ApiError, ApiErrorCode, ApiErrorReason } from '@/types/api';

export const getJourneyAlbumById = async (albumId: string, userId: string) => {
    const journeyAlbum = await JourneyAlbum.findOne({
        _id: albumId,
        user_id: userId, // Ensure the album belongs to the current user
    });

    if (!journeyAlbum) {
        throw new ApiError(ApiErrorCode.NOT_FOUND, ApiErrorReason.RESOURCE_NOT_FOUND, 'Journey album not found');
    }

    return journeyAlbum;
};

export const createJourneyAlbum = async (mapId: string, mapPinId: string, userId: string, data: any) => {
    const album = await JourneyAlbum.create({
        ...data,
        map_id: mapId, // Set the map_id
        map_pin_id: mapPinId,
        user_id: userId,
    });

    // Emit event after album creation
    eventBus.emit(EventTypes.ALBUM_CREATED, { mapId, mapPinId, album });

    return album;
};

export const updateJourneyAlbum = async (albumId: string, updates: any) => {
    const album = await JourneyAlbum.findByIdAndUpdate(albumId, updates, { new: true });
    if (!album) {
        throw new ApiError(ApiErrorCode.NOT_FOUND, ApiErrorReason.RESOURCE_NOT_FOUND, 'Album not found');
    }

    // Emit event after album update
    eventBus.emit(EventTypes.ALBUM_UPDATED, { mapId: album.map_id.toString(), mapPinId: album.map_pin_id, album });

    return album;
};

export const deleteJourneyAlbum = async (albumId: string, userId: string) => {
    const journeyAlbum = await JourneyAlbum.findOneAndDelete({
        _id: albumId,
        user_id: userId, // Ensure the album belongs to the current user
    });

    if (!journeyAlbum) {
        throw new ApiError(ApiErrorCode.NOT_FOUND, ApiErrorReason.RESOURCE_NOT_FOUND, 'Journey album not found');
    }

    // Emit event after album update
    eventBus.emit(EventTypes.ALBUM_DELETED, { mapId: journeyAlbum.map_id.toString(), mapPinId: journeyAlbum.map_pin_id, journeyAlbum });

    return journeyAlbum;
};

export const getAllJourneyAlbums = async (mapPinId: string) => {
    const albums = await JourneyAlbum.find({ map_pin_id: mapPinId });

    return albums;
};