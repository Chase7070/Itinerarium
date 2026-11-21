import { User } from "./user";
import { Map } from "./map";

export interface Share {
    access: {
        range: 'private' | 'assigned' | 'anyone';
        relevant_ids: RelevantId[];
    };
    scene: string;
    code: string;
    target_id: string;
    owner: string;
    createdAt: string;
    updatedAt: string;
    id: string;
    map?: Map;
}

export interface RelevantId {
    id: string;
    permission: 'read' | 'write';
    user?: User;
}