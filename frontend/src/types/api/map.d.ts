import { Map } from '@/types/common/map';

export interface CreateMapRequest {
    name: string;
    description?: string;
}

export interface CreateMapResponse {
    map: Map;
}

export interface GetUserMapsResponse {
    maps: Map[];
}

export interface UpdateMapRequest {
    name?: string;
    description?: string;
}

export interface UpdateMapResponse {
    map: Map;
}