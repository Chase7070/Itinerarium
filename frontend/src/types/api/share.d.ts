import { Share, RelevantId } from '@/types/common/share';

export interface GetShareByCodeResponse {
    share: Share
    permission: 'read' | 'write';
}

export interface UpdateShareRequest {
    range: 'private' | 'assigned' | 'anyone';
    relevant_ids?: RelevantId[];
}
