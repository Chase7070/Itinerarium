import { JourneyAblum } from '@/types/common/album';

export interface GetJourneyAlbumsResponse {
    journeyAlbums: JourneyAblum[];
}

export interface GetJourneyAlbumResponse {
    journeyAlbum: JourneyAblum;
}

export interface CreateJourneyAlbumRequest {
    name: string;
    images: {
        key: string;
    }[];
}

export interface CreateJourneyAlbumResponse {
    journeyAlbum: JourneyAblum;
}

export interface UpdateJourneyAlbumRequest {
    name?: string;
    images?: {
        key: string;
    }[];
}

export interface UpdateJourneyAlbumResponse {
    journeyAlbum: JourneyAblum;
}