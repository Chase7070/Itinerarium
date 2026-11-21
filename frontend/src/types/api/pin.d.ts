import { Pin } from '@/types/common/pin';


export interface GetMapPinsResponse {
    mapPins: Pin[];
}

export interface CreateMapPinRequest {
    geo_location: {
        lat: number;
        lng: number;
    };
    country?: string;
    city?: string;
}

export interface CreateMapPinResponse {
    mapPin: Pin;
}

export interface UpdateMapPinRequest {
    geo_location?: {
        lat: number;
        lng: number;
    };
    country?: string;
    city?: string;
}

export interface UpdateMapPinResponse {
    mapPin: Pin;
}