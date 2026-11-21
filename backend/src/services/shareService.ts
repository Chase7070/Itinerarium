import Share from '@/models/share';
import Map from '@/models/map';
import { IUser, User } from '@/models/user';
import { ApiError, ApiErrorCode, ApiErrorReason } from '@/types/api';

/**
 * Update the share information for a map.
 * @param mapId - The ID of the map to update the share information for.
 * @param updates - The updates to apply to the share information.
 */
export const updateShare = async (
    mapId: string,
    updates: {
        range: 'private' | 'anyone' | 'assigned';
        relevant_ids?: { id: string; permission: 'read' | 'write' }[]
    }
) => {
    // Find the share associated with the map
    const share = await Share.findOne({ target_id: mapId, scene: 'map' });
    if (!share) {
        throw new ApiError(ApiErrorCode.NOT_FOUND, ApiErrorReason.RESOURCE_NOT_FOUND, 'Share information not found');
    }


    // Find the map associated with the share
    const map = await Map.findById(mapId);
    if (!map) {
        throw new ApiError(ApiErrorCode.NOT_FOUND, ApiErrorReason.RESOURCE_NOT_FOUND, 'Map not found');
    }

    share.access.range = updates.range;

    switch (share.access.range) {
        case 'private':
            // Clear relevant_ids and map collaborators
            share.access.relevant_ids = [];
            map.collaborators = [];
            break;

        case 'anyone':
        case 'assigned':
            // Set relevant_ids for assigned range
            share.access.relevant_ids = updates.relevant_ids;

            // Find users by their IDs (relevant_ids)
            const userIds = updates.relevant_ids?.map((user) => user.id) || [];

            const validUserIds = new Set(userIds);
            map.collaborators = map.collaborators.filter((collaboratorId) =>
                validUserIds.has(collaboratorId.toString())
            );

            break;
    }
    share.owner = map.owner; // Ensure the owner is set to the map's owner

    // Save the updated share and map
    await share.save();
    await map.save();

    return share;
};


/**
 * Get share information by code and validate access.
 * 
 * @param code - The unique code of the share to retrieve.
 * @param user - The authenticated user object containing `id` and `email`.
 * @returns The share document if the user has access.
 * 
 * @throws ApiError - If the share is not found or the user does not have access.
 */
export const getShareByCode = async (code: string, user: { id: string; email: string }): Promise<{ share: any; permission: 'read' | 'write' }> => {
    // Fetch the share by code
    const share = await Share.findOne({ code });
    if (!share) {
        throw new ApiError(ApiErrorCode.NOT_FOUND, ApiErrorReason.RESOURCE_NOT_FOUND, 'Share not found');
    }

    const map = await Map.findById(share.target_id);
    if (!map) {
        throw new ApiError(ApiErrorCode.NOT_FOUND, ApiErrorReason.RESOURCE_NOT_FOUND, 'Associated map not found');
    }
    share.map = map;

    // Check if the user has access to the share
    const isOwner = share.owner.toString() === user.id; // Check if the user is the owner
    const isPublic = share.access.range === 'anyone'; // Check if the share is public
    const sharedUser = share.access.relevant_ids?.find((entry) => entry.id === user.id); // Check if the user is in relevant_ids
    const userPermission = sharedUser?.permission; // 'read' or 'write'

    const hasAccess = isOwner || isPublic || sharedUser;

    if (!hasAccess) {
        throw new ApiError(ApiErrorCode.FORBIDDEN, ApiErrorReason.ACCESS_DENIED, 'You do not have access to this share');
    }

    // Determine the user's permission level
    let permission: 'read' | 'write' = 'read';
    if (isOwner) {
        permission = 'write'; // Owners always have write access
    } else if (sharedUser) {
        permission = userPermission || 'read'; // Use the shared user's permission, default to 'read'
    } else if (isPublic) {
        permission = 'read'; // Public shares grant read access
    }

    if (share.access?.relevant_ids) {
        const userIds = share.access.relevant_ids.map((rel) => rel.id);
        const users: IUser[] = await User.find({ _id: { $in: userIds } });

        // Map user information back to `relevant_ids`
        const userMap = users.reduce((acc, user) => {
            acc[user.id.toString()] = user;
            return acc;
        }, {} as Record<string, IUser>);


        share.access.relevant_ids = share.access.relevant_ids.map((rel) => {
            const updatedRel = {
                ...rel,
                user: userMap[rel.id] || null,
            };
            return updatedRel;
        });
    }

    return { share, permission };
};