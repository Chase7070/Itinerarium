import Map from '@/models/map';
import Share, { IShare } from '@/models/share';
import { User, IUser } from '@/models/user';
import { customAlphabet } from 'nanoid';
import { ApiError, ApiErrorCode, ApiErrorReason } from '@/types/api';

// Nanoid generator for short codes
const generateShortCode = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 8);

/**
 * Create a new map and its associated share.
 */
export const createMap = async (userId: string, data: { name?: string; description?: string }) => {
    // Create the map
    const map = await Map.create({
        ...data,
        owner: userId,
    });

    // Create the share for the map
    await Share.create({
        scene: 'map',
        code: generateShortCode(),
        target_id: map._id,
        owner: userId,
        access: {
            range: 'private', // Default access range
        },
    });

    return map;
};

/**
 * Get all maps for a user, including their share information.
 * This includes maps owned by the user or where the user is a collaborator.
 */
export const getUserMaps = async (userId: string) => {
    const maps = await Map.find({
        $or: [
            { owner: userId }, // Maps owned by the user
            { collaborators: userId }, // Maps where the user is a collaborator
        ],
    })
        .populate({
            path: 'share', // Populate the share field
            match: { scene: 'map' }, // Only include shares where scene is 'map'
        })
        .exec();

    for (const map of maps) {
        if (map.share?.access?.relevant_ids) {
            const userIds = map.share.access.relevant_ids.map((rel) => rel.id);
            const users: IUser[] = await User.find({ _id: { $in: userIds } });

            // Map user information back to `relevant_ids`
            const userMap = users.reduce((acc, user) => {
                acc[user.id.toString()] = user;
                return acc;
            }, {} as Record<string, IUser>);


            map.share.access.relevant_ids = map.share.access.relevant_ids.map((rel) => {
                const updatedRel = {
                    ...rel,
                    user: userMap[rel.id] || null,
                };
                return updatedRel;
            });
        }
    }

    return maps;
};

/**
 * Update a map by ID.
 */
export const updateMap = async (userId: string, mapId: string, updates: { name?: string; description?: string }) => {
    const map = await Map.findOneAndUpdate(
        { _id: mapId, owner: userId },
        updates,
        { new: true }
    );

    if (!map) {
        throw new ApiError(ApiErrorCode.NOT_FOUND, ApiErrorReason.RESOURCE_NOT_FOUND, 'Map not found');
    }

    return map;
};

/**
 * Delete a map by ID.
 */
export const deleteMap = async (userId: string, mapId: string) => {
    const map = await Map.findOne({ _id: mapId, owner: userId });
    if (!map) {
        throw new ApiError(ApiErrorCode.NOT_FOUND, ApiErrorReason.RESOURCE_NOT_FOUND, 'Map not found');
    }

    if (map.type === 'default') {
        throw new ApiError(ApiErrorCode.INVALID_ARGUMENT, ApiErrorReason.INVALID_ARGUMENT, 'Default maps cannot be deleted');
    }

    await Map.deleteOne({ _id: mapId });
};


/**
 * Validate if a user has access to a specific map.
 * @param mapId - The ID of the map to validate.
 * @param userId - The ID of the user making the request.
 * @throws ApiError if the user does not have access to the map.
 */
export const validateMapAccess = async (mapId: string, userId: string): Promise<'read' | 'write'> => {
    const map = await Map.findById(mapId).populate<{ share: IShare }>({
        path: 'share',
        match: { scene: 'map' },
    });

    if (!map) {
        throw new ApiError(ApiErrorCode.NOT_FOUND, ApiErrorReason.RESOURCE_NOT_FOUND, 'Map not found');
    }

    const share = map.share; // The populated share document
    const isOwner = map.owner.toString() === userId; // Check if the user is the map owner
    const isPublic = share?.access?.range === 'anyone'; // Check if the map is public

    // Check if the user is in the share's relevant_ids and get their permission
    const sharedUser = share?.access.relevant_ids?.find((user) => user.id === userId);
    const userPermission = sharedUser?.permission; // 'read' or 'write'

    if (isOwner || userPermission === 'write') {
        return 'write';
    }

    if (isPublic || userPermission === 'read') {
        return 'read';
    }

    throw new ApiError(ApiErrorCode.FORBIDDEN, ApiErrorReason.ACCESS_DENIED, 'You do not have access to this map');
};